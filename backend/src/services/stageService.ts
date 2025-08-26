// backend/src/services/stageService.ts
import { CustomError } from '../utils/errors';
import { PointsService } from './pointsService';
import { prisma } from '../lib/prisma';

interface StageData {
  stageNumber: number;
  name: string;
  description?: string;
  pointsRequired: number;
  color?: string;
}

interface StageConfirmationData {
  progressionId: string;
  domId: string;
  notes?: string;
  approved: boolean;
}

interface EntityFilter {
  userId: string;
  userRole: 'DOM' | 'SUB' | 'OBSERVER' | 'ADMIN';
  currentStage?: number;
  entityType?: 'TASK' | 'RULE' | 'GOAL';
  activeOnly?: boolean;
}

export class StageService {
  static async createStage(stageData: StageData) {
    const existingStage = await prisma.stage.findUnique({
      where: { stageNumber: stageData.stageNumber }
    });

    if (existingStage) {
      throw new CustomError('VALIDATION_ERROR', `Stufe ${stageData.stageNumber} existiert bereits`);
    }

    const stage = await prisma.stage.create({
      data: stageData
    });

    // Invalidate points service cache so it reloads stage thresholds
    PointsService.invalidateStageThresholds();

    return stage;
  }

  static async updateStage(stageId: string, updateData: Partial<StageData>) {
    const stage = await prisma.stage.findUnique({
      where: { id: stageId }
    });

    if (!stage) {
      throw new CustomError('NOT_FOUND', 'Stufe nicht gefunden');
    }

    if (updateData.stageNumber && updateData.stageNumber !== stage.stageNumber) {
      const existingStage = await prisma.stage.findUnique({
        where: { stageNumber: updateData.stageNumber }
      });

      if (existingStage) {
        throw new CustomError('VALIDATION_ERROR', `Stufe ${updateData.stageNumber} existiert bereits`);
      }
    }

    const updatedStage = await prisma.stage.update({
      where: { id: stageId },
      data: updateData
    });

    // Invalidate points service cache so it reloads stage thresholds
    PointsService.invalidateStageThresholds();

    return updatedStage;
  }

  static async getAllStages() {
    const stages = await prisma.stage.findMany({
      where: { isActive: true },
      orderBy: { stageNumber: 'asc' },
      include: {
        _count: {
          select: {
            tasks: true,
            rules: true,
            goals: true,
            progressions: true
          }
        }
      }
    });

    return stages;
  }

  static async getStageById(stageId: string) {
    const stage = await prisma.stage.findUnique({
      where: { id: stageId },
      include: {
        tasks: {
          where: { status: 'ACTIVE' },
          include: {
            creator: { select: { displayName: true, email: true } },
            assignedTo: { select: { displayName: true, email: true } }
          }
        },
        rules: {
          where: { isActive: true },
          include: {
            creator: { select: { displayName: true, email: true } },
            applicableTo: { select: { displayName: true, email: true } },
            violations: { take: 5, orderBy: { occurredAt: 'desc' } }
          }
        },
        goals: {
          where: { status: 'ACTIVE' },
          include: {
            creator: { select: { displayName: true, email: true } },
            assignedTo: { select: { displayName: true, email: true } }
          }
        },
        progressions: {
          take: 10,
          orderBy: { triggeredAt: 'desc' },
          include: {
            user: { select: { displayName: true, email: true } }
          }
        }
      }
    });

    if (!stage) {
      throw new CustomError('NOT_FOUND', 'Stufe nicht gefunden');
    }

    return stage;
  }

  static async getStageByNumber(stageNumber: number) {
    const stage = await prisma.stage.findUnique({
      where: { stageNumber },
      include: {
        tasks: { where: { status: 'ACTIVE' } },
        rules: { where: { isActive: true } },
        goals: { where: { status: 'ACTIVE' } },
        _count: {
          select: {
            progressions: { where: { status: 'CONFIRMED' } }
          }
        }
      }
    });

    if (!stage) {
      throw new CustomError('NOT_FOUND', `Stufe ${stageNumber} nicht gefunden`);
    }

    return stage;
  }

  static async getActiveEntitiesForStage(filter: EntityFilter) {
    const { userId, userRole, currentStage, entityType, activeOnly = true } = filter;

    const baseWhere = {
      activeFromStage: { lte: currentStage || 1 },
      OR: [
        { activeToStage: null },
        { activeToStage: { gte: currentStage || 1 } }
      ]
    };

    let entities: any[] = [];

    if (!entityType || entityType === 'TASK') {
      const taskWhere = {
        ...baseWhere,
        ...(activeOnly && { status: 'ACTIVE' }),
        ...(userRole === 'SUB' && { assignedToId: userId })
      };

      const tasks = await prisma.task.findMany({
        where: taskWhere,
        include: {
          creator: { select: { displayName: true, role: true } },
          assignedTo: { select: { displayName: true, role: true } }
        },
        orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }]
      });

      entities.push(...tasks.map(task => ({ ...task, entityType: 'TASK' })));
    }

    if (!entityType || entityType === 'RULE') {
      const ruleWhere = {
        ...baseWhere,
        ...(activeOnly && { isActive: true }),
        ...(userRole === 'SUB' && { applicableToId: userId })
      };

      const rules = await prisma.rule.findMany({
        where: ruleWhere,
        include: {
          creator: { select: { displayName: true, role: true } },
          applicableTo: { select: { displayName: true, role: true } },
          violations: {
            where: { userId },
            orderBy: { occurredAt: 'desc' },
            take: 3
          }
        },
        orderBy: { severity: 'desc' }
      });

      entities.push(...rules.map(rule => ({ ...rule, entityType: 'RULE' })));
    }

    if (!entityType || entityType === 'GOAL') {
      const goalWhere = {
        ...baseWhere,
        ...(activeOnly && { status: 'ACTIVE' }),
        ...(userRole === 'SUB' && { assignedToId: userId })
      };

      const goals = await prisma.goal.findMany({
        where: goalWhere,
        include: {
          creator: { select: { displayName: true, role: true } },
          assignedTo: { select: { displayName: true, role: true } }
        },
        orderBy: [{ priority: 'desc' }, { deadline: 'asc' }]
      });

      entities.push(...goals.map(goal => ({ ...goal, entityType: 'GOAL' })));
    }

    return entities;
  }

  static async getPendingProgressions(domId?: string) {
    const where = domId ? 
      {
        status: 'PENDING',
        user: {
          domConnection: { domId }
        }
      } : 
      { status: 'PENDING' };

    const progressions = await prisma.stageProgression.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            pointAccount: {
              select: {
                totalPoints: true,
                currentStage: true
              }
            }
          }
        },
        stage: true
      },
      orderBy: { triggeredAt: 'asc' }
    });

    return progressions;
  }

  static async confirmStageProgression(confirmationData: StageConfirmationData) {
    const { progressionId, domId, notes, approved } = confirmationData;

    const progression = await prisma.stageProgression.findUnique({
      where: { id: progressionId },
      include: {
        user: {
          include: {
            domConnection: true,
            pointAccount: true
          }
        }
      }
    });

    if (!progression) {
      throw new CustomError('NOT_FOUND', 'Stufenfortschritt nicht gefunden');
    }

    if (progression.status !== 'PENDING') {
      throw new CustomError('VALIDATION_ERROR', 'Stufenfortschritt wurde bereits bearbeitet');
    }

    if (progression.user.domConnection?.domId !== domId) {
      throw new CustomError('FORBIDDEN', 'Nur der zugewiesene DOM kann diesen Fortschritt bestätigen');
    }

    const isExpired = progression.karenzzeit && new Date() > progression.karenzzeit;
    if (isExpired && !approved) {
      throw new CustomError('VALIDATION_ERROR', 'Karenzzeit ist abgelaufen');
    }

    return await prisma.$transaction(async (prisma) => {
      const updatedProgression = await prisma.stageProgression.update({
        where: { id: progressionId },
        data: {
          status: approved ? 'CONFIRMED' : 'REJECTED',
          confirmedAt: new Date(),
          confirmedBy: domId,
          notes
        }
      });

      if (approved && progression.user.pointAccount) {
        await prisma.globalPointAccount.update({
          where: { userId: progression.userId },
          data: {
            currentStage: progression.toStage,
            lastStageChange: new Date()
          }
        });
      }

      return updatedProgression;
    });
  }

  static async getStageProgressionHistory(userId: string, limit: number = 20) {
    const progressions = await prisma.stageProgression.findMany({
      where: { userId },
      include: {
        stage: true
      },
      orderBy: { triggeredAt: 'desc' },
      take: limit
    });

    return progressions;
  }

  static async getStageStatistics() {
    const stageDistribution = await prisma.globalPointAccount.groupBy({
      by: ['currentStage'],
      _count: { _all: true },
      _avg: { totalPoints: true },
      _min: { totalPoints: true },
      _max: { totalPoints: true }
    });

    const progressionStats = await prisma.stageProgression.groupBy({
      by: ['status'],
      _count: { _all: true }
    });

    const recentProgressions = await prisma.stageProgression.findMany({
      where: {
        triggeredAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: {
        user: { select: { displayName: true, role: true } },
        stage: { select: { name: true, stageNumber: true } }
      },
      orderBy: { triggeredAt: 'desc' },
      take: 50
    });

    const entityCounts = await Promise.all([
      prisma.task.groupBy({
        by: ['activeFromStage'],
        _count: { _all: true }
      }),
      prisma.rule.groupBy({
        by: ['activeFromStage'],
        _count: { _all: true }
      }),
      prisma.goal.groupBy({
        by: ['activeFromStage'],
        _count: { _all: true }
      })
    ]);

    return {
      stageDistribution: stageDistribution.map(item => ({
        stage: item.currentStage,
        userCount: item._count._all,
        avgPoints: Math.round(item._avg.totalPoints || 0),
        minPoints: item._min.totalPoints || 0,
        maxPoints: item._max.totalPoints || 0
      })),
      progressionStats: progressionStats.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item._count._all;
        return acc;
      }, {} as Record<string, number>),
      recentProgressions,
      entityDistribution: {
        tasks: this.groupByStage(entityCounts[0]),
        rules: this.groupByStage(entityCounts[1]),
        goals: this.groupByStage(entityCounts[2])
      }
    };
  }

  private static groupByStage(data: any[]) {
    return data.reduce((acc, item) => {
      acc[item.activeFromStage] = item._count._all;
      return acc;
    }, {} as Record<number, number>);
  }

  static async deleteStage(stageId: string) {
    const stage = await prisma.stage.findUnique({
      where: { id: stageId },
      include: {
        _count: {
          select: {
            tasks: true,
            rules: true,
            goals: true,
            progressions: true
          }
        }
      }
    });

    if (!stage) {
      throw new CustomError('NOT_FOUND', 'Stufe nicht gefunden');
    }

    const hasAssociatedData = Object.values(stage._count).some(count => count > 0);
    if (hasAssociatedData) {
      throw new CustomError('VALIDATION_ERROR', 'Stufe kann nicht gelöscht werden, da sie mit Daten verknüpft ist');
    }

    await prisma.stage.delete({
      where: { id: stageId }
    });

    return { success: true, message: 'Stufe erfolgreich gelöscht' };
  }

  static async toggleStageStatus(stageId: string) {
    const stage = await prisma.stage.findUnique({
      where: { id: stageId }
    });

    if (!stage) {
      throw new CustomError('NOT_FOUND', 'Stufe nicht gefunden');
    }

    const updatedStage = await prisma.stage.update({
      where: { id: stageId },
      data: { isActive: !stage.isActive }
    });

    return updatedStage;
  }

  static async initializeDefaultStages() {
    const existingStages = await prisma.stage.count();
    if (existingStages > 0) {
      return { message: 'Stufen bereits initialisiert' };
    }

    const defaultStages = [
      {
        stageNumber: 1,
        name: 'Anfänger',
        description: 'Erste Schritte im System',
        pointsRequired: 0,
        color: '#10B981'
      },
      {
        stageNumber: 2,
        name: 'Lernender',
        description: 'Grundlagen verstehen und umsetzen',
        pointsRequired: 100,
        color: '#3B82F6'
      },
      {
        stageNumber: 3,
        name: 'Fortgeschrittener',
        description: 'Routinen entwickeln und festigen',
        pointsRequired: 250,
        color: '#8B5CF6'
      },
      {
        stageNumber: 4,
        name: 'Kompetenter',
        description: 'Eigenverantwortung und Selbstdisziplin',
        pointsRequired: 450,
        color: '#F59E0B'
      },
      {
        stageNumber: 5,
        name: 'Erfahrener',
        description: 'Herausforderungen meistern',
        pointsRequired: 700,
        color: '#EF4444'
      },
      {
        stageNumber: 6,
        name: 'Experte',
        description: 'Hohe Disziplin und Verantwortung',
        pointsRequired: 1000,
        color: '#EC4899'
      },
      {
        stageNumber: 7,
        name: 'Meister',
        description: 'Exzellenz in allen Bereichen',
        pointsRequired: 1350,
        color: '#6366F1'
      },
      {
        stageNumber: 8,
        name: 'Mentor',
        description: 'Andere anleiten und unterstützen',
        pointsRequired: 1750,
        color: '#14B8A6'
      },
      {
        stageNumber: 9,
        name: 'Virtuose',
        description: 'Perfektion in der Ausführung',
        pointsRequired: 2200,
        color: '#F97316'
      },
      {
        stageNumber: 10,
        name: 'Legendär',
        description: 'Höchste Stufe der Entwicklung',
        pointsRequired: 2700,
        color: '#DC2626'
      }
    ];

    const createdStages = await prisma.$transaction(
      defaultStages.map(stage => 
        prisma.stage.create({ data: stage })
      )
    );

    // Invalidate points service cache so it reloads stage thresholds
    PointsService.invalidateStageThresholds();

    return {
      message: `${createdStages.length} Standard-Stufen erfolgreich initialisiert`,
      stages: createdStages
    };
  }
}
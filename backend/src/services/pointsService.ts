// backend/src/services/pointsService.ts
import { CustomError } from '../utils/errors';
import { prisma } from '../lib/prisma';

interface PointTransactionData {
  userId: string;
  amount: number;
  reason: string;
  description?: string;
  category: string;
  entityType?: string;
  entityId?: string;
}

interface StageThresholds {
  [stageNumber: number]: number;
}

export class PointsService {
  private static stageThresholds: StageThresholds = {};
  private static thresholdsLoaded = false;

  // Method to invalidate thresholds cache (call when stages are created/updated)
  static invalidateStageThresholds() {
    this.thresholdsLoaded = false;
    this.stageThresholds = {};
  }

  // Load stage thresholds from database
  private static async loadStageThresholds() {
    if (this.thresholdsLoaded) return;

    try {
      const stages = await prisma.stage.findMany({
        orderBy: { stageNumber: 'asc' }
      });

      this.stageThresholds = {};
      stages.forEach(stage => {
        this.stageThresholds[stage.stageNumber] = stage.pointsRequired;
      });

      // Fallback if no stages in database
      if (Object.keys(this.stageThresholds).length === 0) {
        this.stageThresholds = {
          1: 0,
          2: 100,
          3: 250,
          4: 450,
          5: 700,
          6: 1000,
          7: 1350,
          8: 1750,
          9: 2200,
          10: 2700
        };
      }

      this.thresholdsLoaded = true;
    } catch (error) {
      console.error('Error loading stage thresholds from database:', error);
      // Use hardcoded fallback
      this.stageThresholds = {
        1: 0,
        2: 100,
        3: 250,
        4: 450,
        5: 700,
        6: 1000,
        7: 1350,
        8: 1750,
        9: 2200,
        10: 2700
      };
      this.thresholdsLoaded = true;
    }
  }

  static async getOrCreatePointAccount(userId: string) {
    await this.loadStageThresholds();
    let pointAccount = await prisma.globalPointAccount.findUnique({
      where: { userId }
    });

    if (!pointAccount) {
      pointAccount = await prisma.globalPointAccount.create({
        data: {
          userId,
          totalPoints: 0,
          currentStage: 1,
          pointsInStage: 0,
          nextStageThreshold: this.stageThresholds[2] || 100
        }
      });
    }

    return pointAccount;
  }

  static async addPoints(transactionData: PointTransactionData) {
    const { userId, amount, reason, description, category, entityType, entityId } = transactionData;

    if (amount === 0) {
      throw new CustomError('VALIDATION_ERROR', 'Point amount cannot be zero');
    }

    return await prisma.$transaction(async (prisma) => {
      const pointAccount = await this.getOrCreatePointAccount(userId);
      
      const newTotalPoints = pointAccount.totalPoints + amount;
      const newPointsInStage = pointAccount.pointsInStage + amount;

      const transaction = await prisma.pointTransaction.create({
        data: {
          userId,
          amount,
          reason,
          description,
          category,
          entityType,
          entityId
        }
      });

      let stageChanged = false;
      let newStage = pointAccount.currentStage;
      let newNextThreshold = pointAccount.nextStageThreshold;

      if (amount > 0 && newTotalPoints >= pointAccount.nextStageThreshold) {
        const targetStage = await this.calculateTargetStage(newTotalPoints);
        if (targetStage > pointAccount.currentStage) {
          newStage = targetStage;
          newNextThreshold = this.stageThresholds[newStage + 1] || newTotalPoints + 500;
          stageChanged = true;

          await prisma.stageProgression.create({
            data: {
              userId,
              fromStage: pointAccount.currentStage,
              toStage: newStage,
              status: 'PENDING',
              karenzzeit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days grace period
            }
          });
        }
      }

      const updatedAccount = await prisma.globalPointAccount.update({
        where: { userId },
        data: {
          totalPoints: newTotalPoints,
          currentStage: newStage,
          pointsInStage: newPointsInStage,
          nextStageThreshold: newNextThreshold,
          ...(stageChanged && { lastStageChange: new Date() })
        }
      });

      return {
        transaction,
        pointAccount: updatedAccount,
        stageChanged,
        previousStage: pointAccount.currentStage,
        newStage
      };
    });
  }

  static async deductPoints(transactionData: PointTransactionData) {
    if (transactionData.amount > 0) {
      transactionData.amount = -transactionData.amount;
    }
    
    return await this.addPoints(transactionData);
  }

  static async getPointHistory(userId: string, limit: number = 50, offset: number = 0) {
    const transactions = await prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            displayName: true,
            email: true
          }
        }
      }
    });

    const totalCount = await prisma.pointTransaction.count({
      where: { userId }
    });

    return {
      transactions,
      totalCount,
      hasMore: offset + transactions.length < totalCount
    };
  }

  static async getPointSummary(userId: string) {
    const pointAccount = await this.getOrCreatePointAccount(userId);
    
    const recentTransactions = await prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyStats = await prisma.pointTransaction.groupBy({
      by: ['category'],
      where: {
        userId,
        createdAt: {
          gte: thisMonth
        }
      },
      _sum: {
        amount: true
      },
      _count: {
        _all: true
      }
    });

    const pendingProgression = await prisma.stageProgression.findFirst({
      where: {
        userId,
        status: 'PENDING'
      },
      orderBy: { triggeredAt: 'desc' }
    });

    return {
      pointAccount,
      recentTransactions,
      monthlyStats,
      pendingProgression,
      nextStageProgress: this.calculateStageProgress(pointAccount.totalPoints, pointAccount.currentStage)
    };
  }

  static async getCurrentStage(userId: string) {
    const pointAccount = await this.getOrCreatePointAccount(userId);
    
    const stage = await prisma.stage.findUnique({
      where: { stageNumber: pointAccount.currentStage }
    });

    return {
      pointAccount,
      stage,
      progress: await this.calculateStageProgress(pointAccount.totalPoints, pointAccount.currentStage)
    };
  }

  private static async calculateTargetStage(totalPoints: number): Promise<number> {
    await this.loadStageThresholds();
    let targetStage = 1;
    
    for (const [stage, threshold] of Object.entries(this.stageThresholds)) {
      if (totalPoints >= threshold) {
        targetStage = parseInt(stage);
      } else {
        break;
      }
    }
    
    return targetStage;
  }

  private static async calculateStageProgress(totalPoints: number, currentStage: number) {
    await this.loadStageThresholds();
    const currentThreshold = this.stageThresholds[currentStage] || 0;
    const nextThreshold = this.stageThresholds[currentStage + 1];
    
    if (!nextThreshold) {
      return {
        pointsInCurrentStage: totalPoints - currentThreshold,
        pointsToNextStage: 0,
        progressPercentage: 100,
        isMaxStage: true
      };
    }
    
    const pointsInCurrentStage = totalPoints - currentThreshold;
    const pointsNeededForStage = nextThreshold - currentThreshold;
    const progressPercentage = Math.min(100, (pointsInCurrentStage / pointsNeededForStage) * 100);
    
    return {
      pointsInCurrentStage,
      pointsToNextStage: nextThreshold - totalPoints,
      progressPercentage: Math.round(progressPercentage),
      isMaxStage: false,
      currentThreshold,
      nextThreshold
    };
  }

  static async getLeaderboard(limit: number = 20) {
    const topUsers = await prisma.globalPointAccount.findMany({
      take: limit,
      orderBy: [
        { totalPoints: 'desc' },
        { lastStageChange: 'desc' }
      ],
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            role: true
          }
        }
      }
    });

    return topUsers.map((account, index) => ({
      rank: index + 1,
      user: account.user,
      totalPoints: account.totalPoints,
      currentStage: account.currentStage,
      lastStageChange: account.lastStageChange
    }));
  }

  static async getStageThresholds() {
    await this.loadStageThresholds();
    return this.stageThresholds;
  }

  static async updateStageThresholds(newThresholds: StageThresholds) {
    this.stageThresholds = { ...this.stageThresholds, ...newThresholds };
    
    const affectedAccounts = await prisma.globalPointAccount.findMany({
      where: {
        totalPoints: {
          gte: Math.min(...Object.values(newThresholds))
        }
      }
    });

    for (const account of affectedAccounts) {
      const newStage = await this.calculateTargetStage(account.totalPoints);
      if (newStage !== account.currentStage) {
        await prisma.globalPointAccount.update({
          where: { userId: account.userId },
          data: {
            currentStage: newStage,
            nextStageThreshold: this.stageThresholds[newStage + 1] || account.totalPoints + 500
          }
        });
      }
    }

    return this.stageThresholds;
  }

  static async getPointStatistics(userId?: string) {
    const baseWhere = userId ? { userId } : {};
    
    const totalTransactions = await prisma.pointTransaction.count({
      where: baseWhere
    });

    const pointsDistribution = await prisma.pointTransaction.groupBy({
      by: ['category'],
      where: baseWhere,
      _sum: { amount: true },
      _count: { _all: true },
      _avg: { amount: true }
    });

    const dailyActivity = await prisma.pointTransaction.groupBy({
      by: ['createdAt'],
      where: {
        ...baseWhere,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      _sum: { amount: true },
      _count: { _all: true }
    });

    return {
      totalTransactions,
      pointsDistribution,
      dailyActivity: this.groupByDay(dailyActivity)
    };
  }

  private static groupByDay(data: any[]) {
    const grouped: { [date: string]: { totalPoints: number, transactionCount: number } } = {};
    
    data.forEach(item => {
      const date = item.createdAt.toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { totalPoints: 0, transactionCount: 0 };
      }
      grouped[date].totalPoints += item._sum.amount || 0;
      grouped[date].transactionCount += item._count._all || 0;
    });

    return Object.entries(grouped).map(([date, stats]) => ({
      date,
      ...stats
    })).sort((a, b) => a.date.localeCompare(b.date));
  }
}
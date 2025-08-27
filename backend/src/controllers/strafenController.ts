import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class StrafenController {
  static async getAllPunishments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { severity, category, userId: targetUserId, stageId } = req.query;
      const currentUserId = req.user?.id;
      const userRole = req.user?.role;
      
      if (!currentUserId) {
        throw new AppError('User not authenticated', 401);
      }

      let whereClause: any = {};
      
      // Users can only see their own punishments unless they're DOM/ADMIN
      if (userRole === 'SUB') {
        whereClause.userId = currentUserId;
      } else if (targetUserId) {
        whereClause.userId = targetUserId as string;
      }
      
      if (severity) whereClause.severity = severity as string;
      if (category) whereClause.category = category as string;

      // Stage isolation: Only return strafen for specific stage
      if (stageId) {
        whereClause.stageId = stageId as string;
      }

      const punishments = await prisma.strafe.findMany({
        where: whereClause,
        include: {
          User_Strafe_userIdToUser: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          User_Strafe_adminByToUser: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        },
        orderBy: [{ createdAt: 'desc' }]
      });

      res.json({
        success: true,
        data: punishments
      });
    } catch (error: any) {
      console.error('Error fetching punishments:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to fetch punishments' });
    }
  }

  static async getPunishmentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const punishment = await prisma.strafe.findUnique({
        where: { id },
        include: {
          User_Strafe_userIdToUser: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          User_Strafe_adminByToUser: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      if (!punishment) {
        throw new AppError('Punishment not found', 404);
      }

      // Check permissions
      if (punishment.userId !== userId && punishment.adminBy !== userId && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      res.json({
        success: true,
        data: punishment
      });
    } catch (error: any) {
      console.error('Error fetching punishment:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to fetch punishment' });
    }
  }

  static async createPunishment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const punishmentData = req.body;
      const adminBy = req.user?.id;

      if (!adminBy) {
        throw new AppError('User not authenticated', 401);
      }

      if (!punishmentData.stageId) {
        throw new AppError('stageId is required for stage isolation', 400);
      }

      // Remove fields that shouldn't be set directly
      delete punishmentData.id;
      delete punishmentData.createdAt;
      delete punishmentData.updatedAt;
      delete punishmentData.adminBy;

      const punishment = await prisma.strafe.create({
        data: {
          ...punishmentData,
          adminBy
        },
        include: {
          User_Strafe_userIdToUser: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          User_Strafe_adminByToUser: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: punishment
      });
    } catch (error: any) {
      console.error('Error creating punishment:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create punishment' });
    }
  }

  static async updatePunishment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingPunishment = await prisma.strafe.findUnique({
        where: { id }
      });

      if (!existingPunishment) {
        throw new AppError('Punishment not found', 404);
      }

      // Only admin or administrator can update
      if (existingPunishment.adminBy !== userId && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData.adminBy;
      delete updateData.userId;

      const updatedPunishment = await prisma.strafe.update({
        where: { id },
        data: updateData,
        include: {
          User_Strafe_userIdToUser: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          User_Strafe_adminByToUser: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: updatedPunishment
      });
    } catch (error: any) {
      console.error('Error updating punishment:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Punishment not found' });
      }
      res.status(500).json({ error: 'Failed to update punishment' });
    }
  }

  static async deletePunishment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingPunishment = await prisma.strafe.findUnique({
        where: { id }
      });

      if (!existingPunishment) {
        throw new AppError('Punishment not found', 404);
      }

      if (existingPunishment.adminBy !== userId && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      await prisma.strafe.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Punishment deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting punishment:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Punishment not found' });
      }
      res.status(500).json({ error: 'Failed to delete punishment' });
    }
  }
}

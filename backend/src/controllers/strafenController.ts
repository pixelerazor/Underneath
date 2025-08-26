import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class StrafenController {
  static async getAllPunishments(req: Request, res: Response) {
    try {
      const { severity, category, userId: targetUserId } = req.query;
      const currentUserId = req.user?.userId;
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

      const punishments = await prisma.strafe.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          administrator: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        },
        orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }]
      });

      res.json(punishments);
    } catch (error) {
      throw new AppError('Error fetching punishments', 500, error);
    }
  }

  static async getPunishmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const punishment = await prisma.strafe.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          administrator: {
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
        throw new AppError('Insufficient permissions', 403);
      }

      res.json(punishment);
    } catch (error) {
      throw new AppError('Error fetching punishment', 500, error);
    }
  }

  static async createPunishment(req: Request, res: Response) {
    try {
      const punishmentData = req.body;
      const adminBy = req.user?.userId;

      if (!adminBy) {
        throw new AppError('User not authenticated', 401);
      }

      const punishment = await prisma.strafe.create({
        data: {
          ...punishmentData,
          adminBy
        },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          administrator: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      res.status(201).json(punishment);
    } catch (error) {
      throw new AppError('Error creating punishment', 500, error);
    }
  }

  static async updatePunishment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.userId;

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
        throw new AppError('Insufficient permissions', 403);
      }

      const updatedPunishment = await prisma.strafe.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          administrator: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      res.json(updatedPunishment);
    } catch (error) {
      throw new AppError('Error updating punishment', 500, error);
    }
  }

  static async deletePunishment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

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
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.strafe.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      throw new AppError('Error deleting punishment', 500, error);
    }
  }
}

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';
import crypto from 'crypto';

export class AllgemeineInformationenController {
  static async getAllInformation(req: Request, res: Response) {
    try {
      const { category, priority, isPublic } = req.query;
      
      const whereClause: any = {};
      if (category) whereClause.category = category as string;
      if (priority) whereClause.priority = priority as string;
      if (isPublic !== undefined) whereClause.isPublic = isPublic === 'true';

      const information = await prisma.allgemeineInformation.findMany({
        where: whereClause,
        include: {
          User: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
      });

      res.json(information);
    } catch (error) {
      throw new AppError('Error fetching information', 500, error);
    }
  }

  static async getInformationById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const information = await prisma.allgemeineInformation.findUnique({
        where: { id },
        include: {
          User: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      if (!information) {
        throw new AppError('Information not found', 404);
      }

      res.json(information);
    } catch (error) {
      throw new AppError('Error fetching information', 500, error);
    }
  }

  static async createInformation(req: Request, res: Response) {
    try {
      const { title, content, category, priority, isPublic, tags } = req.body;
      const creatorId = req.user?.userId;

      if (!creatorId) {
        throw new AppError('User not authenticated', 401);
      }

      const information = await prisma.allgemeineInformation.create({
        data: {
          id: crypto.randomUUID(),
          title,
          content,
          category,
          priority: priority || 'medium',
          isPublic: isPublic !== false,
          tags: tags || [],
          creatorId,
          updatedAt: new Date()
        },
        include: {
          User: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      res.status(201).json(information);
    } catch (error) {
      throw new AppError('Error creating information', 500, error);
    }
  }

  static async updateInformation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingInformation = await prisma.allgemeineInformation.findUnique({
        where: { id }
      });

      if (!existingInformation) {
        throw new AppError('Information not found', 404);
      }

      if (existingInformation.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      const updatedInformation = await prisma.allgemeineInformation.update({
        where: { id },
        data: updateData,
        include: {
          User: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      res.json(updatedInformation);
    } catch (error) {
      throw new AppError('Error updating information', 500, error);
    }
  }

  static async deleteInformation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingInformation = await prisma.allgemeineInformation.findUnique({
        where: { id }
      });

      if (!existingInformation) {
        throw new AppError('Information not found', 404);
      }

      if (existingInformation.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.allgemeineInformation.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      throw new AppError('Error deleting information', 500, error);
    }
  }
}

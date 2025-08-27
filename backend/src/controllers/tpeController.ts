import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class TpeController {
  static async getAllTPEEntries(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { type, intensity, stageId } = req.query;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const whereClause: any = { userId };
      if (type) whereClause.type = type as string;
      if (intensity) whereClause.intensity = parseInt(intensity as string);

      // Stage isolation: Only return TPE entries for specific stage
      if (stageId) {
        whereClause.stageId = stageId as string;
      }

      const entries = await prisma.tPEEintrag.findMany({
        where: whereClause,
        orderBy: [{ createdAt: 'desc' }]
      });

      res.json({
        success: true,
        data: entries
      });
    } catch (error: any) {
      console.error('Error fetching TPE entries:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to fetch TPE entries' });
    }
  }

  static async getTPEEntryById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.tPEEintrag.findUnique({
        where: { id }
      });

      if (!entry) {
        throw new AppError('TPE entry not found', 404);
      }

      if (entry.userId !== userId && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      res.json({
        success: true,
        data: entry
      });
    } catch (error: any) {
      console.error('Error fetching TPE entry:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to fetch TPE entry' });
    }
  }

  static async createTPEEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const entryData = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      if (!entryData.stageId) {
        throw new AppError('stageId is required for stage isolation', 400);
      }

      // Remove fields that shouldn't be set directly
      delete entryData.id;
      delete entryData.createdAt;
      delete entryData.updatedAt;

      const entry = await prisma.tPEEintrag.create({
        data: {
          ...entryData,
          userId
        }
      });

      res.status(201).json({
        success: true,
        data: entry
      });
    } catch (error: any) {
      console.error('Error creating TPE entry:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create TPE entry' });
    }
  }

  static async updateTPEEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.tPEEintrag.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('TPE entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData.userId;

      const updatedEntry = await prisma.tPEEintrag.update({
        where: { id },
        data: updateData
      });

      res.json({
        success: true,
        data: updatedEntry
      });
    } catch (error: any) {
      console.error('Error updating TPE entry:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'TPE entry not found' });
      }
      res.status(500).json({ error: 'Failed to update TPE entry' });
    }
  }

  static async deleteTPEEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.tPEEintrag.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('TPE entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      await prisma.tPEEintrag.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'TPE entry deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting TPE entry:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'TPE entry not found' });
      }
      res.status(500).json({ error: 'Failed to delete TPE entry' });
    }
  }
}

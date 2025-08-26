import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class ErkenntnisseController {
  static async getAllInsightEntries(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { category, importance } = req.query;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const whereClause: any = { userId };
      if (category) whereClause.category = category as string;
      if (importance) whereClause.importance = importance as string;

      const entries = await prisma.neueErkenntnis.findMany({
        where: whereClause,
        orderBy: [
          { importance: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      res.json(entries);
    } catch (error) {
      throw new AppError('Error fetching insight entries', 500, error);
    }
  }

  static async getInsightEntryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.neueErkenntnis.findUnique({
        where: { id }
      });

      if (!entry) {
        throw new AppError('Insight entry not found', 404);
      }

      if (entry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      res.json(entry);
    } catch (error) {
      throw new AppError('Error fetching insight entry', 500, error);
    }
  }

  static async createInsightEntry(req: Request, res: Response) {
    try {
      const { 
        title, insight, context, category, importance, 
        clarity, application, relatedTo 
      } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.neueErkenntnis.create({
        data: {
          title, insight, context, category, importance,
          clarity, application, relatedTo, userId
        }
      });

      res.status(201).json(entry);
    } catch (error) {
      throw new AppError('Error creating insight entry', 500, error);
    }
  }

  static async updateInsightEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.neueErkenntnis.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Insight entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      const updatedEntry = await prisma.neueErkenntnis.update({
        where: { id },
        data: updateData
      });

      res.json(updatedEntry);
    } catch (error) {
      throw new AppError('Error updating insight entry', 500, error);
    }
  }

  static async deleteInsightEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.neueErkenntnis.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Insight entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.neueErkenntnis.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      throw new AppError('Error deleting insight entry', 500, error);
    }
  }
}
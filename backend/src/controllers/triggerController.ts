import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class TriggerController {
  static async getAllTriggers(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { type, frequency, isRecurring } = req.query;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const whereClause: any = { userId };
      if (type) whereClause.type = type as string;
      if (frequency) whereClause.frequency = frequency as string;
      if (isRecurring !== undefined) whereClause.isRecurring = isRecurring === 'true';

      const entries = await prisma.trigger.findMany({
        where: whereClause,
        orderBy: [{ intensity: 'desc' }, { createdAt: 'desc' }]
      });

      res.json(entries);
    } catch (error) {
      throw new AppError('Error fetching triggers', 500, error);
    }
  }

  static async getTriggerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.trigger.findUnique({
        where: { id }
      });

      if (!entry) {
        throw new AppError('Trigger not found', 404);
      }

      if (entry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      res.json(entry);
    } catch (error) {
      throw new AppError('Error fetching trigger', 500, error);
    }
  }

  static async createTrigger(req: Request, res: Response) {
    try {
      const entryData = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.trigger.create({
        data: {
          ...entryData,
          userId
        }
      });

      res.status(201).json(entry);
    } catch (error) {
      throw new AppError('Error creating trigger', 500, error);
    }
  }

  static async updateTrigger(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.trigger.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Trigger not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      const updatedEntry = await prisma.trigger.update({
        where: { id },
        data: updateData
      });

      res.json(updatedEntry);
    } catch (error) {
      throw new AppError('Error updating trigger', 500, error);
    }
  }

  static async deleteTrigger(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.trigger.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Trigger not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.trigger.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      throw new AppError('Error deleting trigger', 500, error);
    }
  }
}

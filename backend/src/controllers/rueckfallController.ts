import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class RueckfallController {
  static async getAllRelapseEntries(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { type, severity } = req.query;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const whereClause: any = { userId };
      if (type) whereClause.type = type as string;
      if (severity) whereClause.severity = severity as string;

      const entries = await prisma.rueckfall.findMany({
        where: whereClause,
        orderBy: [
          { severity: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      res.json(entries);
    } catch (error) {
      throw new AppError('Error fetching relapse entries', 500, error);
    }
  }

  static async getRelapseEntryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.rueckfall.findUnique({
        where: { id }
      });

      if (!entry) {
        throw new AppError('Relapse entry not found', 404);
      }

      if (entry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      res.json(entry);
    } catch (error) {
      throw new AppError('Error fetching relapse entry', 500, error);
    }
  }

  static async createRelapseEntry(req: Request, res: Response) {
    try {
      const entryData = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.rueckfall.create({
        data: {
          ...entryData,
          userId
        }
      });

      res.status(201).json(entry);
    } catch (error) {
      throw new AppError('Error creating relapse entry', 500, error);
    }
  }

  static async updateRelapseEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.rueckfall.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Relapse entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      const updatedEntry = await prisma.rueckfall.update({
        where: { id },
        data: updateData
      });

      res.json(updatedEntry);
    } catch (error) {
      throw new AppError('Error updating relapse entry', 500, error);
    }
  }

  static async deleteRelapseEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.rueckfall.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Relapse entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.rueckfall.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      throw new AppError('Error deleting relapse entry', 500, error);
    }
  }
}
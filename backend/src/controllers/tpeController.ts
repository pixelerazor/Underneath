import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class TpeController {
  static async getAllTPEEntries(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { type, intensity } = req.query;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const whereClause: any = { userId };
      if (type) whereClause.type = type as string;
      if (intensity) whereClause.intensity = parseInt(intensity as string);

      const entries = await prisma.tPEEintrag.findMany({
        where: whereClause,
        orderBy: [{ intensity: 'desc' }, { createdAt: 'desc' }]
      });

      res.json(entries);
    } catch (error) {
      throw new AppError('Error fetching TPE entries', 500, error);
    }
  }

  static async getTPEEntryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

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
        throw new AppError('Insufficient permissions', 403);
      }

      res.json(entry);
    } catch (error) {
      throw new AppError('Error fetching TPE entry', 500, error);
    }
  }

  static async createTPEEntry(req: Request, res: Response) {
    try {
      const entryData = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.tPEEintrag.create({
        data: {
          ...entryData,
          userId
        }
      });

      res.status(201).json(entry);
    } catch (error) {
      throw new AppError('Error creating TPE entry', 500, error);
    }
  }

  static async updateTPEEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.userId;

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
        throw new AppError('Insufficient permissions', 403);
      }

      const updatedEntry = await prisma.tPEEintrag.update({
        where: { id },
        data: updateData
      });

      res.json(updatedEntry);
    } catch (error) {
      throw new AppError('Error updating TPE entry', 500, error);
    }
  }

  static async deleteTPEEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

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
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.tPEEintrag.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      throw new AppError('Error deleting TPE entry', 500, error);
    }
  }
}

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class KeuschheitController {
  static async getAllChastityEntries(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { type, startDate, endDate } = req.query;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const whereClause: any = { userId };
      if (type) whereClause.type = type as string;
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
        if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
      }

      const entries = await prisma.keuschheit.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      });

      res.json(entries);
    } catch (error) {
      throw new AppError('Error fetching chastity entries', 500, error);
    }
  }

  static async getChastityEntryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.keuschheit.findUnique({
        where: { id }
      });

      if (!entry) {
        throw new AppError('Chastity entry not found', 404);
      }

      if (entry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      res.json(entry);
    } catch (error) {
      throw new AppError('Error fetching chastity entry', 500, error);
    }
  }

  static async createChastityEntry(req: Request, res: Response) {
    try {
      const { 
        title, type, duration, device, description, intensity, 
        satisfaction, wasPlanned, wasPermission, wasReward, 
        wasPunishment, notes 
      } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.keuschheit.create({
        data: {
          title, type, duration, device, description, intensity,
          satisfaction, wasPlanned, wasPermission, wasReward,
          wasPunishment, notes, userId
        }
      });

      res.status(201).json(entry);
    } catch (error) {
      throw new AppError('Error creating chastity entry', 500, error);
    }
  }

  static async updateChastityEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.keuschheit.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Chastity entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      const updatedEntry = await prisma.keuschheit.update({
        where: { id },
        data: updateData
      });

      res.json(updatedEntry);
    } catch (error) {
      throw new AppError('Error updating chastity entry', 500, error);
    }
  }

  static async deleteChastityEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const existingEntry = await prisma.keuschheit.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Chastity entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.keuschheit.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      throw new AppError('Error deleting chastity entry', 500, error);
    }
  }
}
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class GeistController {
  static async getAllWellbeingEntries(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { category, startDate, endDate } = req.query;
      
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const whereClause: any = { userId };
      if (category) whereClause.category = category as string;
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
        if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
      }

      const entries = await prisma.geistlichesWohlbefinden.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(entries);
    } catch (error) {
      throw new AppError('Error fetching wellbeing entries', 500, error);
    }
  }

  static async getWellbeingEntryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.geistlichesWohlbefinden.findUnique({
        where: { id }
      });

      if (!entry) {
        throw new AppError('Wellbeing entry not found', 404);
      }

      // Users can only access their own entries
      if (entry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      res.json(entry);
    } catch (error) {
      throw new AppError('Error fetching wellbeing entry', 500, error);
    }
  }

  static async createWellbeingEntry(req: Request, res: Response) {
    try {
      const { 
        title, 
        description, 
        mood, 
        energy, 
        category, 
        triggers, 
        duration, 
        notes 
      } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const entry = await prisma.geistlichesWohlbefinden.create({
        data: {
          title,
          description,
          mood,
          energy,
          category,
          triggers,
          duration,
          notes,
          userId
        }
      });

      res.status(201).json(entry);
    } catch (error) {
      throw new AppError('Error creating wellbeing entry', 500, error);
    }
  }

  static async updateWellbeingEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        title, 
        description, 
        mood, 
        energy, 
        category, 
        triggers, 
        duration, 
        notes 
      } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if entry exists and user has permission
      const existingEntry = await prisma.geistlichesWohlbefinden.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Wellbeing entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      const updatedEntry = await prisma.geistlichesWohlbefinden.update({
        where: { id },
        data: {
          title,
          description,
          mood,
          energy,
          category,
          triggers,
          duration,
          notes
        }
      });

      res.json(updatedEntry);
    } catch (error) {
      throw new AppError('Error updating wellbeing entry', 500, error);
    }
  }

  static async deleteWellbeingEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if entry exists and user has permission
      const existingEntry = await prisma.geistlichesWohlbefinden.findUnique({
        where: { id }
      });

      if (!existingEntry) {
        throw new AppError('Wellbeing entry not found', 404);
      }

      if (existingEntry.userId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.geistlichesWohlbefinden.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      throw new AppError('Error deleting wellbeing entry', 500, error);
    }
  }

  static async getWellbeingStatistics(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { period } = req.query; // 'week', 'month', 'year'

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      let startDate = new Date();
      switch (period) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 1); // Default to month
      }

      const entries = await prisma.geistlichesWohlbefinden.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate
          }
        }
      });

      if (entries.length === 0) {
        return res.json({
          averageMood: null,
          averageEnergy: null,
          totalEntries: 0,
          categories: {}
        });
      }

      const totalMood = entries.reduce((sum, entry) => sum + entry.mood, 0);
      const totalEnergy = entries.reduce((sum, entry) => sum + entry.energy, 0);
      const averageMood = totalMood / entries.length;
      const averageEnergy = totalEnergy / entries.length;

      // Group by categories
      const categories = entries.reduce((acc: any, entry) => {
        if (entry.category) {
          acc[entry.category] = (acc[entry.category] || 0) + 1;
        }
        return acc;
      }, {});

      res.json({
        averageMood: Math.round(averageMood * 100) / 100,
        averageEnergy: Math.round(averageEnergy * 100) / 100,
        totalEntries: entries.length,
        categories
      });
    } catch (error) {
      throw new AppError('Error fetching wellbeing statistics', 500, error);
    }
  }
}
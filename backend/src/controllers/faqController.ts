import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class FaqController {
  static async getAllFAQs(req: Request, res: Response) {
    try {
      const { category, isPublic } = req.query;
      
      const whereClause: any = {};
      if (category) whereClause.category = category as string;
      if (isPublic !== undefined) whereClause.isPublic = isPublic === 'true';

      const faqs = await prisma.fAQ.findMany({
        where: whereClause,
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      res.json(faqs);
    } catch (error) {
      throw new AppError('Error fetching FAQs', 500, error);
    }
  }

  static async getFAQById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const faq = await prisma.fAQ.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      if (!faq) {
        throw new AppError('FAQ not found', 404);
      }

      res.json(faq);
    } catch (error) {
      throw new AppError('Error fetching FAQ', 500, error);
    }
  }

  static async createFAQ(req: Request, res: Response) {
    try {
      const { question, answer, category, priority, tags, isPublic } = req.body;
      const creatorId = req.user?.userId;

      if (!creatorId) {
        throw new AppError('User not authenticated', 401);
      }

      const faq = await prisma.fAQ.create({
        data: {
          question,
          answer,
          category,
          priority: priority || 'medium',
          tags: tags || [],
          isPublic: isPublic !== false,
          creatorId
        },
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      res.status(201).json(faq);
    } catch (error) {
      throw new AppError('Error creating FAQ', 500, error);
    }
  }

  static async updateFAQ(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { question, answer, category, priority, tags, isPublic } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if FAQ exists and user has permission
      const existingFAQ = await prisma.fAQ.findUnique({
        where: { id }
      });

      if (!existingFAQ) {
        throw new AppError('FAQ not found', 404);
      }

      // Only creator or admin can update
      if (existingFAQ.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      const updatedFAQ = await prisma.fAQ.update({
        where: { id },
        data: {
          question,
          answer,
          category,
          priority,
          tags,
          isPublic
        },
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      res.json(updatedFAQ);
    } catch (error) {
      throw new AppError('Error updating FAQ', 500, error);
    }
  }

  static async deleteFAQ(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Check if FAQ exists and user has permission
      const existingFAQ = await prisma.fAQ.findUnique({
        where: { id }
      });

      if (!existingFAQ) {
        throw new AppError('FAQ not found', 404);
      }

      // Only creator or admin can delete
      if (existingFAQ.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.fAQ.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      throw new AppError('Error deleting FAQ', 500, error);
    }
  }

  static async searchFAQs(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q) {
        throw new AppError('Search query required', 400);
      }

      const searchTerm = q as string;
      
      const faqs = await prisma.fAQ.findMany({
        where: {
          OR: [
            {
              question: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              answer: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              tags: {
                hasSome: [searchTerm]
              }
            }
          ],
          isPublic: true
        },
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      res.json(faqs);
    } catch (error) {
      throw new AppError('Error searching FAQs', 500, error);
    }
  }
}
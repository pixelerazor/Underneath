import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import { prisma } from '../lib/prisma';

export const goalsController = {
  // Create a new goal
  async createGoal(req: AuthenticatedRequest, res: Response) {
    try {
      const { 
        title, 
        description, 
        category, 
        priority, 
        pointsReward, 
        targetValue, 
        deadline,
        stageId,
        assignedToId 
      } = req.body;

      if (!title) {
        throw new AppError('Title is required', 400);
      }

      if (!stageId) {
        throw new AppError('stageId is required for stage isolation', 400);
      }

      const goal = await prisma.goal.create({
        data: {
          title,
          description,
          category,
          priority: priority || 'MEDIUM',
          pointsReward: parseInt(pointsReward) || 50,
          targetValue: targetValue ? parseInt(targetValue) : null,
          deadline: deadline ? new Date(deadline) : null,
          stageId,
          assignedToId,
          creatorId: req.user?.userId,
        },
      });

      res.status(201).json({
        success: true,
        data: goal,
      });
    } catch (error: any) {
      console.error('Error creating goal:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to create goal' });
    }
  },

  // Get all goals
  async getAllGoals(req: AuthenticatedRequest, res: Response) {
    try {
      const { stageId, category } = req.query;
      
      const whereClause: any = {};
      
      // Stage isolation: Only return goals for specific stage
      if (stageId) {
        whereClause.stageId = stageId as string;
      }
      
      if (category) {
        whereClause.category = category as string;
      }

      const goals = await prisma.goal.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  preferredName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        data: goals,
      });
    } catch (error) {
      console.error('Error fetching goals:', error);
      res.status(500).json({ error: 'Failed to fetch goals' });
    }
  },

  // Get goal by ID
  async getGoalById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const goal = await prisma.goal.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  preferredName: true
                }
              }
            }
          }
        }
      });

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      res.json({
        success: true,
        data: goal,
      });
    } catch (error) {
      console.error('Error fetching goal:', error);
      res.status(500).json({ error: 'Failed to fetch goal' });
    }
  },

  // Update goal
  async updateGoal(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData.creatorId;

      // Convert numeric fields
      if (updateData.pointsReward) {
        updateData.pointsReward = parseInt(updateData.pointsReward);
      }
      
      if (updateData.targetValue) {
        updateData.targetValue = parseInt(updateData.targetValue);
      }
      

      // Convert date fields
      if (updateData.deadline) {
        updateData.deadline = new Date(updateData.deadline);
      }

      const goal = await prisma.goal.update({
        where: { id },
        data: updateData,
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  preferredName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        data: goal,
      });
    } catch (error: any) {
      console.error('Error updating goal:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Goal not found' });
      }
      
      res.status(500).json({ error: 'Failed to update goal' });
    }
  },

  // Delete goal
  async deleteGoal(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.goal.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Goal deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Goal not found' });
      }
      
      res.status(500).json({ error: 'Failed to delete goal' });
    }
  },
};
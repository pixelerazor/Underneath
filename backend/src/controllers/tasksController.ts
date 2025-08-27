import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import { prisma } from '../lib/prisma';

export const tasksController = {
  // Create a new task
  async createTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { 
        title, 
        description, 
        category, 
        priority, 
        pointsReward, 
        dueDate,
        stageId,
        assignedToId 
      } = req.body;

      if (!title) {
        throw new AppError('Title is required', 400);
      }

      if (!stageId) {
        throw new AppError('stageId is required for stage isolation', 400);
      }

      const task = await prisma.task.create({
        data: {
          title,
          description,
          category,
          priority: priority || 'MEDIUM',
          pointsReward: parseInt(pointsReward) || 10,
          dueDate: dueDate ? new Date(dueDate) : null,
          stageId,
          assignedToId,
          creatorId: req.user?.id,
        },
      });

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error: any) {
      console.error('Error creating task:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  // Get all tasks
  async getAllTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const { stageId, category, status } = req.query;
      
      const whereClause: any = {};
      
      // Stage isolation: Only return tasks for specific stage
      if (stageId) {
        whereClause.stageId = stageId as string;
      }
      
      if (category) {
        whereClause.category = category as string;
      }

      if (status) {
        whereClause.status = status as string;
      }

      const tasks = await prisma.task.findMany({
        where: whereClause,
        orderBy: [
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ],
        include: {
          User_Task_creatorIdToUser: {
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
        data: tasks,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  // Get task by ID
  async getTaskById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          User_Task_creatorIdToUser: {
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

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  },

  // Update task
  async updateTask(req: AuthenticatedRequest, res: Response) {
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

      // Convert date fields
      if (updateData.dueDate) {
        updateData.dueDate = new Date(updateData.dueDate);
      }

      const task = await prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          User_Task_creatorIdToUser: {
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
        data: task,
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  // Delete task
  async deleteTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.task.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },
};
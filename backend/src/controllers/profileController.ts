/**
 * Profile Controller
 * 
 * Handles profile completion and management endpoints.
 * Manages user onboarding flow after registration.
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { ProfileService } from '../services/profileService';
import { logger } from '../utils/logger';
import { CustomError } from '../utils/errors';

// Validation schemas
const profileUpdateSchema = z.object({
  preferredName: z.string().optional(),
  experienceLevel: z.enum(['BEGINNER', 'EXPERIENCED', 'EXPERT']).optional(),
  availability: z.object({
    days: z.array(z.string()).optional(),
    timeSlots: z.array(z.string()).optional(),
    timezone: z.string().optional(),
  }).optional(),
  preferences: z.record(z.any()).optional(),
  goals: z.string().optional(),
  boundaries: z.object({
    hardLimits: z.array(z.string()).optional(),
    softLimits: z.array(z.string()).optional(),
    preferences: z.array(z.string()).optional(),
  }).optional(),
  communication: z.object({
    frequency: z.string().optional(),
    style: z.string().optional(),
    contactMethods: z.array(z.string()).optional(),
    emergencyContact: z.boolean().optional(),
  }).optional(),
  stepCompleted: z.string().optional(),
});

export class ProfileController {
  /**
   * GET /api/profile
   * Get current user's profile
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const profileData = await ProfileService.getUserProfile(userId);

      res.json({
        success: true,
        data: profileData,
      });
    } catch (error: any) {
      logger.error('Get profile error:', error);
      
      if (error instanceof CustomError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: error.code,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * PUT /api/profile
   * Update user profile (can be partial)
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      
      // Validate request body
      const validatedData = profileUpdateSchema.parse(req.body);
      
      const result = await ProfileService.updateProfile(
        userId, 
        validatedData, 
        validatedData.stepCompleted
      );

      res.json({
        success: true,
        data: result,
        message: result.isComplete ? 'Profile completed successfully!' : 'Profile updated successfully',
      });
    } catch (error: any) {
      logger.error('Update profile error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      if (error instanceof CustomError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: error.code,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * GET /api/profile/progress
   * Get profile completion progress
   */
  static async getProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const progress = await ProfileService.getProfileProgress(userId);

      res.json({
        success: true,
        data: progress,
      });
    } catch (error: any) {
      logger.error('Get profile progress error:', error);
      
      if (error instanceof CustomError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: error.code,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * GET /api/profile/template/:role
   * Get empty profile template for a role (useful for admins)
   */
  static async getTemplate(req: Request, res: Response) {
    try {
      const { role } = req.params;
      
      if (!['DOM', 'SUB', 'OBSERVER'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role specified',
        });
      }

      // Only allow admins or getting your own role template
      const userRole = (req as any).user.role;
      if (userRole !== 'ADMIN' && userRole !== role) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
        });
      }

      // This would return the template - for now return basic structure
      const template = {
        role,
        steps: ProfileService['getRequiredSteps'](role),
        description: `Profile completion template for ${role} role`,
      };

      res.json({
        success: true,
        data: template,
      });
    } catch (error: any) {
      logger.error('Get template error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * POST /api/profile/complete
   * Mark profile as completed (if all requirements are met)
   */
  static async completeProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      
      // Get current profile and check completeness
      const profileData = await ProfileService.getUserProfile(userId);
      
      if (profileData.user.profileCompleted) {
        return res.json({
          success: true,
          message: 'Profile already completed',
          data: { isComplete: true },
        });
      }

      // This would trigger a final validation and completion
      // For now, we'll use the update method with no changes to trigger completion check
      const result = await ProfileService.updateProfile(userId, {});

      if (result.isComplete) {
        res.json({
          success: true,
          message: 'Profile completed successfully!',
          data: { isComplete: true },
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Profile requirements not met',
          data: { 
            isComplete: false,
            missing: result.nextSteps,
          },
        });
      }
    } catch (error: any) {
      logger.error('Complete profile error:', error);
      
      if (error instanceof CustomError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: error.code,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
/**
 * Profile Service
 * 
 * Handles user profile completion and management after registration.
 * Provides role-specific profile templates and validation.
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { PrismaClient } from '@prisma/client';
import { CustomError } from '../utils/errors';

// Use existing global prisma instance if available
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Simple console logger since logger might not be available
const logger = {
  info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args),
};

export interface ProfileCompletionData {
  preferredName?: string;
  experienceLevel?: 'BEGINNER' | 'EXPERIENCED' | 'EXPERT';
  availability?: {
    days?: string[];
    timeSlots?: string[];
    timezone?: string;
  };
  preferences?: {
    // DOM-specific
    leadershipStyle?: string;
    focus?: string[];
    rewardTypes?: string[];
    // SUB-specific
    motivation?: string[];
    learningStyle?: string;
    goals?: string[];
    // OBSERVER-specific
    relationship?: string;
    background?: string;
    role?: string;
  };
  goals?: string;
  boundaries?: {
    hardLimits?: string[];
    softLimits?: string[];
    preferences?: string[];
  };
  communication?: {
    frequency?: string;
    style?: string;
    contactMethods?: string[];
    emergencyContact?: boolean;
  };
}

export class ProfileService {
  /**
   * Get the current user's profile or create empty one
   */
  static async getUserProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        },
      });

      if (!user) {
        throw new CustomError('USER_NOT_FOUND', 'User not found');
      }

      // If no profile exists, return empty template based on role
      if (!user.profile) {
        return {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            displayName: user.displayName,
            profileCompleted: user.profileCompleted || false,
          },
          profile: this.getEmptyProfileTemplate(user.role),
          isNewProfile: true,
        };
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          displayName: user.displayName,
          profileCompleted: user.profileCompleted,
        },
        profile: user.profile,
        isNewProfile: false,
      };
    } catch (error) {
      logger.error('Error getting user profile:', error);
      throw error instanceof CustomError ? error : new CustomError('PROFILE_FETCH_ERROR', 'Failed to fetch profile');
    }
  }

  /**
   * Update or create user profile
   */
  static async updateProfile(userId: string, profileData: ProfileCompletionData, stepCompleted?: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        throw new CustomError('USER_NOT_FOUND', 'User not found');
      }

      // Validate profile data based on user role
      this.validateProfileData(user.role, profileData);

      const profileUpdateData = {
        preferredName: profileData.preferredName,
        experienceLevel: profileData.experienceLevel,
        availability: profileData.availability || {},
        preferences: profileData.preferences || {},
        goals: profileData.goals,
        boundaries: profileData.boundaries || {},
        communication: profileData.communication || {},
        // Add completed step if provided
        completedSteps: stepCompleted 
          ? [...new Set([...(user.profile?.completedSteps || []), stepCompleted])]
          : user.profile?.completedSteps || [],
      };

      let profile;
      if (user.profile) {
        // Update existing profile
        profile = await prisma.userProfile.update({
          where: { userId },
          data: profileUpdateData,
        });
      } else {
        // Create new profile
        profile = await prisma.userProfile.create({
          data: {
            userId,
            ...profileUpdateData,
          },
        });
      }

      // Check if profile is complete and update user
      const isProfileComplete = this.isProfileComplete(user.role, profile);
      if (isProfileComplete && !user.profileCompleted) {
        await prisma.user.update({
          where: { id: userId },
          data: { profileCompleted: true },
        });
      }

      logger.info(`Profile updated for user ${userId}`, { stepCompleted, isComplete: isProfileComplete });

      return {
        profile,
        isComplete: isProfileComplete,
        nextSteps: this.getNextSteps(user.role, profile.completedSteps),
      };
    } catch (error) {
      logger.error('Error updating profile:', error);
      throw error instanceof CustomError ? error : new CustomError('PROFILE_UPDATE_ERROR', 'Failed to update profile');
    }
  }

  /**
   * Get empty profile template based on role
   */
  private static getEmptyProfileTemplate(role: string) {
    const baseTemplate = {
      id: null,
      userId: null,
      preferredName: null,
      experienceLevel: null,
      availability: {},
      timezone: null,
      preferences: {},
      goals: null,
      boundaries: {},
      communication: {},
      completedSteps: [],
      createdAt: null,
      updatedAt: null,
    };

    // Add role-specific default preferences
    switch (role) {
      case 'DOM':
        baseTemplate.preferences = {
          leadershipStyle: null,
          focus: [],
          rewardTypes: [],
          monitoringLevel: null,
        };
        break;
      case 'SUB':
        baseTemplate.preferences = {
          motivation: [],
          learningStyle: null,
          taskTypes: [],
        };
        break;
      case 'OBSERVER':
        baseTemplate.preferences = {
          relationship: null,
          background: null,
          role: null,
          reportingFrequency: null,
        };
        break;
    }

    return baseTemplate;
  }

  /**
   * Validate profile data based on user role
   */
  private static validateProfileData(role: string, data: ProfileCompletionData) {
    // Basic validation
    if (data.preferredName && data.preferredName.length > 100) {
      throw new CustomError('VALIDATION_ERROR', 'Preferred name too long');
    }

    if (data.experienceLevel && !['BEGINNER', 'EXPERIENCED', 'EXPERT'].includes(data.experienceLevel)) {
      throw new CustomError('VALIDATION_ERROR', 'Invalid experience level');
    }

    // Role-specific validation could be added here
    logger.info(`Validated profile data for ${role}`);
  }

  /**
   * Check if profile is complete based on role requirements
   */
  private static isProfileComplete(role: string, profile: any): boolean {
    const hasBasicInfo = profile.preferredName && profile.experienceLevel;
    const hasPreferences = profile.preferences && Object.keys(profile.preferences).length > 0;
    const requiredSteps = this.getRequiredSteps(role);
    const completedSteps = profile.completedSteps || [];

    const hasAllSteps = requiredSteps.every(step => completedSteps.includes(step));

    return hasBasicInfo && hasPreferences && hasAllSteps;
  }

  /**
   * Get required completion steps for each role
   */
  private static getRequiredSteps(role: string): string[] {
    const baseSteps = ['basic_info', 'preferences', 'communication'];
    
    switch (role) {
      case 'DOM':
        return [...baseSteps, 'leadership_style'];
      case 'SUB':
        return [...baseSteps, 'goals_boundaries'];
      case 'OBSERVER':
        return [...baseSteps, 'professional_info'];
      default:
        return baseSteps;
    }
  }

  /**
   * Get next steps for profile completion
   */
  private static getNextSteps(role: string, completedSteps: string[]): string[] {
    const requiredSteps = this.getRequiredSteps(role);
    return requiredSteps.filter(step => !completedSteps.includes(step));
  }

  /**
   * Get profile completion progress
   */
  static async getProfileProgress(userId: string) {
    try {
      const userProfile = await this.getUserProfile(userId);
      const user = userProfile.user;
      const profile = userProfile.profile;

      const requiredSteps = this.getRequiredSteps(user.role);
      const completedSteps = profile.completedSteps || [];
      const progress = (completedSteps.length / requiredSteps.length) * 100;

      return {
        progress: Math.round(progress),
        completed: completedSteps,
        remaining: requiredSteps.filter(step => !completedSteps.includes(step)),
        isComplete: user.profileCompleted,
      };
    } catch (error) {
      logger.error('Error getting profile progress:', error);
      throw error instanceof CustomError ? error : new CustomError('PROGRESS_ERROR', 'Failed to get progress');
    }
  }
}
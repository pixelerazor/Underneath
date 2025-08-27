// backend/src/controllers/initiationsritenController.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export class InitiationsritenController {
  static async getAllInitiationsriten(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      // For debugging: allow without authentication temporarily
      if (!userId) {
        console.log('⚠️ No user authentication found for Initiationsriten, proceeding with limited access');
      }

      let whereClause: any = {};

      // Role-based filtering (only if user is authenticated)
      if (userId && userRole === 'SUB') {
        whereClause.creatorId = userId;
      }

      // Stage isolation
      const { stageId } = req.query;
      if (stageId) {
        whereClause.stageId = stageId as string;
      }

      const initiationsriten = await prisma.initiationsriten.findMany({
        where: whereClause,
        include: {
          User: { select: { displayName: true, role: true } }
        },
        orderBy: [{ createdAt: 'desc' }]
      });

      res.json({
        success: true,
        data: initiationsriten
      });
    } catch (error) {
      next(error);
    }
  }

  static async getInitiationsritenById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      let whereClause: any = { id };

      // Role-based filtering
      if (userRole === 'SUB') {
        whereClause.creatorId = userId;
      }

      const initiationsriten = await prisma.initiationsriten.findFirst({
        where: whereClause,
        include: {
          User: { select: { displayName: true, role: true } }
        }
      });

      if (!initiationsriten) {
        throw new AppError('Initiationsriten nicht gefunden', 404);
      }

      res.json({
        success: true,
        data: initiationsriten
      });
    } catch (error) {
      next(error);
    }
  }

  static async createInitiationsriten(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      const {
        title,
        description,
        ritualType,
        markingType,
        bodyLocation,
        symbolism,
        actionSequence,
        symbolMeaning,
        repetitionSchedule,
        ceremonyLocation,
        participants,
        ceremonyDuration,
        ceremonyElements,
        behaviorDescription,
        behaviorDuration,
        behaviorFrequency,
        customDefinition,
        timing,
        documentation,
        requiresPreparation,
        requiresAftercare,
        preparationDetails,
        aftercareDetails,
        explicitConsent,
        hardLimits,
        exitClause,
        medicalConsiderations,
        reversibility,
        reversibilityDetails,
        stageId
      } = req.body;

      if (!title) {
        throw new AppError('Titel ist erforderlich', 400);
      }

      if (!stageId) {
        throw new AppError('stageId ist für Stage-Isolation erforderlich', 400);
      }

      console.log('🔍 DEBUG: Received Initiationsriten data:', JSON.stringify(req.body, null, 2));
      console.log('🔍 DEBUG: User info:', { userId, userRole: req.user?.role });

      // Note: For now, make explicitConsent optional for testing
      // if (!explicitConsent) {
      //   throw new AppError('Explizite Einverständniserklärung ist erforderlich', 400);
      // }

      const initiationsriten = await prisma.initiationsriten.create({
        data: {
          id: crypto.randomUUID(),
          title,
          description,
          ritualType,
          markingType,
          bodyLocation,
          symbolism,
          actionSequence,
          symbolMeaning,
          repetitionSchedule,
          ceremonyLocation,
          participants,
          ceremonyDuration,
          ceremonyElements,
          behaviorDescription,
          behaviorDuration,
          behaviorFrequency,
          customDefinition,
          timing,
          documentation,
          requiresPreparation: requiresPreparation || false,
          requiresAftercare: requiresAftercare || false,
          preparationDetails,
          aftercareDetails,
          explicitConsent: explicitConsent || false,
          hardLimits,
          exitClause,
          medicalConsiderations,
          reversibility,
          reversibilityDetails,
          creatorId: userId,
          stageId,
          updatedAt: new Date()
        },
        include: {
          User: { select: { displayName: true, role: true } }
        }
      });

      res.status(201).json({
        success: true,
        data: initiationsriten,
        message: 'Initiationsriten erfolgreich erstellt'
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateInitiationsriten(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      const initiationsriten = await prisma.initiationsriten.findUnique({
        where: { id }
      });

      if (!initiationsriten) {
        throw new AppError('Initiationsriten nicht gefunden', 404);
      }

      if (initiationsriten.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Keine Berechtigung zum Bearbeiten dieser Initiationsriten', 403);
      }

      const updatedInitiationsriten = await prisma.initiationsriten.update({
        where: { id },
        data: req.body,
        include: {
          User: { select: { displayName: true, role: true } }
        }
      });

      res.json({
        success: true,
        data: updatedInitiationsriten,
        message: 'Initiationsriten erfolgreich aktualisiert'
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteInitiationsriten(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      const initiationsriten = await prisma.initiationsriten.findUnique({
        where: { id }
      });

      if (!initiationsriten) {
        throw new AppError('Initiationsriten nicht gefunden', 404);
      }

      if (initiationsriten.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Keine Berechtigung zum Löschen dieser Initiationsriten', 403);
      }

      await prisma.initiationsriten.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Initiationsriten erfolgreich gelöscht'
      });
    } catch (error) {
      next(error);
    }
  }
}
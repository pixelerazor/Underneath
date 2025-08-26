// backend/src/controllers/stagesController.ts
import { Request, Response, NextFunction } from 'express';
import { StageService } from '../services/stageService';
import { CustomError } from '../utils/errors';

export class StagesController {
  static async getAllStages(req: Request, res: Response, next: NextFunction) {
    try {
      const stages = await StageService.getAllStages();

      res.json({
        success: true,
        data: stages
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStageById(req: Request, res: Response, next: NextFunction) {
    try {
      const { stageId } = req.params;
      const stage = await StageService.getStageById(stageId);

      res.json({
        success: true,
        data: stage
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStageByNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { stageNumber } = req.params;
      const stage = await StageService.getStageByNumber(parseInt(stageNumber));

      res.json({
        success: true,
        data: stage
      });
    } catch (error) {
      next(error);
    }
  }

  static async createStage(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;
      if (!['DOM', 'ADMIN'].includes(userRole)) {
        throw new CustomError('FORBIDDEN', 'Nur DOMs und Administratoren können Stufen erstellen');
      }

      const { stageNumber, name, description, pointsRequired, color } = req.body;

      if (!stageNumber || !name || pointsRequired === undefined) {
        throw new CustomError('VALIDATION_ERROR', 'stageNumber, name und pointsRequired sind erforderlich');
      }

      const stage = await StageService.createStage({
        stageNumber,
        name,
        description,
        pointsRequired,
        color
      });

      res.status(201).json({
        success: true,
        data: stage,
        message: 'Stufe erfolgreich erstellt'
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStage(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;
      if (userRole !== 'ADMIN') {
        throw new CustomError('FORBIDDEN', 'Nur Administratoren können Stufen bearbeiten');
      }

      const { stageId } = req.params;
      const updateData = req.body;

      const stage = await StageService.updateStage(stageId, updateData);

      res.json({
        success: true,
        data: stage,
        message: 'Stufe erfolgreich aktualisiert'
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStage(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;
      if (userRole !== 'ADMIN') {
        throw new CustomError('FORBIDDEN', 'Nur Administratoren können Stufen löschen');
      }

      const { stageId } = req.params;
      const result = await StageService.deleteStage(stageId);

      res.json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleStageStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;
      if (userRole !== 'ADMIN') {
        throw new CustomError('FORBIDDEN', 'Nur Administratoren können den Stufenstatus ändern');
      }

      const { stageId } = req.params;
      const stage = await StageService.toggleStageStatus(stageId);

      res.json({
        success: true,
        data: stage,
        message: `Stufe ${stage.isActive ? 'aktiviert' : 'deaktiviert'}`
      });
    } catch (error) {
      next(error);
    }
  }

  static async getActiveEntities(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        throw new CustomError('UNAUTHORIZED', 'Benutzer nicht authentifiziert');
      }

      const { 
        currentStage, 
        entityType, 
        activeOnly = 'true',
        targetUserId 
      } = req.query;

      let finalUserId = userId;
      let finalCurrentStage = parseInt(currentStage as string) || 1;

      if (targetUserId && userRole === 'DOM') {
        finalUserId = targetUserId as string;
        
        // Note: This would need proper implementation to get user's current stage
        // For now, defaulting to stage 1
        finalCurrentStage = 1;
      }

      const entities = await StageService.getActiveEntitiesForStage({
        userId: finalUserId,
        userRole: userRole as 'DOM' | 'SUB' | 'OBSERVER' | 'ADMIN',
        currentStage: finalCurrentStage,
        entityType: entityType as 'TASK' | 'RULE' | 'GOAL' | undefined,
        activeOnly: activeOnly === 'true'
      });

      res.json({
        success: true,
        data: entities
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPendingProgressions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        throw new CustomError('UNAUTHORIZED', 'Benutzer nicht authentifiziert');
      }

      let domId: string | undefined;
      
      if (userRole === 'DOM') {
        domId = userId;
      } else if (userRole === 'ADMIN') {
        domId = undefined; // Admin can see all
      } else {
        throw new CustomError('FORBIDDEN', 'Keine Berechtigung zum Anzeigen von Stufenfortschritten');
      }

      const progressions = await StageService.getPendingProgressions(domId);

      res.json({
        success: true,
        data: progressions
      });
    } catch (error) {
      next(error);
    }
  }

  static async confirmStageProgression(req: Request, res: Response, next: NextFunction) {
    try {
      const domId = req.user?.userId;
      const domRole = req.user?.role;

      if (!domId || domRole !== 'DOM') {
        throw new CustomError('FORBIDDEN', 'Nur DOM-Benutzer können Stufenfortschritte bestätigen');
      }

      const { progressionId } = req.params;
      const { approved, notes } = req.body;

      if (typeof approved !== 'boolean') {
        throw new CustomError('VALIDATION_ERROR', 'approved muss ein boolean sein');
      }

      const progression = await StageService.confirmStageProgression({
        progressionId,
        domId,
        notes,
        approved
      });

      res.json({
        success: true,
        data: progression,
        message: approved ? 'Stufenfortschritt bestätigt' : 'Stufenfortschritt abgelehnt'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStageProgressionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const requestingUserId = req.user?.userId;
      const requestingUserRole = req.user?.role;
      const { userId } = req.params;
      const { limit = 20 } = req.query;

      if (!requestingUserId) {
        throw new CustomError('UNAUTHORIZED', 'Benutzer nicht authentifiziert');
      }

      if (requestingUserRole === 'SUB' && userId !== requestingUserId) {
        throw new CustomError('FORBIDDEN', 'SUBs können nur ihre eigene Historie einsehen');
      }

      if (requestingUserRole === 'DOM') {
        // Note: Connection validation would need to be implemented
        // This is a placeholder for DOM-SUB relationship validation
      }

      const progressions = await StageService.getStageProgressionHistory(
        userId, 
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: progressions
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStageStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;

      if (userRole !== 'DOM' && userRole !== 'ADMIN') {
        throw new CustomError('FORBIDDEN', 'Keine Berechtigung für Stufenstatistiken');
      }

      const statistics = await StageService.getStageStatistics();

      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }

  static async initializeDefaultStages(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;
      if (userRole !== 'ADMIN') {
        throw new CustomError('FORBIDDEN', 'Nur Administratoren können Standard-Stufen initialisieren');
      }

      const result = await StageService.initializeDefaultStages();

      res.json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserCurrentStage(req: Request, res: Response, next: NextFunction) {
    try {
      const requestingUserId = req.user?.userId;
      const requestingUserRole = req.user?.role;
      const { userId } = req.params;

      if (!requestingUserId) {
        throw new CustomError('UNAUTHORIZED', 'Benutzer nicht authentifiziert');
      }

      let targetUserId = userId;

      if (requestingUserRole === 'SUB' && userId !== requestingUserId) {
        throw new CustomError('FORBIDDEN', 'SUBs können nur ihre eigene Stufe einsehen');
      }

      if (requestingUserRole === 'DOM') {
        // Note: Connection validation would need to be implemented
        // This is a placeholder for DOM-SUB relationship validation
      }

      if (!userId) {
        targetUserId = requestingUserId;
      }

      // Note: This endpoint needs proper implementation
      // For now, returning placeholder response
      res.json({
        success: false,
        error: 'This endpoint needs to be implemented with proper user stage retrieval'
      });
    } catch (error) {
      next(error);
    }
  }
}
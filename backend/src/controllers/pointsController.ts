// backend/src/controllers/pointsController.ts
import { Request, Response, NextFunction } from 'express';
import { PointsService } from '../services/pointsService';
import { CustomError } from '../utils/errors';

export class PointsController {
  static async getPointSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new CustomError('UNAUTHORIZED', 'Benutzer nicht authentifiziert');
      }

      const summary = await PointsService.getPointSummary(userId);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPointHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new CustomError('UNAUTHORIZED', 'Benutzer nicht authentifiziert');
      }

      const { limit = 50, offset = 0 } = req.query;
      const history = await PointsService.getPointHistory(
        userId,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      next(error);
    }
  }

  static async addPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const domId = req.user?.userId;
      const domRole = req.user?.role;

      if (!domId || domRole !== 'DOM') {
        throw new CustomError('FORBIDDEN', 'Nur DOM-Benutzer können Punkte vergeben');
      }

      const { userId, amount, reason, description, category, entityType, entityId } = req.body;

      if (!userId || !amount || !reason || !category) {
        throw new CustomError('VALIDATION_ERROR', 'userId, amount, reason und category sind erforderlich');
      }

      if (typeof amount !== 'number' || amount === 0) {
        throw new CustomError('VALIDATION_ERROR', 'Amount muss eine Zahl ungleich null sein');
      }

      const result = await PointsService.addPoints({
        userId,
        amount,
        reason,
        description,
        category,
        entityType,
        entityId
      });

      res.json({
        success: true,
        data: result,
        message: amount > 0 ? 'Punkte erfolgreich vergeben' : 'Punkte erfolgreich abgezogen'
      });
    } catch (error) {
      next(error);
    }
  }

  static async deductPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const domId = req.user?.userId;
      const domRole = req.user?.role;

      if (!domId || domRole !== 'DOM') {
        throw new CustomError('FORBIDDEN', 'Nur DOM-Benutzer können Punkte abziehen');
      }

      const { userId, amount, reason, description, category, entityType, entityId } = req.body;

      if (!userId || !amount || !reason || !category) {
        throw new CustomError('VALIDATION_ERROR', 'userId, amount, reason und category sind erforderlich');
      }

      if (typeof amount !== 'number' || amount <= 0) {
        throw new CustomError('VALIDATION_ERROR', 'Amount muss eine positive Zahl sein');
      }

      const result = await PointsService.deductPoints({
        userId,
        amount,
        reason,
        description,
        category,
        entityType,
        entityId
      });

      res.json({
        success: true,
        data: result,
        message: 'Punkte erfolgreich abgezogen'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentStage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new CustomError('UNAUTHORIZED', 'Benutzer nicht authentifiziert');
      }

      const stageInfo = await PointsService.getCurrentStage(userId);

      res.json({
        success: true,
        data: stageInfo
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit = 20 } = req.query;
      const leaderboard = await PointsService.getLeaderboard(parseInt(limit as string));

      res.json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;
      const requestedUserId = req.query.userId as string;

      let userId: string | undefined;

      if (userRole === 'DOM' || userRole === 'ADMIN') {
        userId = requestedUserId;
      } else if (userRole === 'SUB') {
        userId = req.user?.userId;
      } else {
        throw new CustomError('FORBIDDEN', 'Keine Berechtigung für Statistiken');
      }

      const statistics = await PointsService.getPointStatistics(userId);

      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStageThresholds(req: Request, res: Response, next: NextFunction) {
    try {
      const thresholds = await PointsService.getStageThresholds();

      res.json({
        success: true,
        data: thresholds
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStageThresholds(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;
      if (userRole !== 'ADMIN') {
        throw new CustomError('FORBIDDEN', 'Nur Administratoren können Stufenschwellen ändern');
      }

      const { thresholds } = req.body;
      if (!thresholds || typeof thresholds !== 'object') {
        throw new CustomError('VALIDATION_ERROR', 'Ungültige Stufenschwellen-Daten');
      }

      const updatedThresholds = await PointsService.updateStageThresholds(thresholds);

      res.json({
        success: true,
        data: updatedThresholds,
        message: 'Stufenschwellen erfolgreich aktualisiert'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const requestedUserId = req.params.userId;
      const requestingUser = req.user;

      if (!requestingUser) {
        throw new CustomError('UNAUTHORIZED', 'Benutzer nicht authentifiziert');
      }

      if (requestingUser.role === 'SUB' && requestedUserId !== requestingUser.id) {
        throw new CustomError('FORBIDDEN', 'SUBs können nur ihre eigenen Punkte einsehen');
      }

      if (requestingUser.role === 'DOM') {
        // Note: Connection validation would need to be implemented
        // This is a placeholder for DOM-SUB relationship validation
      }

      const summary = await PointsService.getPointSummary(requestedUserId);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  static async bulkAddPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const domId = req.user?.userId;
      const domRole = req.user?.role;

      if (!domId || domRole !== 'DOM') {
        throw new CustomError('FORBIDDEN', 'Nur DOM-Benutzer können Bulk-Punkte vergeben');
      }

      const { transactions } = req.body;
      if (!Array.isArray(transactions) || transactions.length === 0) {
        throw new CustomError('VALIDATION_ERROR', 'Transaktions-Array ist erforderlich');
      }

      const results = [];
      for (const transaction of transactions) {
        try {
          const result = await PointsService.addPoints(transaction);
          results.push({ success: true, data: result, transaction });
        } catch (error) {
          results.push({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unbekannter Fehler', 
            transaction 
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      res.json({
        success: true,
        data: {
          results,
          summary: {
            total: results.length,
            successful: successCount,
            failed: failureCount
          }
        },
        message: `${successCount} von ${results.length} Transaktionen erfolgreich`
      });
    } catch (error) {
      next(error);
    }
  }
}
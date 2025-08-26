// backend/src/controllers/rulesController.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { prisma } from '../lib/prisma';

export class RulesController {
  static async getAllRules(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      let whereClause: any = { isActive: true };

      // Role-based filtering
      if (userRole === 'SUB') {
        whereClause.applicableToId = userId;
      }

      const rules = await prisma.rule.findMany({
        where: whereClause,
        include: {
          creator: { select: { displayName: true, role: true } },
          applicableTo: { select: { displayName: true, role: true } },
          violations: { take: 3, orderBy: { occurredAt: 'desc' } }
        },
        orderBy: [{ activeFromStage: 'asc' }, { severity: 'desc' }]
      });

      res.json({
        success: true,
        data: rules
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRuleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { ruleId } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      let whereClause: any = { id: ruleId };

      // Role-based filtering
      if (userRole === 'SUB') {
        whereClause.applicableToId = userId;
      }

      const rule = await prisma.rule.findFirst({
        where: whereClause,
        include: {
          creator: { select: { displayName: true, role: true } },
          applicableTo: { select: { displayName: true, role: true } },
          violations: { orderBy: { occurredAt: 'desc' } }
        }
      });

      if (!rule) {
        throw new AppError('Regel nicht gefunden', 404);
      }

      res.json({
        success: true,
        data: rule
      });
    } catch (error) {
      next(error);
    }
  }

  static async createRule(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      const {
        title,
        description,
        category,
        severity,
        pointsPenalty,
        activeFromStage,
        activeToStage,
        applicableToId
      } = req.body;

      if (!title || !category || !severity) {
        throw new AppError('Title, Kategorie und Schweregrad sind erforderlich', 400);
      }

      const rule = await prisma.rule.create({
        data: {
          title,
          description,
          category,
          severity,
          pointsPenalty: Math.abs(pointsPenalty || 10),
          activeFromStage: activeFromStage || 1,
          activeToStage,
          creatorId: userId,
          applicableToId,
          isActive: true,
          status: 'ACTIVE'
        },
        include: {
          creator: { select: { displayName: true, role: true } },
          applicableTo: { select: { displayName: true, role: true } }
        }
      });

      res.status(201).json({
        success: true,
        data: rule,
        message: 'Regel erfolgreich erstellt'
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRule(req: Request, res: Response, next: NextFunction) {
    try {
      const { ruleId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      const rule = await prisma.rule.findUnique({
        where: { id: ruleId }
      });

      if (!rule) {
        throw new AppError('Regel nicht gefunden', 404);
      }

      if (rule.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Keine Berechtigung zum Bearbeiten dieser Regel', 403);
      }

      const updatedRule = await prisma.rule.update({
        where: { id: ruleId },
        data: req.body,
        include: {
          creator: { select: { displayName: true, role: true } },
          applicableTo: { select: { displayName: true, role: true } }
        }
      });

      res.json({
        success: true,
        data: updatedRule,
        message: 'Regel erfolgreich aktualisiert'
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRule(req: Request, res: Response, next: NextFunction) {
    try {
      const { ruleId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      const rule = await prisma.rule.findUnique({
        where: { id: ruleId }
      });

      if (!rule) {
        throw new AppError('Regel nicht gefunden', 404);
      }

      if (rule.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Keine Berechtigung zum Löschen dieser Regel', 403);
      }

      await prisma.rule.delete({
        where: { id: ruleId }
      });

      res.json({
        success: true,
        message: 'Regel erfolgreich gelöscht'
      });
    } catch (error) {
      next(error);
    }
  }
}
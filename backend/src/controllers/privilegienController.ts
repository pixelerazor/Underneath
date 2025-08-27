// backend/src/controllers/privilegienController.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export class PrivilegienController {
  static async getAllPrivilegien(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      let whereClause: any = { isActive: true };

      // Role-based filtering
      if (userRole === 'SUB') {
        whereClause.grantedToId = userId;
      }

      // Stage isolation
      const { stageId } = req.query;
      if (stageId) {
        whereClause.stageId = stageId as string;
      }

      const privilegien = await prisma.privileg.findMany({
        where: whereClause,
        include: {
          User_Privileg_creatorIdToUser: { select: { displayName: true, role: true } },
          User_Privileg_grantedToIdToUser: { select: { displayName: true, role: true } }
        },
        orderBy: [{ createdAt: 'desc' }]
      });

      res.json({
        success: true,
        data: privilegien
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPrivilegById(req: Request, res: Response, next: NextFunction) {
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
        whereClause.grantedToId = userId;
      }

      const privileg = await prisma.privileg.findFirst({
        where: whereClause,
        include: {
          User_Privileg_creatorIdToUser: { select: { displayName: true, role: true } },
          User_Privileg_grantedToIdToUser: { select: { displayName: true, role: true } }
        }
      });

      if (!privileg) {
        throw new AppError('Privileg nicht gefunden', 404);
      }

      res.json({
        success: true,
        data: privileg
      });
    } catch (error) {
      next(error);
    }
  }

  static async createPrivileg(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      const {
        title,
        description,
        category,
        type,
        conditions,
        duration,
        pointsRequired,
        level,
        canRevoke,
        autoExpires,
        expiresAfter,
        grantedToId,
        stageId
      } = req.body;

      if (!title) {
        throw new AppError('Titel ist erforderlich', 400);
      }

      if (!stageId) {
        throw new AppError('stageId ist für Stage-Isolation erforderlich', 400);
      }

      console.log('🔍 DEBUG: Received Privileg data:', JSON.stringify(req.body, null, 2));
      console.log('🔍 DEBUG: User info:', { userId, userRole: req.user?.role });

      const privileg = await prisma.privileg.create({
        data: {
          id: crypto.randomUUID(),
          title,
          description,
          category,
          type,
          conditions,
          duration,
          pointsRequired: pointsRequired ? parseInt(pointsRequired) : null,
          level: level ? parseInt(level) : null,
          canRevoke: canRevoke !== false,
          autoExpires: autoExpires || false,
          expiresAfter,
          creatorId: userId,
          grantedToId,
          stageId,
          updatedAt: new Date()
        },
        include: {
          User_Privileg_creatorIdToUser: { select: { displayName: true, role: true } },
          User_Privileg_grantedToIdToUser: { select: { displayName: true, role: true } }
        }
      });

      res.status(201).json({
        success: true,
        data: privileg,
        message: 'Privileg erfolgreich erstellt'
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePrivileg(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      const privileg = await prisma.privileg.findUnique({
        where: { id }
      });

      if (!privileg) {
        throw new AppError('Privileg nicht gefunden', 404);
      }

      if (privileg.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Keine Berechtigung zum Bearbeiten dieses Privilegs', 403);
      }

      const updatedPrivileg = await prisma.privileg.update({
        where: { id },
        data: req.body,
        include: {
          User_Privileg_creatorIdToUser: { select: { displayName: true, role: true } },
          User_Privileg_grantedToIdToUser: { select: { displayName: true, role: true } }
        }
      });

      res.json({
        success: true,
        data: updatedPrivileg,
        message: 'Privileg erfolgreich aktualisiert'
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePrivileg(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Benutzer nicht authentifiziert', 401);
      }

      const privileg = await prisma.privileg.findUnique({
        where: { id }
      });

      if (!privileg) {
        throw new AppError('Privileg nicht gefunden', 404);
      }

      if (privileg.creatorId !== userId && req.user?.role !== 'ADMIN') {
        throw new AppError('Keine Berechtigung zum Löschen dieses Privilegs', 403);
      }

      await prisma.privileg.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Privileg erfolgreich gelöscht'
      });
    } catch (error) {
      next(error);
    }
  }
}
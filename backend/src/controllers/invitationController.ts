// backend/src/controllers/invitationController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { emailService } from '../services/emailService';
import { connectionService } from '../services/connectionService';
import { logger } from '../utils/logger';
import { CustomError } from '../utils/errors';
import {
  CreateInvitationInput,
  ValidateInvitationInput,
  AcceptInvitationInput,
} from '../schemas/invitationSchemas';

const prisma = new PrismaClient();

export class InvitationController {
  static async create(req: Request<{}, {}, CreateInvitationInput>, res: Response) {
    const { email, message } = req.body;
    const domId = req.user!.id; // Von Auth Middleware gesetzt

    try {
      // Generiere einzigartigen 8-stelligen Code
      const code = nanoid(8).toUpperCase();

      // Erstelle Einladung in Transaktion
      const invitation = await prisma.$transaction(async (tx) => {
        // Prüfe ob bereits eine aktive Einladung existiert
        const existingInvitation = await tx.invitation.findFirst({
          where: {
            email,
            domId,
            status: 'PENDING',
            expiresAt: { gt: new Date() },
          },
        });

        if (existingInvitation) {
          throw new CustomError(
            'INVITATION_EXISTS',
            'Es existiert bereits eine aktive Einladung für diese E-Mail'
          );
        }

        // Erstelle neue Einladung
        const invitation = await tx.invitation.create({
          data: {
            code,
            domId,
            email,
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h gültig
          },
          include: {
            dom: {
              select: {
                displayName: true,
              },
            },
          },
        });

        // Sende Einladungs-E-Mail
        await emailService.sendInvitationEmail(
          email,
          code,
          invitation.dom.displayName || 'Ein DOM'
        );

        return invitation;
      });

      logger.info(`Einladung erstellt: ${invitation.id} für ${email}`);
      res.status(201).json({
        message: 'Einladung erfolgreich erstellt und versendet',
        invitationId: invitation.id,
      });
    } catch (error) {
      logger.error('Fehler beim Erstellen der Einladung:', error);
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Interner Server Fehler' });
      }
    }
  }

  static async validate(
    req: Request<{}, {}, ValidateInvitationInput>,
    res: Response
  ) {
    const { code } = req.body;

    try {
      const invitation = await prisma.invitation.findUnique({
        where: { code },
        include: {
          dom: {
            select: {
              id: true,
              displayName: true,
            },
          },
        },
      });

      if (!invitation) {
        throw new CustomError('INVALID_CODE', 'Ungültiger Einladungscode');
      }

      if (invitation.status !== 'PENDING') {
        throw new CustomError(
          'ALREADY_USED',
          'Dieser Einladungscode wurde bereits verwendet'
        );
      }

      if (invitation.expiresAt < new Date()) {
        throw new CustomError('EXPIRED', 'Dieser Einladungscode ist abgelaufen');
      }

      res.json({
        valid: true,
        domName: invitation.dom.displayName,
        email: invitation.email,
      });
    } catch (error) {
      logger.error('Fehler bei Code-Validierung:', error);
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Interner Server Fehler' });
      }
    }
  }

  static async accept(
    req: Request<{}, {}, AcceptInvitationInput>,
    res: Response
  ) {
    const { code } = req.body;
    const subId = req.user!.id; // Von Auth Middleware gesetzt

    try {
      // Führe alle Operationen in einer Transaktion aus
      const result = await prisma.$transaction(async (tx) => {
        // Finde und sperre die Einladung
        const invitation = await tx.invitation.findUnique({
          where: { code },
          include: {
            dom: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        });

        if (!invitation) {
          throw new CustomError('INVALID_CODE', 'Ungültiger Einladungscode');
        }

        if (invitation.status !== 'PENDING') {
          throw new CustomError(
            'ALREADY_USED',
            'Dieser Einladungscode wurde bereits verwendet'
          );
        }

        if (invitation.expiresAt < new Date()) {
          throw new CustomError('EXPIRED', 'Dieser Einladungscode ist abgelaufen');
        }

        // Prüfe ob bereits eine Verbindung existiert
        const existingConnection = await connectionService.checkExistingConnection(
          invitation.domId,
          subId
        );
        if (existingConnection) {
          throw new CustomError(
            'CONNECTION_EXISTS',
            'Es existiert bereits eine Verbindung'
          );
        }

        // Aktualisiere Einladungsstatus
        const updatedInvitation = await tx.invitation.update({
          where: { id: invitation.id },
          data: {
            status: 'ACCEPTED',
            acceptedAt: new Date(),
          },
        });

        // Erstelle Connection
        const connection = await connectionService.createConnection(
          invitation.domId,
          subId
        );

        return { invitation: updatedInvitation, connection };
      });

      logger.info(
        `Einladung ${result.invitation.id} erfolgreich angenommen, Connection ${result.connection.id} erstellt`
      );
      res.json({
        message: 'Einladung erfolgreich angenommen',
        connectionId: result.connection.id,
      });
    } catch (error) {
      logger.error('Fehler beim Annehmen der Einladung:', error);
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Interner Server Fehler' });
      }
    }
  }

  static async listMyInvitations(req: Request, res: Response) {
    const domId = req.user!.id;

    try {
      const invitations = await prisma.invitation.findMany({
        where: {
          domId,
          OR: [
            { status: 'PENDING' },
            {
              status: 'ACCEPTED',
              createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Letzte 30 Tage
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(invitations);
    } catch (error) {
      logger.error('Fehler beim Abrufen der Einladungen:', error);
      res.status(500).json({ error: 'Interner Server Fehler' });
    }
  }
}
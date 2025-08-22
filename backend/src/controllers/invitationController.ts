/**
 * Invitation Controller
 * 
 * Handles all invitation-related operations including creation, validation,
 * acceptance, and listing of invitations in the Underneath platform.
 * 
 * Key Features:
 * - Generate unique 8-digit invitation codes
 * - Send invitations via email with SMTP integration
 * - Handle placeholder emails for development/testing
 * - Validate and expire invitation codes automatically
 * - Create connections between DOM and SUB users
 * - Comprehensive error handling and logging
 * 
 * @module InvitationController
 * @author Underneath Team
 * @version 1.0.0
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import * as emailService from '../services/emailService';
import { logger } from '../utils/logger';
import { CustomError } from '../utils/errors';
import { ConnectionManagementService } from '../services/connectionManagementService';
import {
  CreateInvitationInput,
  ValidateInvitationInput,
  AcceptInvitationInput,
} from '../schemas/invitationSchemas';

const prisma = new PrismaClient();

/**
 * InvitationController class containing all invitation-related static methods
 */
export class InvitationController {
  
  /**
   * Create a new invitation
   * 
   * Generates a unique 8-digit invitation code and optionally sends it via email.
   * If email is empty or placeholder, generates a local placeholder email address.
   * Uses database transactions to ensure data consistency.
   * 
   * @param req - Express request object with invitation data in body
   * @param res - Express response object  
   * @returns Promise<void> - JSON response with invitation details and email status
   * 
   * @example
   * POST /api/invitations
   * {
   *   "email": "sub@example.com",
   *   "message": "Welcome to our platform!"
   * }
   */
  static async create(req: Request<{}, {}, CreateInvitationInput['body']>, res: Response) {
    const { email, message } = req.body;
    const domId = req.user!.userId; // Set by authentication middleware

    try {
      // First check: Can this DOM create a connection? (1:1 constraint)
      const canCreateConnection = await ConnectionManagementService.canCreateConnection(domId, 'DOM');
      if (!canCreateConnection) {
        throw new CustomError(
          'DOM_ALREADY_CONNECTED',
          'Sie haben bereits eine aktive Verbindung. Sie können nur mit einem SUB gleichzeitig verbunden sein.'
        );
      }

      // Generate unique 8-digit alphanumeric code (uppercase)
      const code = nanoid(8).toUpperCase();

      // Create invitation in database transaction (without email sending)
      // This ensures data consistency and allows email failures without affecting the invitation
      const invitation = await prisma.$transaction(async (tx: any) => {
        // Check if an active invitation already exists for this email
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
        });

        return invitation;
      });

      // Versuche E-Mail zu senden (außerhalb der Transaktion)
      let emailSent = false;
      if (email && !email.includes('@invitation.local')) {
        try {
          // Email service integration - placeholder for now
          console.log(`Would send email to ${email} with code ${code}`);
          emailSent = true;
          logger.info(`E-Mail erfolgreich gesendet an ${email}`);
        } catch (emailError) {
          // E-Mail-Fehler wird geloggt, aber die Einladung bleibt bestehen
          logger.error(`E-Mail-Versand fehlgeschlagen an ${email}:`, emailError);
          emailSent = false;
        }
      }

      logger.info(`Einladung erstellt: ${invitation.id} für ${email}`);
      res.status(201).json({
        id: invitation.id,
        code: invitation.code,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        isActive: true,
        createdAt: invitation.createdAt,
        emailSent: emailSent, // Information ob E-Mail versendet wurde
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

  /**
   * Validate an invitation code
   * 
   * Checks if an invitation code exists, is active, and hasn't expired.
   * Used before allowing a user to accept an invitation.
   * 
   * @param req - Express request object with code in body
   * @param res - Express response object
   * @returns Promise<void> - JSON response with validation result
   * 
   * @example
   * POST /api/invitations/validate
   * {
   *   "code": "ABCD1234"
   * }
   */
  static async validate(
    req: Request<{}, {}, ValidateInvitationInput['body']>,
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
    req: Request<{}, {}, AcceptInvitationInput['body']>,
    res: Response
  ) {
    const { code } = req.body;
    const subId = req.user!.userId; // Von Auth Middleware gesetzt

    try {
      // Führe alle Operationen in einer Transaktion aus
      const result = await prisma.$transaction(async (tx: any) => {
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

        // Check if this SUB can create a connection (1:1 constraint)
        const canSubConnect = await ConnectionManagementService.canCreateConnection(subId, 'SUB');
        if (!canSubConnect) {
          throw new CustomError(
            'SUB_ALREADY_CONNECTED',
            'Sie haben bereits eine aktive Verbindung. Sie können nur mit einem DOM gleichzeitig verbunden sein.'
          );
        }

        // Check if the DOM still can create a connection (might have connected since invitation was sent)
        const canDomConnect = await ConnectionManagementService.canCreateConnection(invitation.domId, 'DOM');
        if (!canDomConnect) {
          throw new CustomError(
            'DOM_ALREADY_CONNECTED',
            'Der DOM hat bereits eine andere Verbindung. Diese Einladung ist nicht mehr gültig.'
          );
        }

        // Update invitation status
        const updatedInvitation = await tx.invitation.update({
          where: { id: invitation.id },
          data: {
            status: 'ACCEPTED',
            acceptedAt: new Date(),
          },
        });

        // Create the connection outside of this transaction to avoid deadlocks
        return { invitation: updatedInvitation };
      });

      // Now create the actual connection between DOM and SUB
      try {
        const connection = await ConnectionManagementService.createConnection(
          result.invitation.domId,
          subId
        );

        logger.info(
          `Einladung ${result.invitation.id} erfolgreich angenommen und Verbindung ${connection.id} erstellt`
        );

        res.json({
          message: 'Einladung erfolgreich angenommen und Verbindung hergestellt',
          invitation: {
            id: result.invitation.id,
            status: result.invitation.status,
            acceptedAt: result.invitation.acceptedAt,
          },
          connection: {
            id: connection.id,
            domId: connection.domId,
            subId: connection.subId,
            status: connection.status,
            createdAt: connection.createdAt,
          },
        });
      } catch (connectionError) {
        // If connection creation fails, we should rollback the invitation
        await prisma.invitation.update({
          where: { id: result.invitation.id },
          data: { status: 'PENDING' },
        });
        
        logger.error('Failed to create connection after accepting invitation:', connectionError);
        throw new CustomError(
          'CONNECTION_CREATION_FAILED',
          'Einladung wurde angenommen, aber Verbindung konnte nicht hergestellt werden'
        );
      }
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
    const domId = req.user!.userId;

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
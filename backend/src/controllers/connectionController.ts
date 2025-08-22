/**
 * Connection Controller
 * 
 * Handles all connection-related operations for user profile management.
 * Provides API endpoints for viewing, terminating, and managing 1:1 connections.
 * 
 * Key Features:
 * - Get user's current connection details
 * - Terminate existing connections
 * - Check connection availability
 * - Admin functions for connection oversight
 * 
 * @module ConnectionController
 * @author Underneath Team
 * @version 1.0.0
 */

import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { CustomError } from '../utils/errors';
import { ConnectionManagementService } from '../services/connectionManagementService';

export class ConnectionController {
  
  /**
   * Get current connection for authenticated user
   * 
   * @param req - Express request object
   * @param res - Express response object
   * @returns Promise<void> - JSON response with connection details
   * 
   * @example
   * GET /api/connections/my-connection
   */
  static async getMyConnection(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    try {
      const connection = await ConnectionManagementService.getUserConnection(userId, userRole);
      
      if (!connection) {
        return res.json({
          hasConnection: false,
          connection: null,
          message: 'Sie haben derzeit keine aktive Verbindung'
        });
      }

      res.json({
        hasConnection: true,
        connection: {
          id: connection.id,
          status: connection.status,
          createdAt: connection.createdAt,
          partner: userRole === 'DOM' ? {
            id: connection.sub.id,
            email: connection.sub.email,
            displayName: connection.sub.displayName,
            role: 'SUB'
          } : {
            id: connection.dom.id,
            email: connection.dom.email,
            displayName: connection.dom.displayName,
            role: 'DOM'
          }
        }
      });
    } catch (error) {
      logger.error('Error getting user connection:', error);
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Fehler beim Abrufen der Verbindungsdaten' });
      }
    }
  }

  /**
   * Terminate user's current connection
   * 
   * @param req - Express request object
   * @param res - Express response object
   * @returns Promise<void> - JSON response with termination result
   * 
   * @example
   * POST /api/connections/terminate
   */
  static async terminateMyConnection(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    try {
      // First get the user's current connection
      const connection = await ConnectionManagementService.getUserConnection(userId, userRole);
      
      if (!connection) {
        return res.status(404).json({ 
          error: 'Sie haben keine aktive Verbindung zum Beenden' 
        });
      }

      // Terminate the connection
      const terminatedConnection = await ConnectionManagementService.terminateConnection(
        connection.id, 
        userId
      );

      logger.info(`Connection terminated by user ${userId}: ${connection.id}`);

      res.json({
        message: 'Verbindung erfolgreich beendet',
        connection: {
          id: terminatedConnection.id,
          status: terminatedConnection.status,
          terminatedAt: terminatedConnection.updatedAt,
          partner: userRole === 'DOM' ? {
            id: terminatedConnection.sub.id,
            email: terminatedConnection.sub.email,
            displayName: terminatedConnection.sub.displayName,
            role: 'SUB'
          } : {
            id: terminatedConnection.dom.id,
            email: terminatedConnection.dom.email,
            displayName: terminatedConnection.dom.displayName,
            role: 'DOM'
          }
        }
      });
    } catch (error) {
      logger.error('Error terminating connection:', error);
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Fehler beim Beenden der Verbindung' });
      }
    }
  }

  /**
   * Check if user can create new connections
   * 
   * @param req - Express request object
   * @param res - Express response object
   * @returns Promise<void> - JSON response with availability status
   * 
   * @example
   * GET /api/connections/availability
   */
  static async checkConnectionAvailability(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    try {
      const canCreate = await ConnectionManagementService.canCreateConnection(userId, userRole);
      const existingConnection = await ConnectionManagementService.getUserConnection(userId, userRole);

      res.json({
        canCreateConnection: canCreate,
        hasActiveConnection: !!existingConnection,
        currentConnection: existingConnection ? {
          id: existingConnection.id,
          status: existingConnection.status,
          createdAt: existingConnection.createdAt,
          partner: userRole === 'DOM' ? {
            id: existingConnection.sub.id,
            email: existingConnection.sub.email,
            displayName: existingConnection.sub.displayName,
            role: 'SUB'
          } : {
            id: existingConnection.dom.id,
            email: existingConnection.dom.email,
            displayName: existingConnection.dom.displayName,
            role: 'DOM'
          }
        } : null
      });
    } catch (error) {
      logger.error('Error checking connection availability:', error);
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Fehler beim Prüfen der Verbindungsverfügbarkeit' });
      }
    }
  }

  /**
   * Get all connections (Admin only)
   * 
   * @param req - Express request object
   * @param res - Express response object
   * @returns Promise<void> - JSON response with all connections
   * 
   * @example
   * GET /api/connections/admin/all?limit=50&offset=0
   */
  static async getAllConnections(req: Request, res: Response) {
    const userRole = req.user!.role;

    // Check if user is admin
    if (userRole !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Zugriff verweigert. Nur Administratoren können alle Verbindungen einsehen.' 
      });
    }

    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const connections = await ConnectionManagementService.getAllConnections(limit, offset);

      res.json({
        connections: connections.map(conn => ({
          id: conn.id,
          status: conn.status,
          createdAt: conn.createdAt,
          updatedAt: conn.updatedAt,
          dom: {
            id: conn.dom.id,
            email: conn.dom.email,
            displayName: conn.dom.displayName
          },
          sub: {
            id: conn.sub.id,
            email: conn.sub.email,
            displayName: conn.sub.displayName
          }
        })),
        pagination: {
          limit,
          offset,
          total: connections.length
        }
      });
    } catch (error) {
      logger.error('Error getting all connections:', error);
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Fehler beim Abrufen aller Verbindungen' });
      }
    }
  }

  /**
   * Terminate specific connection (Admin only)
   * 
   * @param req - Express request object with connection ID
   * @param res - Express response object
   * @returns Promise<void> - JSON response with termination result
   * 
   * @example
   * POST /api/connections/admin/:connectionId/terminate
   */
  static async adminTerminateConnection(req: Request, res: Response) {
    const userRole = req.user!.role;
    const userId = req.user!.userId;
    const connectionId = req.params.connectionId;

    // Check if user is admin
    if (userRole !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Zugriff verweigert. Nur Administratoren können Verbindungen beenden.' 
      });
    }

    try {
      const terminatedConnection = await ConnectionManagementService.terminateConnection(
        connectionId, 
        userId
      );

      logger.info(`Connection terminated by admin ${userId}: ${connectionId}`);

      res.json({
        message: 'Verbindung durch Administrator beendet',
        connection: {
          id: terminatedConnection.id,
          status: terminatedConnection.status,
          terminatedAt: terminatedConnection.updatedAt,
          dom: {
            id: terminatedConnection.dom.id,
            email: terminatedConnection.dom.email,
            displayName: terminatedConnection.dom.displayName
          },
          sub: {
            id: terminatedConnection.sub.id,
            email: terminatedConnection.sub.email,
            displayName: terminatedConnection.sub.displayName
          }
        }
      });
    } catch (error) {
      logger.error('Error in admin connection termination:', error);
      if (error instanceof CustomError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Fehler beim administrativen Beenden der Verbindung' });
      }
    }
  }
}
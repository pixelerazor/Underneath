/**
 * Connection Management Service
 * 
 * Manages 1:1 connections between DOM and SUB users in the Underneath platform.
 * Ensures business rule: One DOM can only connect to one SUB, and vice versa.
 * 
 * Key Features:
 * - Create new connections between DOM and SUB
 * - Validate 1:1 relationship constraints
 * - Terminate existing connections
 * - Check connection status and availability
 * - Handle connection conflicts and errors
 * 
 * @module ConnectionManagementService
 * @author Underneath Team  
 * @version 1.0.0
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { CustomError } from '../utils/errors';

enum ConnectionStatus {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED', 
  SUSPENDED = 'SUSPENDED',
}

enum UserRole {
  DOM = 'DOM',
  SUB = 'SUB',
  OBSERVER = 'OBSERVER',
  ADMIN = 'ADMIN',
}

interface ConnectionInfo {
  id: string;
  domId: string;
  subId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  dom: {
    id: string;
    email: string;
    displayName?: string;
  };
  sub: {
    id: string;
    email: string;
    displayName?: string;
  };
}

const prisma = new PrismaClient();

export class ConnectionManagementService {
  
  /**
   * Check if a user already has an active connection
   * 
   * @param userId - ID of the user to check
   * @param role - Role of the user (DOM or SUB)
   * @returns Promise<ConnectionInfo | null> - Active connection or null
   */
  static async checkExistingConnection(userId: string, role: string): Promise<ConnectionInfo | null> {
    try {
      const whereClause = role === UserRole.DOM 
        ? { domId: userId, status: ConnectionStatus.ACTIVE }
        : { subId: userId, status: ConnectionStatus.ACTIVE };
      
      const connection = await prisma.connection.findFirst({
        where: whereClause,
        include: {
          dom: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          },
          sub: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          }
        }
      });

      return connection;
    } catch (error) {
      logger.error('Error checking existing connection:', error);
      throw new CustomError('DATABASE_ERROR', 'Failed to check existing connection');
    }
  }

  /**
   * Create a new connection between DOM and SUB
   * 
   * @param domId - ID of the DOM user
   * @param subId - ID of the SUB user
   * @returns Promise<ConnectionInfo> - Created connection
   * @throws CustomError if validation fails or users already connected
   */
  static async createConnection(domId: string, subId: string): Promise<ConnectionInfo> {
    try {
      // Validate that users exist and have correct roles
      const [domUser, subUser] = await Promise.all([
        prisma.user.findUnique({ where: { id: domId } }),
        prisma.user.findUnique({ where: { id: subId } })
      ]);

      if (!domUser || domUser.role !== UserRole.DOM) {
        throw new CustomError('INVALID_DOM', 'DOM user not found or invalid role');
      }

      if (!subUser || subUser.role !== UserRole.SUB) {
        throw new CustomError('INVALID_SUB', 'SUB user not found or invalid role');
      }

      // Check if either user already has an active connection
      const [existingDomConnection, existingSubConnection] = await Promise.all([
        this.checkExistingConnection(domId, UserRole.DOM),
        this.checkExistingConnection(subId, UserRole.SUB)
      ]);

      if (existingDomConnection) {
        throw new CustomError(
          'DOM_ALREADY_CONNECTED', 
          'This DOM is already connected to another SUB'
        );
      }

      if (existingSubConnection) {
        throw new CustomError(
          'SUB_ALREADY_CONNECTED',
          'This SUB is already connected to another DOM'
        );
      }

      // Create the connection
      const connection = await prisma.connection.create({
        data: {
          domId,
          subId,
          status: ConnectionStatus.ACTIVE,
        },
        include: {
          dom: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          },
          sub: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          }
        }
      });

      logger.info(`Connection created: DOM ${domId} <-> SUB ${subId}`);
      return connection;

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      
      logger.error('Error creating connection:', error);
      throw new CustomError('CONNECTION_CREATION_FAILED', 'Failed to create connection');
    }
  }

  /**
   * Terminate an existing connection
   * 
   * @param connectionId - ID of the connection to terminate
   * @param initiatorId - ID of the user initiating the termination
   * @returns Promise<ConnectionInfo> - Updated connection
   * @throws CustomError if connection not found or user not authorized
   */
  static async terminateConnection(connectionId: string, initiatorId: string): Promise<ConnectionInfo> {
    try {
      // Find the connection and verify the initiator is part of it
      const connection = await prisma.connection.findUnique({
        where: { id: connectionId },
        include: {
          dom: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          },
          sub: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          }
        }
      });

      if (!connection) {
        throw new CustomError('CONNECTION_NOT_FOUND', 'Connection not found');
      }

      if (connection.status !== ConnectionStatus.ACTIVE) {
        throw new CustomError('CONNECTION_NOT_ACTIVE', 'Connection is not active');
      }

      // Verify the initiator is either the DOM or SUB in this connection
      if (connection.domId !== initiatorId && connection.subId !== initiatorId) {
        throw new CustomError('UNAUTHORIZED', 'You are not authorized to terminate this connection');
      }

      // Update connection status to terminated
      const updatedConnection = await prisma.connection.update({
        where: { id: connectionId },
        data: {
          status: ConnectionStatus.TERMINATED,
          updatedAt: new Date(),
        },
        include: {
          dom: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          },
          sub: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          }
        }
      });

      logger.info(`Connection terminated: ${connectionId} by user ${initiatorId}`);
      return updatedConnection;

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      
      logger.error('Error terminating connection:', error);
      throw new CustomError('TERMINATION_FAILED', 'Failed to terminate connection');
    }
  }

  /**
   * Get connection details for a user
   * 
   * @param userId - ID of the user
   * @param role - Role of the user (DOM or SUB)
   * @returns Promise<ConnectionInfo | null> - Connection details or null
   */
  static async getUserConnection(userId: string, role: string): Promise<ConnectionInfo | null> {
    try {
      return await this.checkExistingConnection(userId, role);
    } catch (error) {
      logger.error('Error getting user connection:', error);
      throw new CustomError('CONNECTION_FETCH_FAILED', 'Failed to fetch connection details');
    }
  }

  /**
   * Check if a user can create a new connection
   * 
   * @param userId - ID of the user
   * @param role - Role of the user (DOM or SUB)
   * @returns Promise<boolean> - True if user can create connection, false otherwise
   */
  static async canCreateConnection(userId: string, role: string): Promise<boolean> {
    try {
      const existingConnection = await this.checkExistingConnection(userId, role);
      return existingConnection === null;
    } catch (error) {
      logger.error('Error checking connection availability:', error);
      return false;
    }
  }

  /**
   * Get all connections (admin function)
   * 
   * @param limit - Maximum number of connections to return
   * @param offset - Number of connections to skip
   * @returns Promise<ConnectionInfo[]> - List of connections
   */
  static async getAllConnections(limit: number = 50, offset: number = 0): Promise<ConnectionInfo[]> {
    try {
      const connections = await prisma.connection.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          dom: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          },
          sub: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          }
        }
      });

      return connections;
    } catch (error) {
      logger.error('Error fetching all connections:', error);
      throw new CustomError('CONNECTIONS_FETCH_FAILED', 'Failed to fetch connections');
    }
  }
}
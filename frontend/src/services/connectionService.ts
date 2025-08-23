/**
 * Connection Service
 * 
 * Frontend service for managing 1:1 connections between DOM and SUB users.
 * Provides API integration for connection management functionality.
 * 
 * @module ConnectionService
 * @author Underneath Team
 * @version 1.0.0
 */

import { apiClient } from './apiClient';

// Types for connection data
export interface ConnectionPartner {
  id: string;
  email: string;
  displayName?: string;
  role: 'DOM' | 'SUB';
}

export interface Connection {
  id: string;
  status: string;
  createdAt: string;
  partner: ConnectionPartner;
}

export interface ConnectionResponse {
  hasConnection: boolean;
  connection: Connection | null;
  message?: string;
}

export interface ConnectionAvailability {
  canCreateConnection: boolean;
  hasActiveConnection: boolean;
  currentConnection: Connection | null;
}


/**
 * Connection Service Class
 */
export class ConnectionService {

  /**
   * Get current connection for authenticated user
   * 
   * @returns Promise<ConnectionResponse> - Current connection details
   * @throws Error if request fails
   */
  static async getMyConnection(): Promise<ConnectionResponse> {
    try {
      const response = await apiClient.get('/connections/my-connection');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching connection:', error);
      throw new Error(
        error.response?.data?.error || 'Fehler beim Abrufen der Verbindungsdaten'
      );
    }
  }

  /**
   * Terminate current connection
   * 
   * @returns Promise<any> - Termination result
   * @throws Error if request fails or user has no connection
   */
  static async terminateMyConnection(): Promise<any> {
    try {
      const response = await apiClient.post('/connections/terminate');
      return response.data;
    } catch (error: any) {
      console.error('Error terminating connection:', error);
      throw new Error(
        error.response?.data?.error || 'Fehler beim Beenden der Verbindung'
      );
    }
  }

  /**
   * Check if user can create new connections
   * 
   * @returns Promise<ConnectionAvailability> - Connection availability status
   * @throws Error if request fails
   */
  static async checkConnectionAvailability(): Promise<ConnectionAvailability> {
    try {
      const response = await apiClient.get('/connections/availability');
      return response.data;
    } catch (error: any) {
      console.error('Error checking connection availability:', error);
      throw new Error(
        error.response?.data?.error || 'Fehler beim Prüfen der Verbindungsverfügbarkeit'
      );
    }
  }

  /**
   * Handle specific connection error types for better UX
   * 
   * @param error - Error object from API
   * @returns string - User-friendly error message
   */
  static getConnectionErrorMessage(error: any): string {
    const errorMessage = error.response?.data?.error || error.message;
    
    // Map backend error codes to user-friendly German messages
    const errorMappings: Record<string, string> = {
      'DOM_ALREADY_CONNECTED': 'Sie haben bereits eine aktive Verbindung. Sie können nur mit einem SUB gleichzeitig verbunden sein.',
      'SUB_ALREADY_CONNECTED': 'Sie haben bereits eine aktive Verbindung. Sie können nur mit einem DOM gleichzeitig verbunden sein.',
      'CONNECTION_NOT_FOUND': 'Keine aktive Verbindung gefunden.',
      'CONNECTION_NOT_ACTIVE': 'Die Verbindung ist nicht mehr aktiv.',
      'UNAUTHORIZED': 'Sie sind nicht berechtigt, diese Aktion durchzuführen.',
      'INVALID_DOM': 'Ungültiger DOM-Benutzer.',
      'INVALID_SUB': 'Ungültiger SUB-Benutzer.',
      'CONNECTION_CREATION_FAILED': 'Verbindung konnte nicht hergestellt werden.',
      'TERMINATION_FAILED': 'Verbindung konnte nicht beendet werden.',
      'DATABASE_ERROR': 'Datenbankfehler. Bitte versuchen Sie es später erneut.',
    };

    // Check if error message contains any of our known error codes
    for (const [code, message] of Object.entries(errorMappings)) {
      if (errorMessage.includes(code)) {
        return message;
      }
    }

    // Return the original error message if no mapping found
    return errorMessage;
  }

  /**
   * Get connection status display text
   * 
   * @param status - Connection status from API
   * @returns string - User-friendly status text
   */
  static getConnectionStatusText(status: string): string {
    const statusMappings: Record<string, string> = {
      'ACTIVE': 'Aktiv',
      'TERMINATED': 'Beendet', 
      'SUSPENDED': 'Pausiert',
    };

    return statusMappings[status] || status;
  }

  /**
   * Get connection duration text
   * 
   * @param createdAt - Connection creation date
   * @returns string - Human-readable duration
   */
  static getConnectionDuration(createdAt: string): string {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} Tag${days !== 1 ? 'e' : ''}`;
    } else if (hours > 0) {
      return `${hours} Stunde${hours !== 1 ? 'n' : ''}`;
    } else {
      return 'Weniger als eine Stunde';
    }
  }

  /**
   * Check if user can send invitations (no active connection)
   * 
   * @returns Promise<boolean> - True if user can send invitations
   */
  static async canSendInvitation(): Promise<boolean> {
    try {
      const availability = await this.checkConnectionAvailability();
      return availability.canCreateConnection;
    } catch (error) {
      console.error('Error checking invitation capability:', error);
      return false;
    }
  }
}
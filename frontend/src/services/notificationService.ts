/**
 * Notification Service (Simplified)
 * 
 * Vereinfachte Push-Benachrichtigungen ohne Firebase-Dependencies
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { toast } from 'sonner';
import { log } from '../utils/logger';

interface NotificationData {
  title: string;
  body: string;
  url?: string;
  type?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private permissionGranted: boolean = false;
  private isFirebaseAvailable: boolean = false;

  private constructor() {
    this.checkNotificationSupport();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Prüfe Browser-Unterstützung für Notifications
   */
  private checkNotificationSupport(): void {
    this.isFirebaseAvailable = 'Notification' in window && 'serviceWorker' in navigator;
    log.debug('NotificationService', 'Notification support', { isFirebaseAvailable: this.isFirebaseAvailable });
  }

  /**
   * Browser-Permission für Benachrichtigungen anfordern
   */
  async requestPermission(): Promise<boolean> {
    try {
      log.info('NotificationService', 'Requesting notification permission');
      
      if (!this.isFirebaseAvailable) {
        log.warn('NotificationService', 'Browser does not support notifications');
        return false;
      }

      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        this.permissionGranted = true;
        log.info('NotificationService', 'Notification permission granted');
        
        // Push-Benachrichtigung zur Bestätigung
        setTimeout(() => {
          this.showNotification({
            title: 'Push-Nachrichten aktiviert',
            body: 'Sie erhalten jetzt wichtige Benachrichtigungen von Underneath.',
            type: 'permission_granted'
          });
        }, 1000);
        
        return true;
      } else {
        log.warn('NotificationService', 'Notification permission denied');
        
        // Browser-Benachrichtigung geht nicht, also nur console log
        log.warn('NotificationService', 'Push-Nachrichten wurden abgelehnt - keine Benachrichtigungen möglich');
        
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Lokale Browser-Benachrichtigung anzeigen
   */
  async showNotification(data: NotificationData): Promise<void> {
    try {
      if (!this.permissionGranted || !this.isFirebaseAvailable) {
        // Fallback für wichtige Nachrichten: Log with prominent message
        console.warn('🔔 NOTIFICATION (no permission):', data.title, '-', data.body);
        // Optional: Show as document title flash for critical messages
        if (data.type === 'success' || data.type === 'navigation') {
          const originalTitle = document.title;
          document.title = `✓ ${data.title}`;
          setTimeout(() => {
            document.title = originalTitle;
          }, 3000);
        }
        return;
      }

      // Browser-Benachrichtigung
      const notification = new Notification(data.title, {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'underneath-notification',
        requireInteraction: true,
        data: { url: data.url },
      });

      // Click-Handler für Navigation
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        if (data.url) {
          window.location.href = data.url;
        }
        notification.close();
      };

      log.debug('NotificationService', 'Local notification shown', { title: data.title });
    } catch (error) {
      console.error('Error showing notification:', error);
      // No toast fallback - just log the error
    }
  }

  /**
   * Profile-Completion Benachrichtigung
   */
  async sendProfileCompletedNotification(): Promise<void> {
    await this.showNotification({
      title: 'Profil vervollständigt',
      body: 'Willkommen bei Underneath! Ihr Profil wurde erfolgreich eingerichtet.',
      url: '/dashboard/overview',
      type: 'profile_completed',
    });
  }

  /**
   * Test-Benachrichtigung
   */
  async sendTestNotification(): Promise<void> {
    await this.showNotification({
      title: 'Test-Nachricht',
      body: 'Dies ist eine Test-Benachrichtigung von Underneath',
      type: 'test',
    });
  }

  /**
   * Current permission status
   */
  get hasPermission(): boolean {
    return this.permissionGranted;
  }

  /**
   * Browser support check
   */
  get isSupported(): boolean {
    return this.isFirebaseAvailable;
  }
}

export default NotificationService.getInstance();
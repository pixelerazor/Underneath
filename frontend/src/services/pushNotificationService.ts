/**
 * Push Notification Service
 * 
 * Service für die Verwaltung von Push-Nachrichten in der App
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { requestNotificationPermission, onMessageListener, sendPushNotification } from '../firebase/config';
import { toast } from 'sonner';

interface PushNotificationData {
  title: string;
  body: string;
  url?: string;
  userId?: string;
  type?: 'profile_completed' | 'task_assigned' | 'rule_reminder' | 'general';
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private fcmToken: string | null = null;
  private permissionGranted: boolean = false;

  private constructor() {
    this.initializeMessageListener();
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Push-Berechtigung anfordern und FCM Token holen
   */
  async requestPermission(): Promise<boolean> {
    try {
      console.log('Requesting push notification permission...');
      
      // Browser Push-Berechtigung prüfen
      if (!('Notification' in window)) {
        console.log('Browser does not support notifications');
        toast('Ihr Browser unterstützt keine Push-Nachrichten', {
          style: {
            background: 'hsl(0 0% 15%)',
            color: 'hsl(0 0% 75%)',
            border: '2px solid hsl(0 62% 30%)',
            borderRadius: '0.5rem',
          },
        });
        return false;
      }

      // FCM Token anfordern
      const token = await requestNotificationPermission();
      
      if (token) {
        this.fcmToken = token;
        this.permissionGranted = true;
        
        // Token an Backend senden
        await this.registerTokenWithBackend(token);
        
        toast('Push-Nachrichten aktiviert', {
          style: {
            background: 'hsl(0 0% 15%)',
            color: 'hsl(0 0% 75%)',
            border: '2px solid hsl(0 62% 30%)',
            borderRadius: '0.5rem',
          },
        });
        
        return true;
      } else {
        toast('Push-Nachrichten wurden abgelehnt', {
          style: {
            background: 'hsl(0 0% 15%)',
            color: 'hsl(0 0% 75%)',
            border: '2px solid hsl(0 62% 30%)',
            borderRadius: '0.5rem',
          },
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting push permission:', error);
      toast('Fehler beim Aktivieren der Push-Nachrichten', {
        style: {
          background: 'hsl(0 0% 15%)',
          color: 'hsl(0 0% 75%)',
          border: '2px solid hsl(0 62% 30%)',
          borderRadius: '0.5rem',
        },
      });
      return false;
    }
  }

  /**
   * FCM Token am Backend registrieren
   */
  private async registerTokenWithBackend(token: string): Promise<void> {
    try {
      const response = await fetch('/api/push/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ fcmToken: token }),
      });

      if (!response.ok) {
        throw new Error('Failed to register FCM token');
      }

      console.log('FCM token registered with backend');
    } catch (error) {
      console.error('Error registering FCM token:', error);
      // Nicht kritisch - lokale Push-Nachrichten funktionieren trotzdem
    }
  }

  /**
   * Listener für eingehende Push-Nachrichten im Vordergrund
   */
  private initializeMessageListener(): void {
    onMessageListener()
      .then((payload) => {
        console.log('Foreground push message received:', payload);
        
        // Toast mit Push-Nachricht anzeigen
        const title = payload.notification?.title || 'Underneath';
        const body = payload.notification?.body || 'Sie haben eine neue Nachricht';
        
        toast(`${title}: ${body}`, {
          duration: 5000,
          style: {
            background: 'hsl(0 0% 15%)',
            color: 'hsl(0 0% 75%)',
            border: '2px solid hsl(0 62% 30%)',
            borderRadius: '0.5rem',
          },
        });
      })
      .catch((error) => {
        console.error('Error setting up message listener:', error);
      });
  }

  /**
   * Test-Push-Nachricht senden
   */
  async sendTestNotification(): Promise<void> {
    if (!this.fcmToken) {
      toast('Bitte zuerst Push-Berechtigung erteilen', {
        style: {
          background: 'hsl(0 0% 15%)',
          color: 'hsl(0 0% 75%)',
          border: '2px solid hsl(0 62% 30%)',
          borderRadius: '0.5rem',
        },
      });
      return;
    }

    const success = await sendPushNotification(
      this.fcmToken,
      'Test-Nachricht',
      'Dies ist eine Test-Push-Nachricht von Underneath',
      { type: 'test' }
    );

    if (success) {
      toast('Test-Push-Nachricht gesendet', {
        style: {
          background: 'hsl(0 0% 15%)',
          color: 'hsl(0 0% 75%)',
          border: '2px solid hsl(0 62% 30%)',
          borderRadius: '0.5rem',
        },
      });
    } else {
      toast('Fehler beim Senden der Test-Nachricht', {
        style: {
          background: 'hsl(0 0% 15%)',
          color: 'hsl(0 0% 75%)',
          border: '2px solid hsl(0 62% 30%)',
          borderRadius: '0.5rem',
        },
      });
    }
  }

  /**
   * Profile-Completion Push-Nachricht
   */
  async sendProfileCompletedNotification(): Promise<void> {
    if (!this.permissionGranted) return;

    // Lokale Notification für sofortiges Feedback
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Profil vervollständigt', {
        body: 'Ihr Profil wurde erfolgreich vervollständigt. Willkommen bei Underneath!',
        icon: '/icon-192x192.png',
        tag: 'profile-completed',
      });
    }

    // Backend-Push-Nachricht (falls Backend verfügbar)
    if (this.fcmToken) {
      await sendPushNotification(
        this.fcmToken,
        'Profil vervollständigt',
        'Willkommen bei Underneath! Ihr Profil wurde erfolgreich eingerichtet.',
        { 
          type: 'profile_completed',
          url: '/dashboard/overview'
        }
      );
    }
  }

  /**
   * Current permission status
   */
  get hasPermission(): boolean {
    return this.permissionGranted;
  }

  /**
   * Current FCM token
   */
  get token(): string | null {
    return this.fcmToken;
  }
}

export default PushNotificationService.getInstance();
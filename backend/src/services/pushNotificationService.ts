/**
 * Push Notification Service (Backend)
 * 
 * Backend-Service für das Senden von Push-Nachrichten über Firebase FCM
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import * as admin from 'firebase-admin';
import { CustomError } from '../utils/errors';
import { PrismaClient } from '@prisma/client';

// Use existing global prisma instance if available
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Firebase Admin Konfiguration
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID || "underneath-app",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "demo-key-id",
  private_key: (process.env.FIREBASE_PRIVATE_KEY || "demo-private-key").replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk@underneath-app.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID || "demo-client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40underneath-app.iam.gserviceaccount.com"
};

// Firebase Admin initialisieren (nur einmal)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || "underneath-app",
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    // In Development: Dummy-Service verwenden
    console.log('Using dummy push service for development');
  }
}

interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  clickAction?: string;
}

export class PushNotificationService {
  /**
   * FCM Token für User registrieren
   */
  static async registerUserToken(userId: string, fcmToken: string): Promise<void> {
    try {
      // FCM Token in Datenbank speichern
      await prisma.user.update({
        where: { id: userId },
        data: { 
          fcmToken: fcmToken,
          pushNotificationsEnabled: true,
          fcmTokenUpdatedAt: new Date(),
        },
      });

      console.log(`FCM token registered for user ${userId}`);
    } catch (error) {
      console.error('Error registering FCM token:', error);
      throw new CustomError('FCM_REGISTRATION_ERROR', 'Failed to register FCM token');
    }
  }

  /**
   * Push-Nachricht an einzelnen User senden
   */
  static async sendToUser(
    userId: string, 
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      // User und FCM Token aus Datenbank holen
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fcmToken: true, pushNotificationsEnabled: true }
      });

      if (!user || !user.fcmToken || !user.pushNotificationsEnabled) {
        console.log(`User ${userId} has no FCM token or push notifications disabled`);
        return false;
      }

      return await this.sendToToken(user.fcmToken, payload);
    } catch (error) {
      console.error('Error sending push notification to user:', error);
      return false;
    }
  }

  /**
   * Push-Nachricht an FCM Token senden
   */
  static async sendToToken(
    fcmToken: string, 
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      // In Development: Dummy-Implementation
      if (process.env.NODE_ENV === 'development' || !admin.apps.length) {
        console.log('DUMMY PUSH NOTIFICATION:', {
          token: fcmToken.substring(0, 20) + '...',
          title: payload.title,
          body: payload.body,
          data: payload.data,
        });
        return true;
      }

      // FCM Message zusammenstellen
      const message: admin.messaging.Message = {
        token: fcmToken,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        webpush: {
          fcmOptions: {
            link: payload.clickAction || '/dashboard/overview',
          },
          notification: {
            title: payload.title,
            body: payload.body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            image: payload.imageUrl,
            tag: 'underneath-notification',
            renotify: true,
            requireInteraction: true,
            actions: [
              {
                action: 'open',
                title: 'Öffnen',
              },
              {
                action: 'dismiss',
                title: 'Schließen',
              }
            ]
          }
        },
        android: {
          notification: {
            icon: '/icon-192x192.png',
            color: '#DC2626', // App primary color
            sound: 'default',
            defaultSound: true,
            channelId: 'underneath-notifications',
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            }
          }
        }
      };

      // Message senden
      const response = await admin.messaging().send(message);
      console.log('Push notification sent successfully:', response);
      return true;

    } catch (error: any) {
      console.error('Error sending FCM notification:', error);
      
      // FCM Token ungültig? -> Aus Datenbank entfernen
      if (error.code === 'messaging/registration-token-not-registered' || 
          error.code === 'messaging/invalid-registration-token') {
        await this.removeInvalidToken(fcmToken);
      }
      
      return false;
    }
  }

  /**
   * Ungültigen FCM Token aus Datenbank entfernen
   */
  private static async removeInvalidToken(fcmToken: string): Promise<void> {
    try {
      await prisma.user.updateMany({
        where: { fcmToken: fcmToken },
        data: { 
          fcmToken: null,
          pushNotificationsEnabled: false,
        },
      });
      console.log('Removed invalid FCM token from database');
    } catch (error) {
      console.error('Error removing invalid FCM token:', error);
    }
  }

  /**
   * Push-Nachricht an mehrere User senden
   */
  static async sendToMultipleUsers(
    userIds: string[],
    payload: PushNotificationPayload
  ): Promise<{ successCount: number; failureCount: number }> {
    let successCount = 0;
    let failureCount = 0;

    // Sequential sending to avoid rate limits
    for (const userId of userIds) {
      const success = await this.sendToUser(userId, payload);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
      
      // Short delay between sends
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Push notifications sent: ${successCount} success, ${failureCount} failures`);
    return { successCount, failureCount };
  }

  /**
   * Profile-Completion Benachrichtigung
   */
  static async sendProfileCompletedNotification(userId: string): Promise<boolean> {
    return await this.sendToUser(userId, {
      title: 'Profil vervollständigt',
      body: 'Willkommen bei Underneath! Ihr Profil wurde erfolgreich eingerichtet.',
      data: {
        type: 'profile_completed',
        userId: userId,
      },
      clickAction: '/dashboard/overview',
    });
  }

  /**
   * Test-Benachrichtigung senden
   */
  static async sendTestNotification(userId: string): Promise<boolean> {
    return await this.sendToUser(userId, {
      title: 'Test-Nachricht',
      body: 'Dies ist eine Test-Push-Nachricht von Underneath',
      data: {
        type: 'test',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
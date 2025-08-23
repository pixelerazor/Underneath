/**
 * Push Notification Controller
 * 
 * REST API Controller für Push-Nachrichten
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { Request, Response } from 'express';
import { PushNotificationService } from '../services/pushNotificationService';
import { CustomError } from '../utils/errors';

/**
 * FCM Token registrieren
 */
export const registerFCMToken = async (req: Request, res: Response) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError('UNAUTHORIZED', 'User not authenticated');
    }

    if (!fcmToken || typeof fcmToken !== 'string') {
      throw new CustomError('VALIDATION_ERROR', 'FCM token is required');
    }

    await PushNotificationService.registerUserToken(userId, fcmToken);

    res.status(200).json({
      success: true,
      message: 'FCM token registered successfully',
    });
  } catch (error) {
    console.error('Error registering FCM token:', error);
    
    if (error instanceof CustomError) {
      res.status(400).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
};

/**
 * Push-Nachricht senden
 */
export const sendPushNotification = async (req: Request, res: Response) => {
  try {
    const { token, notification, data } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError('UNAUTHORIZED', 'User not authenticated');
    }

    if (!token || !notification?.title || !notification?.body) {
      throw new CustomError('VALIDATION_ERROR', 'Token, title and body are required');
    }

    const success = await PushNotificationService.sendToToken(token, {
      title: notification.title,
      body: notification.body,
      data: data || {},
    });

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Push notification sent successfully',
      });
    } else {
      res.status(400).json({
        error: 'Failed to send push notification',
      });
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    
    if (error instanceof CustomError) {
      res.status(400).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
};

/**
 * Test-Push-Nachricht senden
 */
export const sendTestNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError('UNAUTHORIZED', 'User not authenticated');
    }

    const success = await PushNotificationService.sendTestNotification(userId);

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Test notification sent successfully',
      });
    } else {
      res.status(400).json({
        error: 'Failed to send test notification',
      });
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    
    if (error instanceof CustomError) {
      res.status(400).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
};

/**
 * Profile-Completion Benachrichtigung senden
 */
export const sendProfileCompletedNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError('UNAUTHORIZED', 'User not authenticated');
    }

    const success = await PushNotificationService.sendProfileCompletedNotification(userId);

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Profile completed notification sent successfully',
      });
    } else {
      res.status(400).json({
        error: 'Failed to send profile completed notification',
      });
    }
  } catch (error) {
    console.error('Error sending profile completed notification:', error);
    
    if (error instanceof CustomError) {
      res.status(400).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
};
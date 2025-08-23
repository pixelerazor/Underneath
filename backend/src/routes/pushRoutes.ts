/**
 * Push Notification Routes
 * 
 * API Routes für Push-Nachrichten
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { Router } from 'express';
import { 
  registerFCMToken, 
  sendPushNotification, 
  sendTestNotification,
  sendProfileCompletedNotification,
} from '../controllers/pushController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Alle Push-Routes benötigen Authentifizierung
router.use(authenticateToken);

/**
 * POST /api/push/register
 * FCM Token registrieren
 */
router.post('/register', registerFCMToken);

/**
 * POST /api/push/send
 * Push-Nachricht senden
 */
router.post('/send', sendPushNotification);

/**
 * POST /api/push/test
 * Test-Push-Nachricht senden
 */
router.post('/test', sendTestNotification);

/**
 * POST /api/push/profile-completed
 * Profile-Completion Benachrichtigung senden
 */
router.post('/profile-completed', sendProfileCompletedNotification);

export default router;
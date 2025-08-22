// backend/src/routes/invitationRoutes.ts
import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { checkRole } from '../middleware/checkRole';
import { rateLimiter } from '../middleware/rateLimiter';
import { InvitationController } from '../controllers/invitationController';
import {
  createInvitationSchema,
  validateInvitationSchema,
  acceptInvitationSchema,
} from '../schemas/invitationSchemas';

const router = express.Router();

// Rate Limiter Konfigurationen
const createInviteLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 Stunde
  max: 5, // 5 Einladungen pro Stunde
  message: 'Zu viele Einladungen. Bitte versuche es später erneut.',
});

const validateCodeLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 10, // 10 Validierungen pro 15 Minuten
  message: 'Zu viele Validierungsversuche. Bitte warte einen Moment.',
});

// Routes
router.post(
  '/create',
  checkRole(['DOM']),
  createInviteLimiter,
  validateRequest(createInvitationSchema),
  InvitationController.create
);

router.post(
  '/validate',
  validateCodeLimiter,
  validateRequest(validateInvitationSchema),
  InvitationController.validate
);

router.post(
  '/accept',
  checkRole(['SUB']),
  validateRequest(acceptInvitationSchema),
  InvitationController.accept
);

router.get(
  '/my',
  checkRole(['DOM']),
  InvitationController.listMyInvitations
);

export default router;
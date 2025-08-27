// backend/src/routes/privilegienRoutes.ts
import { Router } from 'express';
import { PrivilegienController } from '../controllers/privilegienController';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createPrivilegSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Titel ist erforderlich'),
    description: z.string().optional(),
    category: z.string().optional(),
    type: z.string().optional(),
    conditions: z.string().optional(),
    duration: z.string().optional(),
    pointsRequired: z.number().int().positive().optional().nullable(),
    level: z.number().int().min(1).max(5).optional().nullable(),
    canRevoke: z.boolean().optional(),
    autoExpires: z.boolean().optional(),
    expiresAfter: z.string().optional(),
    activeFromStage: z.number().int().positive().optional(),
    activeToStage: z.number().int().positive().optional().nullable(),
    grantedToId: z.string().optional(),
    stageId: z.string().optional()
  })
});

const updatePrivilegSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    type: z.string().optional(),
    conditions: z.string().optional(),
    duration: z.string().optional(),
    pointsRequired: z.number().int().positive().optional().nullable(),
    level: z.number().int().min(1).max(5).optional().nullable(),
    canRevoke: z.boolean().optional(),
    autoExpires: z.boolean().optional(),
    expiresAfter: z.string().optional(),
    activeFromStage: z.number().int().positive().optional(),
    activeToStage: z.number().int().positive().optional().nullable(),
    grantedToId: z.string().optional(),
    stageId: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

// Routes
router.get('/', authenticateToken, PrivilegienController.getAllPrivilegien);
router.get('/:id', authenticateToken, PrivilegienController.getPrivilegById);

router.post('/', 
  authenticateToken, 
  checkRole(['DOM', 'ADMIN']),
  validateRequest(createPrivilegSchema),
  PrivilegienController.createPrivileg
);

router.put('/:id', 
  authenticateToken, 
  checkRole(['DOM', 'ADMIN']),
  validateRequest(updatePrivilegSchema),
  PrivilegienController.updatePrivileg
);

router.delete('/:id', 
  authenticateToken, 
  checkRole(['DOM', 'ADMIN']),
  PrivilegienController.deletePrivileg
);

export default router;
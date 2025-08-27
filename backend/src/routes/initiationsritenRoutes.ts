// backend/src/routes/initiationsritenRoutes.ts
import { Router } from 'express';
import { InitiationsritenController } from '../controllers/initiationsritenController';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createInitiationsritenSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Titel ist erforderlich'),
    description: z.string().optional(),
    ritualType: z.string().optional(),
    markingType: z.string().optional(),
    bodyLocation: z.string().optional(),
    symbolism: z.string().optional(),
    actionSequence: z.string().optional(),
    symbolMeaning: z.string().optional(),
    repetitionSchedule: z.string().optional(),
    ceremonyLocation: z.string().optional(),
    participants: z.string().optional(),
    ceremonyDuration: z.string().optional(),
    ceremonyElements: z.string().optional(),
    behaviorDescription: z.string().optional(),
    behaviorDuration: z.string().optional(),
    behaviorFrequency: z.string().optional(),
    customDefinition: z.string().optional(),
    timing: z.string().optional(),
    documentation: z.string().optional(),
    requiresPreparation: z.boolean().optional(),
    requiresAftercare: z.boolean().optional(),
    preparationDetails: z.string().optional(),
    aftercareDetails: z.string().optional(),
    explicitConsent: z.boolean().default(false),
    hardLimits: z.string().optional(),
    exitClause: z.string().optional(),
    medicalConsiderations: z.string().optional(),
    reversibility: z.string().optional(),
    reversibilityDetails: z.string().optional(),
    activeFromStage: z.number().int().positive().optional(),
    activeToStage: z.number().int().positive().optional().nullable(),
    stageId: z.string().optional()
  })
});

const updateInitiationsritenSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    ritualType: z.string().optional(),
    markingType: z.string().optional(),
    bodyLocation: z.string().optional(),
    symbolism: z.string().optional(),
    actionSequence: z.string().optional(),
    symbolMeaning: z.string().optional(),
    repetitionSchedule: z.string().optional(),
    ceremonyLocation: z.string().optional(),
    participants: z.string().optional(),
    ceremonyDuration: z.string().optional(),
    ceremonyElements: z.string().optional(),
    behaviorDescription: z.string().optional(),
    behaviorDuration: z.string().optional(),
    behaviorFrequency: z.string().optional(),
    customDefinition: z.string().optional(),
    timing: z.string().optional(),
    documentation: z.string().optional(),
    requiresPreparation: z.boolean().optional(),
    requiresAftercare: z.boolean().optional(),
    preparationDetails: z.string().optional(),
    aftercareDetails: z.string().optional(),
    explicitConsent: z.boolean().optional(),
    hardLimits: z.string().optional(),
    exitClause: z.string().optional(),
    medicalConsiderations: z.string().optional(),
    reversibility: z.string().optional(),
    reversibilityDetails: z.string().optional(),
    activeFromStage: z.number().int().positive().optional(),
    activeToStage: z.number().int().positive().optional(),
    stageId: z.string().optional()
  })
});

// Routes
router.get('/', InitiationsritenController.getAllInitiationsriten);
router.get('/:id', InitiationsritenController.getInitiationsritenById);
router.post('/', checkRole(['DOM', 'ADMIN']), validateRequest(createInitiationsritenSchema), InitiationsritenController.createInitiationsriten);
router.put('/:id', checkRole(['DOM', 'ADMIN']), validateRequest(updateInitiationsritenSchema), InitiationsritenController.updateInitiationsriten);
router.delete('/:id', checkRole(['DOM', 'ADMIN']), InitiationsritenController.deleteInitiationsriten);

export default router;
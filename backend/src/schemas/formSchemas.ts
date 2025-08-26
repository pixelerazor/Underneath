/**
 * Form entity validation schemas
 * 
 * Zod schemas for validating form-related requests for all new entities.
 */

import { z } from 'zod';

// FAQ Schemas
export const createFAQSchema = z.object({
  body: z.object({
    question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
    answer: z.string().min(1, 'Answer is required').max(2000, 'Answer too long'),
    category: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    tags: z.array(z.string()).optional(),
    isPublic: z.boolean().default(true)
  })
});

export const updateFAQSchema = z.object({
  body: z.object({
    question: z.string().min(1, 'Question is required').max(500, 'Question too long').optional(),
    answer: z.string().min(1, 'Answer is required').max(2000, 'Answer too long').optional(),
    category: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    tags: z.array(z.string()).optional(),
    isPublic: z.boolean().optional()
  })
});

// Geist (Wellbeing) Schemas
export const createWellbeingSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().max(1000, 'Description too long').optional(),
    mood: z.number().int().min(1).max(10),
    energy: z.number().int().min(1).max(10),
    category: z.string().optional(),
    triggers: z.string().max(500, 'Triggers description too long').optional(),
    duration: z.string().optional(),
    notes: z.string().max(1000, 'Notes too long').optional()
  })
});

export const updateWellbeingSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    description: z.string().max(1000, 'Description too long').optional(),
    mood: z.number().int().min(1).max(10).optional(),
    energy: z.number().int().min(1).max(10).optional(),
    category: z.string().optional(),
    triggers: z.string().max(500, 'Triggers description too long').optional(),
    duration: z.string().optional(),
    notes: z.string().max(1000, 'Notes too long').optional()
  })
});

// Keuschheit (Chastity) Schemas
export const createChastitySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    type: z.string().min(1, 'Type is required'),
    duration: z.number().int().positive('Duration must be positive').optional(),
    device: z.string().max(200, 'Device description too long').optional(),
    description: z.string().max(1000, 'Description too long').optional(),
    intensity: z.number().int().min(1).max(10).optional(),
    satisfaction: z.number().int().min(1).max(10).optional(),
    wasPlanned: z.boolean().default(false),
    wasPermission: z.boolean().default(false),
    wasReward: z.boolean().default(false),
    wasPunishment: z.boolean().default(false),
    notes: z.string().max(1000, 'Notes too long').optional()
  })
});

// Neue Erkenntnisse (Insights) Schemas
export const createInsightSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    insight: z.string().min(1, 'Insight is required').max(2000, 'Insight too long'),
    context: z.string().max(1000, 'Context too long').optional(),
    category: z.string().optional(),
    importance: z.enum(['low', 'medium', 'high', 'breakthrough']).default('medium'),
    clarity: z.number().int().min(1).max(10).optional(),
    application: z.string().max(1000, 'Application too long').optional(),
    relatedTo: z.string().max(500, 'RelatedTo too long').optional()
  })
});

// Rückfall (Relapse) Schemas
export const createRelapseSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    type: z.string().optional(),
    severity: z.enum(['minor', 'medium', 'major', 'critical']).default('medium'),
    triggers: z.string().min(1, 'Triggers are required').max(1000, 'Triggers too long'),
    description: z.string().max(2000, 'Description too long').optional(),
    duration: z.string().max(200, 'Duration too long').optional(),
    pointsPenalty: z.number().int().optional(),
    emotions: z.string().max(500, 'Emotions too long').optional(),
    wasReported: z.boolean().default(false),
    wasIntentional: z.boolean().default(false),
    requiresAction: z.boolean().default(false),
    hasConsequences: z.boolean().default(false),
    prevention: z.string().max(1000, 'Prevention too long').optional(),
    lessons: z.string().max(1000, 'Lessons too long').optional()
  })
});

// Strafe (Punishment) Schemas
export const createPunishmentSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    reason: z.string().min(1, 'Reason is required').max(1000, 'Reason too long'),
    userId: z.string().uuid('Invalid user ID'),
    description: z.string().max(2000, 'Description too long').optional(),
    severity: z.enum(['light', 'medium', 'severe', 'extreme']),
    category: z.string().optional(),
    duration: z.string().max(200, 'Duration too long').optional(),
    intensity: z.number().int().min(1).max(10).optional(),
    tools: z.string().max(500, 'Tools description too long').optional(),
    isCompleted: z.boolean().default(false),
    wasEffective: z.boolean().default(false),
    wasConsensual: z.boolean().default(true),
    requiresFollowup: z.boolean().default(false),
    reaction: z.string().max(1000, 'Reaction too long').optional(),
    effectiveness: z.string().max(1000, 'Effectiveness too long').optional()
  })
});

// TPE Schemas
export const createTPESchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    type: z.string().optional(),
    description: z.string().max(2000, 'Description too long').optional(),
    duration: z.string().max(200, 'Duration too long').optional(),
    intensity: z.number().int().min(1).max(10).optional(),
    context: z.string().max(1000, 'Context too long').optional(),
    compliance: z.number().int().min(1).max(10).optional(),
    satisfaction: z.number().int().min(1).max(10).optional(),
    wasInitiated: z.boolean().default(false),
    wasSuccessful: z.boolean().default(true),
    hadResistance: z.boolean().default(false),
    requiresFollowup: z.boolean().default(false),
    emotions: z.string().max(500, 'Emotions too long').optional(),
    lessons: z.string().max(1000, 'Lessons too long').optional(),
    improvements: z.string().max(1000, 'Improvements too long').optional()
  })
});

// Trigger Schemas
export const createTriggerSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    type: z.string().optional(),
    description: z.string().max(2000, 'Description too long').optional(),
    intensity: z.number().int().min(1).max(10).optional(),
    frequency: z.string().optional(),
    response: z.string().max(1000, 'Response too long').optional(),
    context: z.string().max(1000, 'Context too long').optional(),
    emotions: z.string().max(500, 'Emotions too long').optional(),
    physicalReaction: z.string().max(500, 'Physical reaction too long').optional(),
    wasExpected: z.boolean().default(false),
    wasManaged: z.boolean().default(false),
    causedRelapse: z.boolean().default(false),
    isRecurring: z.boolean().default(false),
    copingStrategies: z.string().max(1000, 'Coping strategies too long').optional(),
    prevention: z.string().max(1000, 'Prevention too long').optional()
  })
});

// Allgemeine Informationen (General Information) Schemas
export const createInformationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
    category: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    isPublic: z.boolean().default(true),
    tags: z.array(z.string()).optional()
  })
});

export const updateInformationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    content: z.string().min(1, 'Content is required').max(5000, 'Content too long').optional(),
    category: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string()).optional()
  })
});

// Generic update schemas for entities that don't have specific update requirements
export const updateChastitySchema = createChastitySchema;
export const updateInsightSchema = createInsightSchema;
export const updateRelapseSchema = createRelapseSchema;
export const updatePunishmentSchema = createPunishmentSchema;
export const updateTPESchema = createTPESchema;
export const updateTriggerSchema = createTriggerSchema;
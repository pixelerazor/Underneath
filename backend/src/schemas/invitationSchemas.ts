// backend/src/schemas/invitationSchemas.ts
import { z } from 'zod';

export const createInvitationSchema = z.object({
  email: z
    .string()
    .email('Ungültige E-Mail-Adresse')
    .min(5, 'E-Mail-Adresse zu kurz')
    .max(255, 'E-Mail-Adresse zu lang'),
  message: z
    .string()
    .max(500, 'Nachricht darf maximal 500 Zeichen lang sein')
    .optional(),
});

export const validateInvitationSchema = z.object({
  code: z
    .string()
    .length(8, 'Einladungscode muss genau 8 Zeichen lang sein')
    .regex(/^[A-Z0-9]+$/, 'Code darf nur Großbuchstaben und Zahlen enthalten'),
});

export const acceptInvitationSchema = z.object({
  code: z
    .string()
    .length(8, 'Einladungscode muss genau 8 Zeichen lang sein')
    .regex(/^[A-Z0-9]+$/, 'Code darf nur Großbuchstaben und Zahlen enthalten'),
  userId: z.string().uuid('Ungültige User ID'),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type ValidateInvitationInput = z.infer<typeof validateInvitationSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
// backend/src/schemas/invitationSchemas.ts
import { z } from 'zod';

export const createInvitationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .transform((email) => email.trim() === '' ? `sub.${Date.now()}@invitation.local` : email)
      .pipe(z.string().email('Ungültige E-Mail-Adresse')),
    message: z
      .string()
      .max(500, 'Nachricht darf maximal 500 Zeichen lang sein')
      .optional(),
  }),
});

export const validateInvitationSchema = z.object({
  body: z.object({
    code: z
      .string()
      .length(8, 'Einladungscode muss genau 8 Zeichen lang sein')
      .regex(/^[A-Z0-9]+$/, 'Code darf nur Großbuchstaben und Zahlen enthalten'),
  }),
});

export const acceptInvitationSchema = z.object({
  body: z.object({
    code: z
      .string()
      .length(8, 'Einladungscode muss genau 8 Zeichen lang sein')
      .regex(/^[A-Z0-9]+$/, 'Code darf nur Großbuchstaben und Zahlen enthalten'),
  }),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type ValidateInvitationInput = z.infer<typeof validateInvitationSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
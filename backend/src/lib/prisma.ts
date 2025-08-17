// backend/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Verhindert, dass bei Hot-Reload mehrere Instanzen erzeugt werden (DEV)
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

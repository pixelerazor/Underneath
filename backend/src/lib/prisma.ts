import { PrismaClient } from '@prisma/client';

// Globale Variable für Prisma Client in Development
declare global {
  var prisma: PrismaClient | undefined;
}

// Singleton Pattern für Prisma Client
export const prisma = global.prisma || new PrismaClient();

// Speichere Client in globaler Variable im Development
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
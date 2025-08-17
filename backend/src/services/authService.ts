import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import type { User } from '@prisma/client';

// Validiere Environment Variablen
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined');
}

if (JWT_SECRET.length < 32 || JWT_REFRESH_SECRET.length < 32) {
  throw new Error('JWT secrets must be at least 32 characters long');
}

// Token Konfiguration
const ACCESS_TOKEN_EXPIRES_IN = '15m';  // 15 Minuten
const REFRESH_TOKEN_EXPIRES_IN = '7d';  // 7 Tage

interface TokenPayload {
  sub: string;
  role: string;
  type: 'access' | 'refresh';
}

/**
 * Generiert Access und Refresh Tokens für einen User
 */
export async function generateTokens(
  user: User,
  userAgent?: string,
  ipAddress?: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  // Access Token Payload
  const accessPayload: TokenPayload = {
    sub: user.id,
    role: user.role,
    type: 'access'
  };

  // Refresh Token Payload
  const refreshPayload: TokenPayload = {
    sub: user.id,
    role: user.role,
    type: 'refresh'
  };

  // Generiere Tokens
  const accessToken = jwt.sign(accessPayload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN
  });

  const refreshToken = jwt.sign(refreshPayload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });

  // Berechne Ablaufzeit für den Access Token
  const expiresIn = Math.floor(Date.now() / 1000) + 15 * 60; // 15 Minuten in Sekunden

  // Speichere Refresh Token in der Datenbank
  await createSession(user.id, refreshToken, userAgent, ipAddress);

  return {
    accessToken,
    refreshToken,
    expiresIn
  };
}

/**
 * Validiert einen Refresh Token und gibt den User zurück
 */
export async function validateRefreshToken(token: string): Promise<User | null> {
  try {
    // Verifiziere Token Signatur und Expiration
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;

    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Prüfe ob Session noch gültig ist
    const session = await prisma.session.findUnique({
      where: { refreshToken: token }
    });

    if (!session || new Date() > session.expiresAt) {
      return null;
    }

    // Hole User aus der Datenbank
    const user = await prisma.user.findUnique({
      where: { id: payload.sub }
    });

    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Erstellt eine neue Session für einen Refresh Token
 */
export async function createSession(
  userId: string,
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 Tage

  await prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt
    }
  });
}

/**
 * Invalidiert alle Sessions eines Users oder eine spezifische Session
 */
export async function invalidateSession(
  userId: string,
  refreshToken?: string
): Promise<void> {
  if (refreshToken) {
    // Lösche spezifische Session
    await prisma.session.delete({
      where: { refreshToken }
    });
  } else {
    // Lösche alle Sessions des Users
    await prisma.session.deleteMany({
      where: { userId }
    });
  }
}

/**
 * Erstellt einen Audit Log Eintrag für Auth Events
 */
async function createAuthAuditLog(
  userId: string,
  action: string,
  metadata?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity: 'AUTH',
      metadata,
      ipAddress,
      userAgent
    }
  });
}
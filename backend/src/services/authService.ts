import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function generateTokens(
  user: User,
  userAgent?: string | undefined,
  ipAddress?: string
) {
  // Access Token (kurzlebig - 15min)
  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  // Refresh Token (langlebig - 7 Tage)
  const refreshToken = jwt.sign(
    {
      userId: user.id,
      type: 'refresh'
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Speichere Refresh Token in der DB
  await prisma.userSession.create({
    data: {
      userId: user.id,
      refreshToken,
      userAgent: userAgent || 'unknown',
      ipAddress: ipAddress || 'unknown',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 Tage
    }
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 // 15 Minuten in Sekunden
  };
}

export async function validateRefreshToken(token: string): Promise<User | null> {
  try {
    // Verifiziere Token
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as {
      userId: string;
      type: string;
    };

    if (decoded.type !== 'refresh') {
      return null;
    }

    // Prüfe ob Token in DB existiert und gültig ist
    const session = await prisma.userSession.findFirst({
      where: {
        userId: decoded.userId,
        refreshToken: token,
        expiresAt: {
          gt: new Date()
        },
        revokedAt: null
      }
    });

    if (!session) {
      return null;
    }

    // Hole User
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function invalidateSession(
  userId: string,
  refreshToken?: string
): Promise<void> {
  const where = refreshToken
    ? { userId, refreshToken }
    : { userId, revokedAt: null };

  await prisma.userSession.updateMany({
    where,
    data: {
      revokedAt: new Date()
    }
  });
}
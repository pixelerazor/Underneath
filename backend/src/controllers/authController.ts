import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import * as authService from '../services/authService';
import { UserRole, UserStatus } from '@prisma/client';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['DOM', 'SUB', 'OBSERVER'], {
    errorMap: () => ({ message: 'Invalid role. Must be DOM, SUB, or OBSERVER' })
  })
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export async function register(req: Request, res: Response) {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        passwordHash,
        role: validatedData.role as UserRole,
        status: UserStatus.ACTIVE
      }
    });

    const { accessToken, refreshToken, expiresIn } = await authService.generateTokens(
      user,
      req.headers['user-agent'],
      req.ip
    );

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        entity: 'AUTH',
        entityId: user.id,
        metadata: {
          email: user.email,
          role: user.role,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip
        }
      }
    });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status
        },
        accessToken,
        refreshToken,
        expiresIn
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const validatedData = loginSchema.parse(req.body);

    return passport.authenticate('local', { session: false }, async (err: any, user: any, info: any) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({
          success: false,
          error: 'Internal server error during login'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          error: info?.message || 'Authentication failed'
        });
      }

      const { accessToken, refreshToken, expiresIn } = await authService.generateTokens(
        user,
        req.headers['user-agent'],
        req.ip
      );

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          entity: 'AUTH',
          entityId: user.id,
          metadata: {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip
          }
        }
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status
          },
          accessToken,
          refreshToken,
          expiresIn
        }
      });
    })(req, res);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const validatedData = refreshSchema.parse(req.body);

    const user = await authService.validateRefreshToken(validatedData.refreshToken);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    const { accessToken, refreshToken, expiresIn } = await authService.generateTokens(
      user,
      req.headers['user-agent'],
      req.ip
    );

    await authService.invalidateSession(user.id, validatedData.refreshToken);

    return res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Token refresh error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during token refresh'
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.body.refreshToken;
    const userId = (req.user as any).id;

    if (refreshToken) {
      await authService.invalidateSession(userId, refreshToken);
    } else {
      await authService.invalidateSession(userId);
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'USER_LOGOUT',
        entity: 'AUTH',
        entityId: userId,
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip
        }
      }
    });

    return res.json({
      success: true,
      message: 'Successfully logged out'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during logout'
    });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while fetching user data'
    });
  }
}
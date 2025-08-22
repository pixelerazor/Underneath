import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Register new user
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, confirmPassword, role } = req.body;

    // Validation
    if (!email || !password || !confirmPassword || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      { expiresIn: '30d' }
    );

    // Save refresh token in database
    await prisma.session.create({
      data: {
        refreshToken, // Korrigiert von 'token' zu 'refreshToken'
        userId: user.userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });

    return res.status(201).json({
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      { expiresIn: '30d' }
    );

    // Update or create session
    const existingSession = await prisma.session.findFirst({
      where: { userId: user.userId }
    });

    if (existingSession) {
      await prisma.session.update({
        where: { id: existingSession.id }, // Korrigiert: Verwende id statt userId
        data: {
          refreshToken, // Korrigiert von 'token' zu 'refreshToken'
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    } else {
      await prisma.session.create({
        data: {
          refreshToken, // Korrigiert von 'token' zu 'refreshToken'
          userId: user.userId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    return res.json({
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    // Verify refresh token
    let _decoded: any;
    try {
      _decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret');
    } catch (error) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { refreshToken }, // Korrigiert von 'token' zu 'refreshToken'
      include: { user: true }
    });

    if (!session) {
      return res.status(401).json({ error: 'Session not found' });
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: { id: session.id }
      });
      return res.status(401).json({ error: 'Session expired' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { 
        userId: session.user.userId, // Korrigiert: Verwende userId statt id
        email: session.user.email, 
        role: session.user.role 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '15m' }
    );

    return res.json({ accessToken });

  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Delete session
    const session = await prisma.session.findUnique({
      where: { refreshToken } // Korrigiert von 'token' zu 'refreshToken'
    });

    if (session) {
      await prisma.session.delete({
        where: { id: session.id }
      });
    }

    return res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = (req as any).user?.userId; // Assuming middleware sets user

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { userId },
      data: { password: hashedPassword }
    });

    // Invalidate all sessions (optional - forces re-login)
    await prisma.session.deleteMany({
      where: { userId }
    });

    return res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user?.userId; // Korrigiert: Verwende userId statt id

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });

  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
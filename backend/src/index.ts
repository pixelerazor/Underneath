import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/authRoutes';
import invitationRoutes from './routes/invitationRoutes';
import connectionRoutes from './routes/connectionRoutes';
import { profileRoutes } from './routes/profile';
import stagesRoutes from './routes/stagesRoutes';
import tasksRoutes from './routes/tasksRoutes';
import rulesRoutes from './routes/rulesRoutes';
import initiationsritenRoutes from './routes/initiationsritenRoutes';
import privilegienRoutes from './routes/privilegienRoutes';
import strafenRoutes from './routes/strafenRoutes';
import tpeRoutes from './routes/tpeRoutes';

// Import middleware for protected routes
import { authenticateToken } from './middleware/auth';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Prisma
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enhanced CORS configuration with debugging
app.use(cors({
  origin: function (origin, callback) {
    // Log all origins for debugging
    console.log('🔍 CORS Origin Check:', { origin, expected: process.env.FRONTEND_URL || 'http://localhost:5174' });
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5174',
      'http://localhost:5173', // Fallback for development
      'http://localhost:5175', // Additional dev port
    ];
    
    // Allow no origin (for non-browser requests like curl/Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS Origin blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced request logging for development
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    
    // Log auth headers for debugging
    if (req.path.includes('/api/stages')) {
      console.log('🔍 Stages Request Debug:', {
        origin: req.headers.origin,
        authorization: req.headers.authorization ? 'Bearer [TOKEN]' : 'NO_TOKEN',
        userAgent: req.headers['user-agent']?.substring(0, 50) + '...'
      });
    }
    
    next();
  });
}

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Debug endpoint for authentication issues
app.get('/api/debug/auth', (req: Request, res: Response) => {
  res.json({
    headers: {
      authorization: req.headers.authorization ? 'Present' : 'Missing',
      origin: req.headers.origin || 'Not set'
    },
    user: req.user || null,
    authenticated: !!req.user
  });
});

// Temporary stages endpoint without auth for debugging
app.get('/api/debug/stages-no-auth', async (_req: Request, res: Response) => {
  try {
    const { prisma } = require('./lib/prisma');
    const stages = await prisma.stage.findMany({
      where: { isActive: true },
      orderBy: { stageNumber: 'asc' },
      include: {
        _count: {
          select: {
            Task: true,
            Rule: true,
            Goal: true,
            Initiationsriten: true,
            StageProgression: true,
            Privileg: true,
            Strafe: true,
            TPEEintrag: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: stages,
      message: 'Stages loaded without authentication for debugging'
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/invitations', authenticateToken, invitationRoutes);
app.use('/api/connections', authenticateToken, connectionRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stages', authenticateToken, stagesRoutes);
app.use('/api/tasks', authenticateToken, tasksRoutes);
app.use('/api/rules', authenticateToken, rulesRoutes);
app.use('/api/initiationsriten', authenticateToken, initiationsritenRoutes);
app.use('/api/privilegien', authenticateToken, privilegienRoutes);
app.use('/api/strafen', authenticateToken, strafenRoutes);
app.use('/api/tpe', authenticateToken, tpeRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  // Prisma errors
  if (err.code === 'P2002') {
    res.status(400).json({ error: 'A record with this value already exists' });
    return;
  }
  
  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Record not found' });
    return;
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Token expired' });
    return;
  }
  
  // Default error
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`🔑 JWT Secret configured: ${!!process.env.JWT_SECRET}`);
      console.log(`🔄 Refresh Secret configured: ${!!process.env.JWT_REFRESH_SECRET}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { auth } from './middleware/auth';
import invitationRoutes from './routes/invitationRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();

// Basis-Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Globales Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // 100 Requests pro IP
}));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/invitations', auth, invitationRoutes);

// Error Handling
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server läuft auf Port ${port}`);
});

export default app;
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import { configurePassport } from './config/passport';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Passport
configurePassport(passport);
app.use(passport.initialize());

// Register routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.get('/api', (_req, res) => {
  res.json({ message: 'Underneath API is running!' });
});

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('Frontend URL: ' + process.env.FRONTEND_URL);
  console.log('Environment: ' + process.env.NODE_ENV);
});

// Import invitation routes (uncomment when file exists)
// import invitationRoutes from './routes/invitationRoutes';
// import { auth } from './middleware/auth';

// Add invitation routes (uncomment when ready)
// app.use('/api/invitations', auth, invitationRoutes);

console.log('Invitation system ready to be integrated!');

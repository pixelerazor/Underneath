/**
 * Profile Routes
 * 
 * API endpoints for user profile management and onboarding.
 * All routes require authentication.
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Rate limiting for profile operations
const profileRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    success: false,
    error: 'Too many profile requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting and authentication to all routes
router.use(profileRateLimit);
router.use(authenticateToken);

/**
 * @route GET /api/profile
 * @desc Get current user's profile
 * @access Private
 */
router.get('/', ProfileController.getProfile);

/**
 * @route PUT /api/profile
 * @desc Update user profile (partial updates allowed)
 * @access Private
 * @body ProfileCompletionData
 */
router.put('/', ProfileController.updateProfile);

/**
 * @route GET /api/profile/progress
 * @desc Get profile completion progress
 * @access Private
 */
router.get('/progress', ProfileController.getProgress);

/**
 * @route POST /api/profile/complete
 * @desc Attempt to mark profile as completed
 * @access Private
 */
router.post('/complete', ProfileController.completeProfile);

/**
 * @route GET /api/profile/template/:role
 * @desc Get profile template for role (admin only or own role)
 * @access Private
 * @param role - DOM, SUB, or OBSERVER
 */
router.get('/template/:role', ProfileController.getTemplate);

export { router as profileRoutes };
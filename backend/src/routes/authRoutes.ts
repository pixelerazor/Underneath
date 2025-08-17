import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';

const authRoutes = Router();

const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
authRoutes.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get tokens
 * @access  Public
 */
authRoutes.post('/login', authController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Get new access token using refresh token
 * @access  Public
 */
authRoutes.post('/refresh', authController.refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user & invalidate tokens
 * @access  Private
 */
authRoutes.post('/logout', requireAuth, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user data
 * @access  Private
 */
authRoutes.get('/me', requireAuth, authController.me);

export default authRoutes;

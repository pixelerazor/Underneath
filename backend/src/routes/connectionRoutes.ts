/**
 * Connection Routes
 * 
 * Defines API endpoints for connection management functionality.
 * All routes require authentication and appropriate role validation.
 * 
 * @module ConnectionRoutes
 * @author Underneath Team
 * @version 1.0.0
 */

import { Router } from 'express';
import { ConnectionController } from '../controllers/connectionController';

const router = Router();

/**
 * @route GET /api/connections/my-connection
 * @description Get current connection for authenticated user
 * @access Private (DOM/SUB)
 */
router.get('/my-connection', ConnectionController.getMyConnection);

/**
 * @route POST /api/connections/terminate
 * @description Terminate user's current connection
 * @access Private (DOM/SUB)
 */
router.post('/terminate', ConnectionController.terminateMyConnection);

/**
 * @route GET /api/connections/availability
 * @description Check if user can create new connections
 * @access Private (DOM/SUB)
 */
router.get('/availability', ConnectionController.checkConnectionAvailability);

/**
 * @route GET /api/connections/admin/all
 * @description Get all connections (pagination supported)
 * @access Private (ADMIN only)
 */
router.get('/admin/all', ConnectionController.getAllConnections);

/**
 * @route POST /api/connections/admin/:connectionId/terminate
 * @description Terminate specific connection by admin
 * @access Private (ADMIN only)
 */
router.post('/admin/:connectionId/terminate', ConnectionController.adminTerminateConnection);

export default router;
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { AllgemeineInformationenController } from '../controllers/allgemeineInformationenController';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/', AllgemeineInformationenController.getAllInformation);
router.get('/:id', AllgemeineInformationenController.getInformationById);

// Protected routes (DOM/ADMIN only for creation)
router.post('/', checkRole(['DOM', 'ADMIN']), AllgemeineInformationenController.createInformation);
router.put('/:id', AllgemeineInformationenController.updateInformation); // Permission check in controller
router.delete('/:id', AllgemeineInformationenController.deleteInformation); // Permission check in controller

export default router;

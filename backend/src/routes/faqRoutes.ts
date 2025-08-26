import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { FaqController } from '../controllers/faqController';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/', FaqController.getAllFAQs);
router.get('/search', FaqController.searchFAQs);
router.get('/:id', FaqController.getFAQById);

// Protected routes (DOM/ADMIN only for creation)
router.post('/', checkRole(['DOM', 'ADMIN']), FaqController.createFAQ);
router.put('/:id', FaqController.updateFAQ); // Permission check in controller
router.delete('/:id', FaqController.deleteFAQ); // Permission check in controller

export default router;
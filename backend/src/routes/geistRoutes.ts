import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { GeistController } from '../controllers/geistController';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// All routes are user-specific, no additional role restrictions needed
router.get('/', GeistController.getAllWellbeingEntries);
router.get('/statistics', GeistController.getWellbeingStatistics);
router.get('/:id', GeistController.getWellbeingEntryById);
router.post('/', GeistController.createWellbeingEntry);
router.put('/:id', GeistController.updateWellbeingEntry);
router.delete('/:id', GeistController.deleteWellbeingEntry);

export default router;

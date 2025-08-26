import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { ErkenntnisseController } from '../controllers/erkenntnisseController';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', ErkenntnisseController.getAllInsightEntries);
router.get('/:id', ErkenntnisseController.getInsightEntryById);
router.post('/', ErkenntnisseController.createInsightEntry);
router.put('/:id', ErkenntnisseController.updateInsightEntry);
router.delete('/:id', ErkenntnisseController.deleteInsightEntry);

export default router;

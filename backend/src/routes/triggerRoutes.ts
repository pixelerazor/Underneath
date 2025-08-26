import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { TriggerController } from '../controllers/triggerController';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', TriggerController.getAllTriggers);
router.get('/:id', TriggerController.getTriggerById);
router.post('/', TriggerController.createTrigger);
router.put('/:id', TriggerController.updateTrigger);
router.delete('/:id', TriggerController.deleteTrigger);

export default router;

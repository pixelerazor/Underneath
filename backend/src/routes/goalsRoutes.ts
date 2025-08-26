import express from 'express';
import { goalsController } from '../controllers/goalsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Goal routes
router.post('/', goalsController.createGoal);
router.get('/', goalsController.getAllGoals);
router.get('/:id', goalsController.getGoalById);
router.put('/:id', goalsController.updateGoal);
router.delete('/:id', goalsController.deleteGoal);

export default router;
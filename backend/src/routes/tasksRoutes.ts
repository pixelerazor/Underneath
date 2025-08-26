import express from 'express';
import { tasksController } from '../controllers/tasksController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Task routes
router.post('/', tasksController.createTask);
router.get('/', tasksController.getAllTasks);
router.get('/:id', tasksController.getTaskById);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

export default router;
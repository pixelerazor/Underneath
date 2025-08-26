import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { StrafenController } from '../controllers/strafenController';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', StrafenController.getAllPunishments);
router.get('/:id', StrafenController.getPunishmentById);
router.post('/', checkRole(['DOM', 'ADMIN']), StrafenController.createPunishment);
router.put('/:id', StrafenController.updatePunishment); // Permission check in controller
router.delete('/:id', StrafenController.deletePunishment); // Permission check in controller

export default router;

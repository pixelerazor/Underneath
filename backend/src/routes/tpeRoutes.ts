import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { TpeController } from '../controllers/tpeController';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', TpeController.getAllTPEEntries);
router.get('/:id', TpeController.getTPEEntryById);
router.post('/', TpeController.createTPEEntry);
router.put('/:id', TpeController.updateTPEEntry);
router.delete('/:id', TpeController.deleteTPEEntry);

export default router;

import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { KeuschheitController } from '../controllers/keuschheitController';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', KeuschheitController.getAllChastityEntries);
router.get('/:id', KeuschheitController.getChastityEntryById);
router.post('/', KeuschheitController.createChastityEntry);
router.put('/:id', KeuschheitController.updateChastityEntry);
router.delete('/:id', KeuschheitController.deleteChastityEntry);

export default router;

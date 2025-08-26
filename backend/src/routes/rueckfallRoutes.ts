import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { RueckfallController } from '../controllers/rueckfallController';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', RueckfallController.getAllRelapseEntries);
router.get('/:id', RueckfallController.getRelapseEntryById);
router.post('/', RueckfallController.createRelapseEntry);
router.put('/:id', RueckfallController.updateRelapseEntry);
router.delete('/:id', RueckfallController.deleteRelapseEntry);

export default router;

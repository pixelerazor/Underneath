// backend/src/routes/stagesRoutes.ts
import { Router } from 'express';
import { StagesController } from '../controllers/stagesController';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = Router();

router.use(authenticateToken);

router.get('/', StagesController.getAllStages);

router.get('/statistics', checkRole(['DOM', 'ADMIN']), StagesController.getStageStatistics);

router.get('/pending-progressions', checkRole(['DOM', 'ADMIN']), StagesController.getPendingProgressions);

router.get('/entities', StagesController.getActiveEntities);

router.get('/user/:userId/current', StagesController.getUserCurrentStage);

router.get('/user/:userId/history', StagesController.getStageProgressionHistory);

router.get('/:stageId', StagesController.getStageById);

router.get('/number/:stageNumber', StagesController.getStageByNumber);

router.post('/', checkRole(['DOM', 'ADMIN']), StagesController.createStage);

router.post('/initialize-defaults', checkRole(['ADMIN']), StagesController.initializeDefaultStages);

router.post('/progressions/:progressionId/confirm', checkRole(['DOM']), StagesController.confirmStageProgression);

router.put('/:stageId', checkRole(['ADMIN']), StagesController.updateStage);

router.patch('/:stageId/toggle-status', checkRole(['ADMIN']), StagesController.toggleStageStatus);

router.delete('/:stageId', checkRole(['ADMIN']), StagesController.deleteStage);

export default router;
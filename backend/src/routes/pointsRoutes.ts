// backend/src/routes/pointsRoutes.ts
import { Router } from 'express';
import { PointsController } from '../controllers/pointsController';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = Router();

router.use(authenticateToken);

router.get('/summary', PointsController.getPointSummary);

router.get('/history', PointsController.getPointHistory);

router.get('/current-stage', PointsController.getCurrentStage);

router.get('/leaderboard', PointsController.getLeaderboard);

router.get('/statistics', PointsController.getStatistics);

router.get('/thresholds', PointsController.getStageThresholds);

router.get('/user/:userId', PointsController.getUserPoints);

router.post('/add', checkRole(['DOM']), PointsController.addPoints);

router.post('/deduct', checkRole(['DOM']), PointsController.deductPoints);

router.post('/bulk-add', checkRole(['DOM']), PointsController.bulkAddPoints);

router.put('/thresholds', checkRole(['ADMIN']), PointsController.updateStageThresholds);

export default router;
// backend/src/routes/rulesRoutes.ts
import { Router } from 'express';
import { RulesController } from '../controllers/rulesController';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = Router();

router.use(authenticateToken);

// GET all rules for current user/context
router.get('/', RulesController.getAllRules);

// GET rule by ID
router.get('/:ruleId', RulesController.getRuleById);

// POST create new rule
router.post('/', checkRole(['DOM', 'ADMIN']), RulesController.createRule);

// PUT update rule
router.put('/:ruleId', checkRole(['DOM', 'ADMIN']), RulesController.updateRule);

// DELETE rule
router.delete('/:ruleId', checkRole(['DOM', 'ADMIN']), RulesController.deleteRule);

export default router;
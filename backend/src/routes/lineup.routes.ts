import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createLineup,
  getLineups,
  getLineupById,
  updateLineup,
  deleteLineup
} from '../controllers/lineup.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('coach', 'admin'));

router.post('/', createLineup);
router.get('/', getLineups);
router.get('/:id', getLineupById);
router.put('/:id', updateLineup);
router.delete('/:id', deleteLineup);

export default router;

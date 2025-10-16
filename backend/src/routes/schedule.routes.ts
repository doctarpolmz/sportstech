import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule
} from '../controllers/schedule.controller';

const router = Router();

router.use(authenticate);

router.post('/', createSchedule);
router.get('/', getSchedules);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;

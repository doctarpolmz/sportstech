import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getDashboardStats, getPerformanceHistory } from '../controllers/dashboard.controller';

const router = Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/performance-history', getPerformanceHistory);

export default router;

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getAthletes,
  addAthlete,
  removeAthlete,
  addNote,
  getNotes,
  getAthleteVideos
} from '../controllers/coach.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('coach', 'admin'));

router.get('/athletes', getAthletes);
router.post('/athletes', addAthlete);
router.delete('/athletes/:athleteId', removeAthlete);
router.post('/notes', addNote);
router.get('/notes/:athleteId', getNotes);
router.get('/athletes/:athleteId/videos', getAthleteVideos);

export default router;

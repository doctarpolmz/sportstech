import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadVideo } from '../middleware/upload.middleware';
import {
  uploadVideoFile,
  getVideos,
  getVideoById,
  analyzeVideoById,
  deleteVideo
} from '../controllers/video.controller';

const router = Router();

router.post('/upload', authenticate, uploadVideo.single('video'), uploadVideoFile);
router.get('/', authenticate, getVideos);
router.get('/:id', authenticate, getVideoById);
router.post('/:id/analyze', authenticate, analyzeVideoById);
router.delete('/:id', authenticate, deleteVideo);

export default router;

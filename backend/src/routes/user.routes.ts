import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadPhoto } from '../middleware/upload.middleware';
import { updateProfile, uploadProfilePhoto } from '../controllers/user.controller';

const router = Router();

router.put('/profile', authenticate, updateProfile);
router.post('/profile/photo', authenticate, uploadPhoto.single('photo'), uploadProfilePhoto);

export default router;

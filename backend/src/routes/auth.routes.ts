import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('role').isIn(['athlete', 'coach'])
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  login
);

router.get('/verify-email/:token', verifyEmail);

router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 })
  ],
  resetPassword
);

router.get('/profile', authenticate, getProfile);

export default router;

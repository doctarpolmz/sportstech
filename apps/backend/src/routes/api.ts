import { Router } from 'express';
import auth from './auth.js';
import users from './users.js';
import videos from './videos.js';
import chat from './chat.js';
import schedule from './schedule.js';
import lineup from './lineup.js';

export const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/videos', videos);
router.use('/chat', chat);
router.use('/schedule', schedule);
router.use('/lineup', lineup);

router.get('/', (_req, res) => {
  res.json({ name: 'SportsTech AI API', version: '0.1.0' });
});

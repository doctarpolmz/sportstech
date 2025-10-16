import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getConversations,
  getMessages,
  markAsRead
} from '../controllers/message.controller';

const router = Router();

router.use(authenticate);

router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.put('/:messageId/read', markAsRead);

export default router;

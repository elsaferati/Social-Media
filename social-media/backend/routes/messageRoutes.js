import express from 'express';
import {
  getMessages,
  sendMessage,
  deleteMessage,
  getConversations
} from '../controllers/messageController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Message routes
router.get('/', getMessages);
router.post('/', sendMessage);
router.delete('/:id', optionalAuth, deleteMessage);

// Conversation routes
router.get('/conversations/:userId', getConversations);

export default router;

import express from 'express';
import {
  getMessages,
  sendMessage,
  deleteMessage,
  getConversations,
  uploadMessageImage
} from '../controllers/messageController.js';
import { optionalAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Message routes
router.get('/', getMessages);
router.post('/upload', upload.single('image'), uploadMessageImage);
router.post('/', sendMessage);
router.delete('/:id', optionalAuth, deleteMessage);

// Conversation routes
router.get('/conversations/:userId', getConversations);

export default router;

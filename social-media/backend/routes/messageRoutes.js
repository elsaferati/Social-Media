import express from 'express';
import {
  getMessages,
  sendMessage,
  deleteMessage,
  updateMessage,
  getConversations,
  uploadMessageImage
} from '../controllers/messageController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Message routes
router.get('/', getMessages);
router.post('/upload', upload.single('image'), uploadMessageImage);
router.post('/', sendMessage);
router.put('/:id', authenticateToken, updateMessage);
router.delete('/:id', authenticateToken, deleteMessage);

// Conversation routes
router.get('/conversations/:userId', getConversations);

export default router;

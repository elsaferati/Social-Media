import express from 'express';
import {
  getHighlights,
  getHighlightStories,
  createHighlight,
  deleteHighlight,
} from '../controllers/highlightController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/highlights/:highlightId/stories - stories in a highlight (public)
router.get('/:highlightId/stories', getHighlightStories);

// GET /api/highlights/user/:userId - list highlights for user (public)
router.get('/user/:userId', getHighlights);

// POST /api/highlights - create highlight (auth)
router.post('/', authenticateToken, createHighlight);

// DELETE /api/highlights/:id - delete highlight (auth)
router.delete('/:id', authenticateToken, deleteHighlight);

export default router;

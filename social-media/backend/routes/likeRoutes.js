import express from 'express';
import { getLikes, getLikers, toggleLike } from '../controllers/postController.js';

const router = express.Router();

// GET /api/likes/post/:postId/likers (who liked - with user info)
router.get('/post/:postId/likers', getLikers);

// GET /api/likes?postId=123 (user IDs only, for count/current-user check)
router.get('/', getLikes);

// POST /api/likes
router.post('/', toggleLike);

export default router;

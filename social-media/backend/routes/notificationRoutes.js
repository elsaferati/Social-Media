import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// Notification routes
router.get('/', getNotifications);
router.put('/read/:id', markAsRead);
router.put('/read-all/:userId', markAllAsRead);
router.get('/unread/:userId', getUnreadCount);
router.delete('/:id', deleteNotification);

export default router;

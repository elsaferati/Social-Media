import db from '../config/db.js';

const Notification = {
  // Get notifications for a user
  getByUserId: async (userId) => {
    const [rows] = await db.query(
      `SELECT n.*, u.username, u.profilePic 
       FROM notifications n
       JOIN users u ON n.senderUserId = u.id
       WHERE n.receiverUserId = ?
       ORDER BY n.createdAt DESC`,
      [userId]
    );
    return rows;
  },

  // Get single notification
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM notifications WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Create notification
  create: async ({ receiverUserId, senderUserId, type, postId = null }) => {
    const [result] = await db.query(
      'INSERT INTO notifications (receiverUserId, senderUserId, type, postId) VALUES (?, ?, ?, ?)',
      [receiverUserId, senderUserId, type, postId]
    );
    return result.insertId;
  },

  // Create like notification
  createLikeNotification: async (receiverUserId, senderUserId, postId) => {
    // Don't notify if liking own post
    if (receiverUserId === senderUserId) return null;
    return Notification.create({
      receiverUserId,
      senderUserId,
      type: 'like',
      postId
    });
  },

  // Create follow notification
  createFollowNotification: async (receiverUserId, senderUserId) => {
    return Notification.create({
      receiverUserId,
      senderUserId,
      type: 'follow'
    });
  },

  // Create comment notification
  createCommentNotification: async (receiverUserId, senderUserId, postId) => {
    // Don't notify if commenting on own post
    if (receiverUserId === senderUserId) return null;
    return Notification.create({
      receiverUserId,
      senderUserId,
      type: 'comment',
      postId
    });
  },

  // Mark as read
  markAsRead: async (id) => {
    await db.query('UPDATE notifications SET `isRead` = 1 WHERE id = ?', [id]);
  },

  // Mark all as read for a user
  markAllAsRead: async (userId) => {
    await db.query('UPDATE notifications SET `isRead` = 1 WHERE receiverUserId = ?', [userId]);
  },

  // Delete notification
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM notifications WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Get unread count
  getUnreadCount: async (userId) => {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE receiverUserId = ? AND `isRead` = 0',
      [userId]
    );
    return rows[0].count;
  },

  // Get total count
  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM notifications');
    return rows[0].count;
  }
};

export default Notification;

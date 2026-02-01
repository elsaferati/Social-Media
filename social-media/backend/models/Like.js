import db from '../config/db.js';

const Like = {
  // Get likes for a post (user IDs only)
  getByPostId: async (postId) => {
    const [rows] = await db.query(
      'SELECT userId FROM likes WHERE postId = ?',
      [postId]
    );
    return rows.map(row => row.userId);
  },

  // Get likers with user info (id, username, profilePic) for "who liked" list
  getLikersWithUser: async (postId) => {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.profilePic 
       FROM likes l 
       JOIN users u ON l.userId = u.id 
       WHERE l.postId = ?
       ORDER BY l.userId ASC`,
      [postId]
    );
    return rows;
  },

  // Check if user liked a post
  exists: async (userId, postId) => {
    const [rows] = await db.query(
      'SELECT * FROM likes WHERE userId = ? AND postId = ?',
      [userId, postId]
    );
    return rows.length > 0;
  },

  // Create like
  create: async (userId, postId) => {
    await db.query(
      'INSERT INTO likes (userId, postId) VALUES (?, ?)',
      [userId, postId]
    );
  },

  // Delete like
  delete: async (userId, postId) => {
    await db.query(
      'DELETE FROM likes WHERE userId = ? AND postId = ?',
      [userId, postId]
    );
  },

  // Toggle like (returns true if liked, false if unliked)
  toggle: async (userId, postId) => {
    const exists = await Like.exists(userId, postId);
    if (exists) {
      await Like.delete(userId, postId);
      return false;
    } else {
      await Like.create(userId, postId);
      return true;
    }
  },

  // Get count for a post
  countByPost: async (postId) => {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM likes WHERE postId = ?',
      [postId]
    );
    return rows[0].count;
  },

  // Get total count
  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM likes');
    return rows[0].count;
  }
};

export default Like;

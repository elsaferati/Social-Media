import db from '../config/db.js';

const Bookmark = {
  // Check if user bookmarked a post
  exists: async (userId, postId) => {
    const [rows] = await db.query(
      'SELECT * FROM bookmarks WHERE userId = ? AND postId = ?',
      [userId, postId]
    );
    return rows.length > 0;
  },

  // Create bookmark
  create: async (userId, postId) => {
    await db.query(
      'INSERT INTO bookmarks (userId, postId) VALUES (?, ?)',
      [userId, postId]
    );
  },

  // Delete bookmark
  delete: async (userId, postId) => {
    await db.query(
      'DELETE FROM bookmarks WHERE userId = ? AND postId = ?',
      [userId, postId]
    );
  },

  // Toggle bookmark (returns true if bookmarked, false if removed)
  toggle: async (userId, postId) => {
    const exists = await Bookmark.exists(userId, postId);
    if (exists) {
      await Bookmark.delete(userId, postId);
      return false;
    } else {
      await Bookmark.create(userId, postId);
      return true;
    }
  },

  // Get all bookmarks for a user
  getByUserId: async (userId) => {
    const [rows] = await db.query(
      'SELECT postId FROM bookmarks WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    return rows.map(row => row.postId);
  },

  // Get count for a user
  countByUser: async (userId) => {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM bookmarks WHERE userId = ?',
      [userId]
    );
    return rows[0].count;
  }
};

export default Bookmark;

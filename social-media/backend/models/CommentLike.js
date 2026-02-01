import db from '../config/db.js';

const CommentLike = {
  create: async (userId, commentId) => {
    await db.query(
      'INSERT INTO comment_likes (userId, commentId) VALUES (?, ?)',
      [userId, commentId]
    );
  },

  delete: async (userId, commentId) => {
    await db.query(
      'DELETE FROM comment_likes WHERE userId = ? AND commentId = ?',
      [userId, commentId]
    );
  },

  exists: async (userId, commentId) => {
    const [rows] = await db.query(
      'SELECT 1 FROM comment_likes WHERE userId = ? AND commentId = ?',
      [userId, commentId]
    );
    return rows.length > 0;
  },

  toggle: async (userId, commentId) => {
    const has = await CommentLike.exists(userId, commentId);
    if (has) {
      await CommentLike.delete(userId, commentId);
      return false;
    }
    await CommentLike.create(userId, commentId);
    return true;
  },

  countByComment: async (commentId) => {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS count FROM comment_likes WHERE commentId = ?',
      [commentId]
    );
    return rows[0]?.count ?? 0;
  }
};

export default CommentLike;

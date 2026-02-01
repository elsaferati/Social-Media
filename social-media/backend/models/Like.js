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
  },

  // Admin: get all likes (paginated, with user and post info)
  getAllAdmin: async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    const searchCond = search
      ? `AND (u.username LIKE ? OR p.content LIKE ?)`
      : '';
    const searchArg = search ? [`%${search}%`, `%${search}%`] : [];
    // Use l.* and ORDER BY l.id so we don't depend on createdAt column name (MySQL casing)
    const [rows] = await db.query(
      `SELECT l.*, u.username,
              LEFT(p.content, 80) AS postContent
       FROM likes l
       JOIN users u ON l.userId = u.id
       JOIN posts p ON l.postId = p.id
       WHERE 1=1 ${searchCond}
       ORDER BY l.id DESC
       LIMIT ? OFFSET ?`,
      [...searchArg, limit, offset]
    );
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM likes l
       JOIN users u ON l.userId = u.id
       JOIN posts p ON l.postId = p.id
       WHERE 1=1 ${searchCond}`,
      searchArg
    );
    const total = Number(countRows[0]?.total ?? countRows[0]?.Total ?? 0);
    // Normalize createdAt from l.* (MySQL may return different casing: createdAt, created_at, createdat, etc.)
    const likes = rows.map((r) => {
      const createdAt =
        r.createdAt ?? r.created_at ?? r.createdat ?? r.CreatedAt ?? r.Created_At ?? null;
      return { ...r, createdAt };
    });
    return { likes, total, totalPages: Math.ceil(total / limit) || 1 };
  },

  // Find like by id (admin)
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM likes WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Delete like by id (admin)
  deleteById: async (id) => {
    await db.query('DELETE FROM likes WHERE id = ?', [id]);
  }
};

export default Like;

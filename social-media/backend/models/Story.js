import db from '../config/db.js';

const Story = {
  // Find story by ID
  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT s.*, u.username, u.profilePic 
       FROM stories s 
       JOIN users u ON s.userId = u.id 
       WHERE s.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Get all stories (for admin)
  getAll: async (page = 1, limit = 10, includeExpired = false) => {
    const offset = (page - 1) * limit;
    let query = `
      SELECT s.*, u.username, u.profilePic 
      FROM stories s 
      JOIN users u ON s.userId = u.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM stories';
    
    if (!includeExpired) {
      query += ' WHERE s.expiresAt > NOW()';
      countQuery += ' WHERE expiresAt > NOW()';
    }
    
    query += ' ORDER BY s.createdAt DESC LIMIT ? OFFSET ?';
    
    const [rows] = await db.query(query, [limit, offset]);
    const [countResult] = await db.query(countQuery);
    
    return {
      stories: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  },

  // Get active stories for feed (not expired)
  getActiveStories: async (userId) => {
    const [rows] = await db.query(
      `SELECT s.*, u.username, u.profilePic,
        (SELECT COUNT(*) FROM story_views WHERE storyId = s.id) as viewCount
       FROM stories s 
       JOIN users u ON s.userId = u.id
       WHERE s.expiresAt > NOW()
       AND (s.userId = ? OR s.userId IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?))
       ORDER BY s.createdAt DESC`,
      [userId, userId]
    );
    return rows;
  },

  // Get stories by user
  getByUserId: async (userId) => {
    const [rows] = await db.query(
      `SELECT s.*, u.username, u.profilePic 
       FROM stories s 
       JOIN users u ON s.userId = u.id 
       WHERE s.userId = ? AND s.expiresAt > NOW()
       ORDER BY s.createdAt DESC`,
      [userId]
    );
    return rows;
  },

  // Create new story
  create: async ({ userId, img = null, content = null, expiresAt = null }) => {
    // Default expiry is 24 hours from now
    const expiry = expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const [result] = await db.query(
      'INSERT INTO stories (userId, img, content, expiresAt) VALUES (?, ?, ?, ?)',
      [userId, img, content, expiry]
    );
    return result.insertId;
  },

  // Update story
  update: async (id, { img, content, expiresAt }) => {
    const fields = [];
    const values = [];
    
    if (img !== undefined) { fields.push('img = ?'); values.push(img); }
    if (content !== undefined) { fields.push('content = ?'); values.push(content); }
    if (expiresAt !== undefined) { fields.push('expiresAt = ?'); values.push(expiresAt); }
    
    if (fields.length === 0) return Story.findById(id);
    
    values.push(id);
    await db.query(`UPDATE stories SET ${fields.join(', ')} WHERE id = ?`, values);
    return Story.findById(id);
  },

  // Delete story
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM stories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Add view
  addView: async (storyId, userId) => {
    try {
      await db.query(
        'INSERT INTO story_views (storyId, userId) VALUES (?, ?)',
        [storyId, userId]
      );
      await db.query('UPDATE stories SET views = views + 1 WHERE id = ?', [storyId]);
      return true;
    } catch (e) {
      // Already viewed
      return false;
    }
  },

  // Get story viewers
  getViewers: async (storyId) => {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.profilePic, sv.viewedAt
       FROM story_views sv
       JOIN users u ON sv.userId = u.id
       WHERE sv.storyId = ?
       ORDER BY sv.viewedAt DESC`,
      [storyId]
    );
    return rows;
  },

  // Delete expired stories
  deleteExpired: async () => {
    const [result] = await db.query('DELETE FROM stories WHERE expiresAt < NOW()');
    return result.affectedRows;
  },

  // Count stories
  count: async (activeOnly = true) => {
    let query = 'SELECT COUNT(*) as count FROM stories';
    if (activeOnly) query += ' WHERE expiresAt > NOW()';
    const [rows] = await db.query(query);
    return rows[0].count;
  }
};

export default Story;

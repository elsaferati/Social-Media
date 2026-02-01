import db from '../config/db.js';

const Highlight = {
  // Get all highlights for admin (paginated, with user info)
  getAll: async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    let query = `
      SELECT h.*, u.username, s.img as coverImg 
       FROM profile_highlights h 
       JOIN users u ON h.userId = u.id 
       LEFT JOIN stories s ON h.coverStoryId = s.id 
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM profile_highlights h JOIN users u ON h.userId = u.id';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' WHERE u.username LIKE ? OR h.name LIKE ?';
      countQuery += ' WHERE u.username LIKE ? OR h.name LIKE ?';
      const term = `%${search}%`;
      params.push(term, term);
      countParams.push(term, term);
    }

    query += ' ORDER BY h.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      highlights: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM profile_highlights');
    return rows[0].count;
  },

  // Get highlights for a user (with cover image from first story)
  getByUserId: async (userId) => {
    const [rows] = await db.query(
      `SELECT h.*, s.img as coverImg 
       FROM profile_highlights h 
       LEFT JOIN stories s ON h.coverStoryId = s.id 
       WHERE h.userId = ? 
       ORDER BY h.createdAt DESC`,
      [userId]
    );
    return rows;
  },

  // Create highlight with stories
  create: async ({ userId, name, storyIds }) => {
    if (!storyIds || storyIds.length === 0) return null;
    const [result] = await db.query(
      'INSERT INTO profile_highlights (userId, name, coverStoryId) VALUES (?, ?, ?)',
      [userId, name, storyIds[0]]
    );
    const highlightId = result.insertId;
    for (let i = 0; i < storyIds.length; i++) {
      await db.query(
        'INSERT INTO profile_highlight_stories (highlightId, storyId, sortOrder) VALUES (?, ?, ?)',
        [highlightId, storyIds[i], i]
      );
    }
    return highlightId;
  },

  // Get stories in a highlight (in order)
  getStories: async (highlightId) => {
    const [rows] = await db.query(
      `SELECT s.*, u.username, u.profilePic 
       FROM profile_highlight_stories phs 
       JOIN stories s ON phs.storyId = s.id 
       JOIN users u ON s.userId = u.id 
       WHERE phs.highlightId = ?
       ORDER BY phs.sortOrder ASC`,
      [highlightId]
    );
    return rows;
  },

  // Delete highlight
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM profile_highlights WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Find by ID (with userId check for auth)
  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT * FROM profile_highlights WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },
};

export default Highlight;

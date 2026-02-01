import db from '../config/db.js';

const Hashtag = {
  // Find hashtag by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM hashtags WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Find hashtag by name
  findByName: async (name) => {
    const cleanName = name.replace('#', '').toLowerCase();
    const [rows] = await db.query('SELECT * FROM hashtags WHERE name = ?', [cleanName]);
    return rows[0] || null;
  },

  // Get all hashtags (paginated, for admin)
  getAll: async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM hashtags';
    let countQuery = 'SELECT COUNT(*) as total FROM hashtags';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' WHERE name LIKE ?';
      countQuery += ' WHERE name LIKE ?';
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    query += ' ORDER BY usageCount DESC, name ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);

    return {
      hashtags: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  },

  // Get trending hashtags
  getTrending: async (limit = 10) => {
    const [rows] = await db.query(
      `SELECT * FROM hashtags 
       WHERE isBlocked = 0 AND usageCount > 0
       ORDER BY usageCount DESC 
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  // Create new hashtag
  create: async (name) => {
    const cleanName = name.replace('#', '').toLowerCase();
    const [result] = await db.query(
      'INSERT INTO hashtags (name) VALUES (?)',
      [cleanName]
    );
    return result.insertId;
  },

  // Create or get existing hashtag
  findOrCreate: async (name) => {
    const cleanName = name.replace('#', '').toLowerCase();
    let hashtag = await Hashtag.findByName(cleanName);
    
    if (!hashtag) {
      const id = await Hashtag.create(cleanName);
      hashtag = await Hashtag.findById(id);
    }
    
    return hashtag;
  },

  // Update hashtag
  update: async (id, { name, isBlocked }) => {
    const fields = [];
    const values = [];
    
    if (name !== undefined) { 
      fields.push('name = ?'); 
      values.push(name.replace('#', '').toLowerCase()); 
    }
    if (isBlocked !== undefined) { fields.push('isBlocked = ?'); values.push(isBlocked ? 1 : 0); }
    
    if (fields.length === 0) return Hashtag.findById(id);
    
    values.push(id);
    await db.query(`UPDATE hashtags SET ${fields.join(', ')} WHERE id = ?`, values);
    return Hashtag.findById(id);
  },

  // Delete hashtag
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM hashtags WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Increment usage count
  incrementUsage: async (id) => {
    await db.query('UPDATE hashtags SET usageCount = usageCount + 1 WHERE id = ?', [id]);
  },

  // Decrement usage count
  decrementUsage: async (id) => {
    await db.query('UPDATE hashtags SET usageCount = GREATEST(usageCount - 1, 0) WHERE id = ?', [id]);
  },

  // Link hashtag to post
  linkToPost: async (postId, hashtagId) => {
    try {
      await db.query(
        'INSERT INTO post_hashtags (postId, hashtagId) VALUES (?, ?)',
        [postId, hashtagId]
      );
      await Hashtag.incrementUsage(hashtagId);
      return true;
    } catch (e) {
      // Already linked
      return false;
    }
  },

  // Unlink hashtag from post
  unlinkFromPost: async (postId, hashtagId) => {
    const [result] = await db.query(
      'DELETE FROM post_hashtags WHERE postId = ? AND hashtagId = ?',
      [postId, hashtagId]
    );
    if (result.affectedRows > 0) {
      await Hashtag.decrementUsage(hashtagId);
    }
    return result.affectedRows > 0;
  },

  // Remove all hashtags from a post (for update: clear then re-add)
  removeAllFromPost: async (postId) => {
    const [rows] = await db.query('SELECT hashtagId FROM post_hashtags WHERE postId = ?', [postId]);
    await db.query('DELETE FROM post_hashtags WHERE postId = ?', [postId]);
    for (const row of rows) {
      await Hashtag.decrementUsage(row.hashtagId);
    }
  },

  // Get hashtags for a post
  getByPostId: async (postId) => {
    const [rows] = await db.query(
      `SELECT h.* FROM hashtags h
       JOIN post_hashtags ph ON h.id = ph.hashtagId
       WHERE ph.postId = ?`,
      [postId]
    );
    return rows;
  },

  // Get posts by hashtag
  getPostsByHashtag: async (hashtagId, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT p.*, u.username, u.profilePic FROM posts p
       JOIN post_hashtags ph ON p.id = ph.postId
       JOIN users u ON p.userId = u.id
       WHERE ph.hashtagId = ?
       ORDER BY p.createdAt DESC
       LIMIT ? OFFSET ?`,
      [hashtagId, limit, offset]
    );
    return rows;
  },

  // Search hashtags
  search: async (query, limit = 10) => {
    const [rows] = await db.query(
      `SELECT * FROM hashtags 
       WHERE name LIKE ? AND isBlocked = 0
       ORDER BY usageCount DESC
       LIMIT ?`,
      [`%${query}%`, limit]
    );
    return rows;
  },

  // Get total count
  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM hashtags');
    return rows[0].count;
  },

  // Extract hashtags from text
  extractFromText: (text) => {
    const regex = /#(\w+)/g;
    const matches = text.match(regex);
    return matches ? matches.map(m => m.replace('#', '').toLowerCase()) : [];
  },

  // Process hashtags in post content
  processPostHashtags: async (postId, content) => {
    const hashtagNames = Hashtag.extractFromText(content);
    
    for (const name of hashtagNames) {
      const hashtag = await Hashtag.findOrCreate(name);
      await Hashtag.linkToPost(postId, hashtag.id);
    }
    
    return hashtagNames.length;
  }
};

export default Hashtag;

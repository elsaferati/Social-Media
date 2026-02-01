import db from '../config/db.js';

const User = {
  // Find user by ID (excludes password)
  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, username, email, profilePic, bio, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Find user by ID (includes password for auth)
  findByIdWithPassword: async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  // Find user by username
  findByUsername: async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  },

  // Create new user
  create: async ({ username, email, password }) => {
    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    return result.insertId;
  },

  // Update user
  update: async (id, { username, email, password, bio, profilePic }) => {
    if (password) {
      await db.query(
        'UPDATE users SET username = ?, email = ?, password = ?, bio = ?, profilePic = ? WHERE id = ?',
        [username, email, password, bio ?? null, profilePic ?? null, id]
      );
    } else {
      await db.query(
        'UPDATE users SET username = ?, email = ?, bio = ?, profilePic = ? WHERE id = ?',
        [username, email, bio ?? null, profilePic ?? null, id]
      );
    }
    return User.findById(id);
  },

  // Update user role
  updateRole: async (id, role) => {
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    return User.findById(id);
  },

  // Delete user
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Get all users (paginated, for admin)
  getAll: async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    let query = 'SELECT id, username, email, profilePic, bio, role, created_at FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' WHERE username LIKE ? OR email LIKE ?';
      countQuery += ' WHERE username LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);

    return {
      users: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  },

  // Get suggested users (users not followed)
  getSuggestions: async (userId, limit = 5) => {
    const [rows] = await db.query(
      `SELECT id, username, profilePic FROM users 
       WHERE id != ? 
       AND id NOT IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?)
       LIMIT ?`,
      [userId, userId, limit]
    );
    return rows;
  },

  // Get friends (users that userId follows)
  getFriends: async (userId) => {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.profilePic 
       FROM relationships r
       JOIN users u ON r.followedUserId = u.id
       WHERE r.followerUserId = ?`,
      [userId]
    );
    return rows;
  },

  // Search users
  search: async (query, limit = 10) => {
    const [rows] = await db.query(
      `SELECT id, username, profilePic, bio FROM users 
       WHERE username LIKE ? 
       ORDER BY username ASC
       LIMIT ?`,
      [`%${query}%`, limit]
    );
    return rows;
  },

  // Get total count
  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM users');
    return rows[0].count;
  }
};

export default User;

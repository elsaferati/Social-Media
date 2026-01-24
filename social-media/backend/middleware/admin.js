import db from '../config/db.js';

export const isAdmin = async (req, res, next) => {
  try {
    // req.user should be set by authenticateToken middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const [rows] = await db.query(
      'SELECT role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

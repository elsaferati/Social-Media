import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Message from '../models/Message.js';
import Like from '../models/Like.js';
import bcrypt from 'bcryptjs';

// Get dashboard statistics
export const getStats = async (req, res) => {
  try {
    const [usersCount, postsCount, commentsCount, messagesCount, likesCount] = await Promise.all([
      User.count(),
      Post.count(),
      Comment.count(),
      Message.count(),
      Like.count()
    ]);

    res.json({
      users: usersCount,
      posts: postsCount,
      comments: commentsCount,
      messages: messagesCount,
      likes: likesCount
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== USERS ====================

// Get all users (paginated)
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await User.getAll(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { username, email, password, bio, role } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Update user
    await User.update(userId, {
      username: username || existingUser.username,
      email: email || existingUser.email,
      password: hashedPassword,
      bio: bio !== undefined ? bio : existingUser.bio
    });

    // Update role if provided
    if (role && ['user', 'admin'].includes(role)) {
      await User.updateRole(userId, role);
    }

    const updatedUser = await User.findById(userId);
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username or email already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting own account
    if (req.user.id === parseInt(userId)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.delete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== POSTS ====================

// Get all posts (paginated)
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await Post.getAllAdmin(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Post.delete(postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== COMMENTS ====================

// Get all comments (paginated)
export const getAllComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await Comment.getAllAdmin(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await Comment.delete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== MESSAGES ====================

// Get all messages (paginated)
export const getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await Message.getAllAdmin(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error('Get all messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await Message.delete(messageId);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

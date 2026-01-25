import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Message from '../models/Message.js';
import Like from '../models/Like.js';
import Story from '../models/Story.js';
import Report from '../models/Report.js';
import Hashtag from '../models/Hashtag.js';
import ActivityLog from '../models/ActivityLog.js';
import bcrypt from 'bcryptjs';

// Get dashboard statistics
export const getStats = async (req, res) => {
  try {
    const [usersCount, postsCount, commentsCount, messagesCount, likesCount, storiesCount, pendingReportsCount, hashtagsCount, logsCount] = await Promise.all([
      User.count(),
      Post.count(),
      Comment.count(),
      Message.count(),
      Like.count(),
      Story.count(),
      Report.countPending(),
      Hashtag.count(),
      ActivityLog.count()
    ]);

    res.json({
      users: usersCount,
      posts: postsCount,
      comments: commentsCount,
      messages: messagesCount,
      likes: likesCount,
      stories: storiesCount,
      pendingReports: pendingReportsCount,
      hashtags: hashtagsCount,
      activityLogs: logsCount
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

// ==================== STORIES ====================

// Get all stories (paginated)
export const getAdminStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const includeExpired = req.query.includeExpired === 'true';

    const result = await Story.getAll(page, limit, includeExpired);
    res.json(result);
  } catch (error) {
    console.error('Get admin stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single story
export const getAdminStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Get admin story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update story
export const updateAdminStory = async (req, res) => {
  try {
    const { content, expiresAt } = req.body;
    const storyId = req.params.id;

    const existingStory = await Story.findById(storyId);
    if (!existingStory) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const updatedStory = await Story.update(storyId, { content, expiresAt });
    
    // Log activity
    await ActivityLog.logUserAction(req, 'admin_update_story', 'story', storyId);

    res.json(updatedStory);
  } catch (error) {
    console.error('Update admin story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete story
export const deleteAdminStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    await Story.delete(storyId);
    
    // Log activity
    await ActivityLog.logUserAction(req, 'admin_delete_story', 'story', storyId);

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete admin story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== REPORTS ====================

// Get all reports (paginated)
export const getAdminReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || null;
    const reportType = req.query.reportType || null;

    const result = await Report.getAll(page, limit, status, reportType);
    res.json(result);
  } catch (error) {
    console.error('Get admin reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single report
export const getAdminReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Get admin report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update report (review)
export const updateAdminReport = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const reportId = req.params.id;

    const existingReport = await Report.findById(reportId);
    if (!existingReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const updatedReport = await Report.update(reportId, { status, adminNotes });
    
    // Log activity
    await ActivityLog.logUserAction(req, 'admin_review_report', 'report', reportId, { 
      oldStatus: existingReport.status,
      newStatus: status
    });

    res.json(updatedReport);
  } catch (error) {
    console.error('Update admin report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete report
export const deleteAdminReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await Report.delete(reportId);
    
    // Log activity
    await ActivityLog.logUserAction(req, 'admin_delete_report', 'report', reportId);

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete admin report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== HASHTAGS ====================

// Get all hashtags (paginated)
export const getAdminHashtags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await Hashtag.getAll(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error('Get admin hashtags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single hashtag
export const getAdminHashtag = async (req, res) => {
  try {
    const hashtag = await Hashtag.findById(req.params.id);
    if (!hashtag) {
      return res.status(404).json({ message: 'Hashtag not found' });
    }
    res.json(hashtag);
  } catch (error) {
    console.error('Get admin hashtag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create hashtag
export const createAdminHashtag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Hashtag name is required' });
    }

    // Check if already exists
    const existing = await Hashtag.findByName(name);
    if (existing) {
      return res.status(400).json({ message: 'Hashtag already exists' });
    }

    const hashtagId = await Hashtag.create(name);
    const hashtag = await Hashtag.findById(hashtagId);
    
    // Log activity
    await ActivityLog.logUserAction(req, 'admin_create_hashtag', 'hashtag', hashtagId, { name });

    res.status(201).json(hashtag);
  } catch (error) {
    console.error('Create admin hashtag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update hashtag
export const updateAdminHashtag = async (req, res) => {
  try {
    const { name, isBlocked } = req.body;
    const hashtagId = req.params.id;

    const existingHashtag = await Hashtag.findById(hashtagId);
    if (!existingHashtag) {
      return res.status(404).json({ message: 'Hashtag not found' });
    }

    const updatedHashtag = await Hashtag.update(hashtagId, { name, isBlocked });
    
    // Log activity
    await ActivityLog.logUserAction(req, 'admin_update_hashtag', 'hashtag', hashtagId, {
      oldName: existingHashtag.name,
      newName: name,
      isBlocked
    });

    res.json(updatedHashtag);
  } catch (error) {
    console.error('Update admin hashtag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete hashtag
export const deleteAdminHashtag = async (req, res) => {
  try {
    const hashtagId = req.params.id;

    const hashtag = await Hashtag.findById(hashtagId);
    if (!hashtag) {
      return res.status(404).json({ message: 'Hashtag not found' });
    }

    await Hashtag.delete(hashtagId);
    
    // Log activity
    await ActivityLog.logUserAction(req, 'admin_delete_hashtag', 'hashtag', hashtagId, { name: hashtag.name });

    res.json({ message: 'Hashtag deleted successfully' });
  } catch (error) {
    console.error('Delete admin hashtag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== ACTIVITY LOGS ====================

// Get all activity logs (paginated)
export const getAdminActivityLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const filters = {};
    if (req.query.userId) filters.userId = parseInt(req.query.userId);
    if (req.query.action) filters.action = req.query.action;
    if (req.query.entityType) filters.entityType = req.query.entityType;
    if (req.query.startDate) filters.startDate = req.query.startDate;
    if (req.query.endDate) filters.endDate = req.query.endDate;

    const result = await ActivityLog.getAll(page, limit, filters);
    res.json(result);
  } catch (error) {
    console.error('Get admin activity logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single activity log
export const getAdminActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Activity log not found' });
    }
    res.json(log);
  } catch (error) {
    console.error('Get admin activity log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update activity log
export const updateAdminActivityLog = async (req, res) => {
  try {
    const { action, entityType, entityId, details } = req.body;
    const logId = req.params.id;

    const existingLog = await ActivityLog.findById(logId);
    if (!existingLog) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    const updatedLog = await ActivityLog.update(logId, { action, entityType, entityId, details });
    res.json(updatedLog);
  } catch (error) {
    console.error('Update admin activity log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete activity log
export const deleteAdminActivityLog = async (req, res) => {
  try {
    const logId = req.params.id;

    const log = await ActivityLog.findById(logId);
    if (!log) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    await ActivityLog.delete(logId);
    res.json({ message: 'Activity log deleted successfully' });
  } catch (error) {
    console.error('Delete admin activity log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

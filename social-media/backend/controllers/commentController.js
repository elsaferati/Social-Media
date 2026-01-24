import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.getByPostId(postId);
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create comment
export const createComment = async (req, res) => {
  try {
    const { content, userId, postId } = req.body;

    if (!content || !userId || !postId) {
      return res.status(400).json({ message: 'Content, userId, and postId are required' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const commentId = await Comment.create({ content, userId, postId });
    const comment = await Comment.findById(commentId);

    // Create notification if not own post
    if (post.userId !== userId) {
      await Notification.createCommentNotification(post.userId, userId, postId);
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const commentId = req.params.id;

    // Check if comment exists
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership
    if (req.user && req.user.id !== existingComment.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    const updatedComment = await Comment.update(commentId, { content });
    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    // Check if comment exists
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership (unless admin)
    if (req.user && req.user.id !== existingComment.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.delete(commentId);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comment count for a post
export const getCommentCount = async (req, res) => {
  try {
    const postId = req.params.postId;
    const count = await Comment.countByPost(postId);
    res.json({ count });
  } catch (error) {
    console.error('Get comment count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

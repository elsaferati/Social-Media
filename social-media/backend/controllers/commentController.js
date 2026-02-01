import Comment from '../models/Comment.js';
import CommentLike from '../models/CommentLike.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';

// Get comments for a post (with likeCount and liked for current user). All users can see all comments.
export const getComments = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    if (Number.isNaN(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    const currentUserId = req.user?.id ?? null;
    const comments = await Comment.getByPostId(postId, currentUserId);
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create comment (optionally a reply: parentCommentId). Uses authenticated user.
export const createComment = async (req, res) => {
  try {
    const { content, postId: postIdRaw, parentCommentId } = req.body;
    const postId = parseInt(postIdRaw, 10);
    const userId = req.user?.id ?? req.body.userId;

    if (!content || !postIdRaw) {
      return res.status(400).json({ message: 'Content and postId are required' });
    }
    if (Number.isNaN(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Please sign in to comment' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const commentId = await Comment.create({ content, userId, postId, parentCommentId: parentCommentId || null });
    const comment = await Comment.findById(commentId);

    // Create notification if not own post (post author may be post.userId or post.userid from MySQL)
    const postAuthorId = post.userId ?? post.userid;
    if (postAuthorId && postAuthorId !== userId) {
      try {
        await Notification.createCommentNotification(postAuthorId, userId, postId);
      } catch (notifErr) {
        console.error('Create comment notification error:', notifErr);
        // Don't fail the request; comment was created
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
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

// Delete comment (comment author, post author, or admin only)
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const commentAuthorId = existingComment.userId ?? existingComment.userid;
    const isCommentAuthor = req.user?.id === commentAuthorId;
    const isAdmin = req.user?.role === 'admin';

    // Post author can delete any comment on their post
    let isPostAuthor = false;
    if (req.user?.id && existingComment.postId) {
      const post = await Post.findById(existingComment.postId);
      if (post) {
        const postOwnerId = post.userId ?? post.userid;
        isPostAuthor = req.user.id === postOwnerId;
      }
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Sign in to delete comments' });
    }
    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return res.status(403).json({ message: 'You can only delete your own comments or comments on your posts' });
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

// Toggle like on a comment
export const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Login required to like comments' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const liked = await CommentLike.toggle(userId, commentId);
    const count = await CommentLike.countByComment(commentId);
    res.json({ liked, count });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

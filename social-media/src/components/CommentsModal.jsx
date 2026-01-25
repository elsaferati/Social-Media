import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Heart, MoreHorizontal, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { commentAPI } from '../services/api';

const CommentsModal = ({ isOpen, onClose, postId, postAuthor }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentAPI.getByPost(postId);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const comment = await commentAPI.create(newComment, currentUser.id, postId);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentAPI.delete(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Comments</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Send className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold mb-1">No comments yet</p>
              <p className="text-sm text-gray-500">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <div 
                key={comment.id} 
                className="flex gap-3 animate-fadeIn group"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Avatar */}
                <Link to={`/profile/${comment.userId}`} className="shrink-0">
                  <div className="avatar-ring">
                    <img 
                      src={comment.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`} 
                      alt={comment.username} 
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-2xl px-4 py-2.5 relative">
                    <Link 
                      to={`/profile/${comment.userId}`}
                      className="font-semibold text-sm text-gray-900 hover:text-indigo-600 transition-colors"
                    >
                      {comment.username}
                    </Link>
                    <p className="text-gray-700 text-sm mt-0.5 break-words">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 px-2">
                    <span className="text-xs text-gray-400">
                      {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                    <button className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                      Reply
                    </button>
                    {currentUser?.id === comment.userId && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Like Button */}
                <button className="self-center p-1.5 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                  <Heart size={16} className="text-gray-400" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <form 
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 py-4 border-t border-gray-100 bg-white shrink-0"
        >
          <div className="avatar-ring shrink-0">
            <img 
              src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`} 
              alt={currentUser?.username} 
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-full focus:border-indigo-500 focus:bg-white text-sm outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="p-2.5 gradient-bg text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-200 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;

import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
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
      // Focus input when modal opens
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No comments yet</p>
              <p className="text-sm text-gray-400 mt-1">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar */}
                <Link to={`/profile/${comment.userId}`} className="shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {comment.profilePic ? (
                      <img 
                        src={comment.profilePic} 
                        alt={comment.username} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {comment.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <Link 
                      to={`/profile/${comment.userId}`}
                      className="font-semibold text-sm text-gray-900 hover:underline"
                    >
                      {comment.username}
                    </Link>
                    <p className="text-gray-800 text-sm mt-0.5 break-words">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 px-2">
                    <span className="text-xs text-gray-500">
                      {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                    {/* Delete button for own comments */}
                    {currentUser?.id === comment.userId && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <form 
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            {currentUser?.profilePic ? (
              <img 
                src={currentUser.profilePic} 
                alt={currentUser.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;

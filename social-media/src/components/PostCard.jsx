import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { likeAPI, bookmarkAPI, postAPI } from "../services/api";
import CommentsModal from "./CommentsModal";

const PostCard = ({ post, onDelete, onBookmarkChange }) => {
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const userImage = post.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`;
  const username = post.username || "user_" + post.userId;
  const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : "just now";

  useEffect(() => {
    if (currentUser) {
      fetchLikes();
      checkBookmark();
    }
  }, [post.id, currentUser]);

  const fetchLikes = async () => {
    try {
      const likes = await likeAPI.getLikes(post.id);
      setLikesCount(Array.isArray(likes) ? likes.length : 0);
      setLiked(Array.isArray(likes) && likes.includes(currentUser?.id));
    } catch (err) {
      console.error('Error fetching likes:', err);
      setLikesCount(0);
      setLiked(false);
    }
  };

  const checkBookmark = async () => {
    try {
      const isBookmarked = await bookmarkAPI.check(currentUser?.id, post.id);
      setBookmarked(Boolean(isBookmarked));
    } catch (err) {
      console.error('Error checking bookmark:', err);
      setBookmarked(false);
    }
  };

  const handleLike = async () => {
    if (likeLoading || !currentUser) return;
    
    // Trigger animation
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 300);
    
    try {
      setLikeLoading(true);
      const result = await likeAPI.toggleLike(currentUser.id, post.id);
      setLiked(result.liked);
      setLikesCount(prev => result.liked ? prev + 1 : Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (bookmarkLoading || !currentUser) return;
    
    try {
      setBookmarkLoading(true);
      const result = await bookmarkAPI.toggle(currentUser.id, post.id);
      setBookmarked(result.bookmarked);
      
      if (onBookmarkChange) {
        onBookmarkChange(post.id, result.bookmarked);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postAPI.delete(post.id);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
    setShowMenu(false);
  };

  const isOwnPost = currentUser?.id === post.userId;

  return (
    <>
      <article className="card-flat overflow-hidden mb-5 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.userId}`} className="avatar-ring">
              <img 
                src={userImage} 
                alt={username} 
                className="w-11 h-11 rounded-full object-cover"
              />
            </Link>
            <div>
              <Link 
                to={`/profile/${post.userId}`} 
                className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {username}
              </Link>
              <p className="text-xs text-gray-400">{timeAgo}</p>
            </div>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 min-w-[160px] animate-scaleIn">
                  {isOwnPost && (
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2.5 text-left text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="font-medium">Delete Post</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full px-4 py-2.5 text-left text-gray-600 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Share2 size={16} />
                    <span className="font-medium">Share</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {post.content && !post.img && (
          <div className="px-4 pb-3">
            <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        {/* Image */}
        {post.img && (
          <div className="relative bg-gray-100">
            <img 
              src={post.img.startsWith('http') ? post.img : `http://localhost:8800${post.img}`} 
              alt="Post" 
              className="w-full object-cover max-h-[500px]"
              onDoubleClick={handleLike}
            />
            {/* Double-tap like animation */}
            {isLikeAnimating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Heart 
                  size={80} 
                  className="fill-white text-white animate-ping opacity-80" 
                />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4">
          {/* Action Buttons */}
          <div className="flex justify-between mb-3">
            <div className="flex gap-1">
              <button 
                onClick={handleLike} 
                disabled={likeLoading}
                className={`p-2 rounded-full transition-all duration-200 ${
                  liked 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-600 hover:bg-gray-100'
                } disabled:opacity-50`}
              >
                <Heart 
                  size={24} 
                  className={`transition-transform duration-200 ${
                    isLikeAnimating ? 'scale-125' : ''
                  } ${liked ? 'fill-current' : ''}`}
                />
              </button>
              <button 
                onClick={() => setShowComments(true)} 
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MessageCircle size={24} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Send size={24} />
              </button>
            </div>
            <button 
              onClick={handleBookmark} 
              disabled={bookmarkLoading}
              className={`p-2 rounded-full transition-all duration-200 ${
                bookmarked 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              } disabled:opacity-50`}
            >
              <Bookmark 
                size={24} 
                className={bookmarked ? 'fill-current' : ''} 
              />
            </button>
          </div>

          {/* Likes Count */}
          <p className="font-semibold text-sm text-gray-900 mb-2">
            {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
          </p>

          {/* Caption */}
          {post.content && post.img && (
            <div className="mb-2">
              <Link 
                to={`/profile/${post.userId}`} 
                className="font-semibold text-gray-900 hover:text-indigo-600 mr-2"
              >
                {username}
              </Link>
              <span className="text-gray-700">{post.content}</span>
            </div>
          )}

          {/* View Comments */}
          <button 
            onClick={() => setShowComments(true)} 
            className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
          >
            View comments
          </button>
        </div>
      </article>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={post.id}
        postAuthor={username}
      />
    </>
  );
};

export default PostCard;

import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2 } from "lucide-react";
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

  const userImage = post.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`;
  const username = post.username || "user_" + post.userId;
  const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "just now";

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
      setLikesCount(0);
      setLiked(false);
    }
  };

  const checkBookmark = async () => {
    try {
      const isBookmarked = await bookmarkAPI.check(currentUser?.id, post.id);
      setBookmarked(Boolean(isBookmarked));
    } catch (err) {
      setBookmarked(false);
    }
  };

  const handleLike = async () => {
    if (likeLoading || !currentUser) return;
    
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
      if (onBookmarkChange) onBookmarkChange(post.id, result.bookmarked);
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
      <article className="card overflow-hidden hover:shadow-md transition-all duration-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.userId}`}>
              <img 
                src={userImage} 
                alt={username} 
                className="w-11 h-11 rounded-full object-cover bg-[#F1F5F9]"
              />
            </Link>
            <div>
              <Link 
                to={`/profile/${post.userId}`} 
                className="font-semibold text-[#1E293B] hover:text-[#7E22CE] transition-colors text-sm"
              >
                {username}
              </Link>
              <p className="text-xs text-[#94A3B8]">{timeAgo}</p>
            </div>
          </div>
          
          {/* Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors"
            >
              <MoreHorizontal size={20} className="text-[#64748B]" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-[12px] shadow-lg border border-[#E2E8F0] z-20 py-2 min-w-[160px] animate-scaleIn">
                  {isOwnPost && (
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2.5 text-left text-[#EF4444] hover:bg-[#FEE2E2] flex items-center gap-3 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="font-medium">Delete</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full px-4 py-2.5 text-left text-[#475569] hover:bg-[#F1F5F9] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {post.content && !post.img && (
          <div className="px-4 pb-3">
            <p className="text-[#334155] text-[15px] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        {/* Image */}
        {post.img && (
          <div className="bg-[#F8FAFC]">
            <img 
              src={post.img.startsWith('http') ? post.img : `http://localhost:8800${post.img}`} 
              alt="Post" 
              className="w-full object-cover max-h-[500px]"
              onDoubleClick={handleLike}
            />
          </div>
        )}

        {/* Footer */}
        <div className="p-4">
          {/* Actions */}
          <div className="flex justify-between mb-3">
            <div className="flex gap-1">
              <button 
                onClick={handleLike} 
                disabled={likeLoading}
                className={`p-2 rounded-full transition-all ${
                  liked ? 'text-[#EF4444] bg-[#FEE2E2]' : 'text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                <Heart size={22} className={liked ? 'fill-current' : ''} />
              </button>
              <button 
                onClick={() => setShowComments(true)} 
                className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-full transition-colors"
              >
                <MessageCircle size={22} />
              </button>
              <button className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-full transition-colors">
                <Send size={22} />
              </button>
            </div>
            <button 
              onClick={handleBookmark} 
              disabled={bookmarkLoading}
              className={`p-2 rounded-full transition-all ${
                bookmarked ? 'text-[#7E22CE] bg-[#F3E8FF]' : 'text-[#64748B] hover:bg-[#F1F5F9]'
              }`}
            >
              <Bookmark size={22} className={bookmarked ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Likes */}
          <p className="font-semibold text-sm text-[#1E293B] mb-2">
            {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
          </p>

          {/* Caption */}
          {post.content && post.img && (
            <div className="mb-2">
              <Link to={`/profile/${post.userId}`} className="font-semibold text-[#1E293B] text-sm mr-2">
                {username}
              </Link>
              <span className="text-[#334155] text-sm">{post.content}</span>
            </div>
          )}

          {/* View Comments */}
          <button 
            onClick={() => setShowComments(true)} 
            className="text-[#64748B] text-sm hover:text-[#475569] transition-colors"
          >
            View comments
          </button>
        </div>
      </article>

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

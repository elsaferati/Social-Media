import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { likeAPI, bookmarkAPI, postAPI } from "../services/api";
import CommentsModal from "./CommentsModal";

const PostCard = ({ post, onDelete }) => {
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const userImage = post.profilePic || "https://i.pravatar.cc/150?u=" + post.userId;
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
      setLikesCount(likes.length);
      setLiked(likes.includes(currentUser?.id));
    } catch (err) {
      console.error('Error fetching likes:', err);
    }
  };

  const checkBookmark = async () => {
    try {
      const isBookmarked = await bookmarkAPI.check(currentUser?.id, post.id);
      setBookmarked(isBookmarked);
    } catch (err) {
      console.error('Error checking bookmark:', err);
    }
  };

  const handleLike = async () => {
    try {
      const result = await likeAPI.toggleLike(currentUser?.id, post.id);
      setLiked(result.liked);
      setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleBookmark = async () => {
    try {
      const result = await bookmarkAPI.toggle(currentUser?.id, post.id);
      setBookmarked(result.bookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
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
      <article className="bg-white border-b md:border border-gray-200 md:rounded-lg mb-4 text-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.userId}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
                <img src={userImage} alt="" className="w-full h-full rounded-full border border-white object-cover" />
              </div>
            </Link>
            <Link to={`/profile/${post.userId}`} className="font-semibold text-gray-900 hover:underline">
              {username}
            </Link>
            <span className="text-gray-400 text-xs">• {timeAgo}</span>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="text-gray-900 p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreHorizontal size={20} />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[150px]">
                  {isOwnPost && (
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete Post
                    </button>
                  )}
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="w-full bg-black flex items-center justify-center overflow-hidden max-h-[600px]">
          {post.img ? (
            <img src={post.img} alt="Post" className="w-full object-contain" />
          ) : (
            <div className="w-full py-8 px-4 bg-white">
              <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
            </div>
          )}
        </div>

        {/* Footer Content */}
        <div className="p-3">
          <div className="flex justify-between mb-2">
            <div className="flex gap-4">
              <button 
                onClick={handleLike} 
                className="hover:opacity-60 transition"
              >
                <Heart 
                  size={26} 
                  className={liked ? "fill-red-500 text-red-500" : "text-black"} 
                  strokeWidth={1.5} 
                />
              </button>
              <button 
                onClick={() => setShowComments(true)} 
                className="hover:opacity-60 transition"
              >
                <MessageCircle size={26} strokeWidth={1.5} />
              </button>
              <button className="hover:opacity-60 transition">
                <Send size={26} strokeWidth={1.5} />
              </button>
            </div>
            <button 
              onClick={handleBookmark} 
              className="hover:opacity-60 transition"
            >
              <Bookmark 
                size={26} 
                className={bookmarked ? "fill-black" : ""} 
                strokeWidth={1.5} 
              />
            </button>
          </div>

          <div className="font-semibold text-sm mb-2">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </div>

          <div className="mb-2">
            <Link to={`/profile/${post.userId}`} className="font-semibold mr-2 hover:underline">
              {username}
            </Link>
            <span className="text-gray-900">{post.content || "No description."}</span>
          </div>

          <button 
            onClick={() => setShowComments(true)} 
            className="text-gray-500 text-sm mb-2 hover:text-gray-700"
          >
            View comments
          </button>
          
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">
            {timeAgo} AGO
          </div>
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

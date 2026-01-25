import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout"; 
import PostsFeed from "../components/PostsFeed";
import { Bookmark, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { postAPI } from "../services/api";

const BookmarksPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchBookmarks();
  }, [currentUser]);

  const fetchBookmarks = async () => {
    if (!currentUser?.id) return;
    
    try {
      setLoading(true);
      const data = await postAPI.getBookmarked(currentUser.id);
      setPosts(data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <Layout>
      <div className="w-full max-w-[600px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <Link to="/" className="text-gray-500 hover:text-black transition">
             <ArrowLeft size={24} />
          </Link>
          <div>
             <h1 className="text-xl font-bold">Saved</h1>
             <p className="text-xs text-gray-500">Only you can see what you've saved</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center mb-6">
                <Bookmark size={48} className="text-gray-300" />
             </div>
             <h2 className="text-2xl font-light text-gray-800">Save Your Favorite Posts</h2>
             <p className="text-sm text-gray-500 mt-2 max-w-xs">
               Tap the bookmark icon on any post to save it to your personal collection.
             </p>
          </div>
        ) : (
          <PostsFeed 
            posts={posts} 
            filter="bookmarks" 
            onBookmarkRemoved={handleRemoveBookmark}
          />
        )}
      </div>
    </Layout>
  );
};

export default BookmarksPage;

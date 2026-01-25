import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import PostsFeed from "../components/PostsFeed";
import SuggestedUsers from "../components/SuggestedUsers";
import ModalSystem from "../components/ModalSystem";
import CreatePost from "../components/CreatePost";
import StoriesBar from "../components/StoriesBar";
import { Image, Smile, Sparkles, TrendingUp } from "lucide-react"; 
import { postAPI } from "../services/api";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchFeed();
  }, [currentUser]);

  const fetchFeed = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const data = await postAPI.getFeed(currentUser.id);
      setPosts(data);
    } catch (err) {
      console.error('Error fetching feed:', err);
      try {
        const allPosts = await postAPI.getAll();
        setPosts(allPosts);
      } catch (e) {
        console.error('Error fetching all posts:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (newPost) => {
    if (newPost && newPost.id) {
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }
    setIsCreatePostOpen(false);
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <Layout>
      <div className="flex gap-8">
        {/* CENTER COLUMN */}
        <div className="w-full max-w-[630px] flex flex-col gap-5">
          
          {/* Stories */}
          <StoriesBar />

          {/* Create Post Card */}
          <div className="card-flat p-4">
            <div className="flex items-center gap-4">
              <div className="avatar-ring">
                <img 
                  src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`} 
                  className="w-12 h-12 rounded-full object-cover" 
                  alt="" 
                />
              </div>
              <div 
                onClick={() => setIsCreatePostOpen(true)}
                className="flex-1 bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl px-5 py-3.5 text-gray-500 cursor-pointer border-2 border-transparent hover:border-gray-200"
              >
                What's on your mind, {currentUser?.username}?
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setIsCreatePostOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <Image size={20} />
                <span className="font-medium text-sm">Photo</span>
              </button>
              <button 
                onClick={() => setIsCreatePostOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
              >
                <Smile size={20} />
                <span className="font-medium text-sm">Feeling</span>
              </button>
              <button 
                onClick={() => setIsCreatePostOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <Sparkles size={20} />
                <span className="font-medium text-sm">Story</span>
              </button>
            </div>
          </div>

          {/* Feed */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading your feed...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="card-flat p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your feed is empty</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Follow some users to see their posts here, or create your own post to get started!
              </p>
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="btn-primary"
              >
                Create your first post
              </button>
            </div>
          ) : (
            <PostsFeed posts={posts} onDelete={handleDeletePost} />
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="hidden lg:block w-[320px] flex-shrink-0">
          <div className="sticky top-6 space-y-6">
            {/* User Card */}
            <div className="card-flat p-4">
              <div className="flex items-center gap-4">
                <div className="avatar-ring">
                  <img 
                    src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`} 
                    className="w-14 h-14 rounded-full object-cover" 
                    alt="" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{currentUser?.username}</p>
                  <p className="text-gray-500 text-sm truncate">{currentUser?.email}</p>
                </div>
                <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">
                  Switch
                </button>
              </div>
            </div>

            {/* Suggested Users */}
            <SuggestedUsers /> 

            {/* Footer Links */}
            <div className="px-2 space-y-4">
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                <a href="#" className="hover:underline">About</a>
                <span>-</span>
                <a href="#" className="hover:underline">Help</a>
                <span>-</span>
                <a href="#" className="hover:underline">Privacy</a>
                <span>-</span>
                <a href="#" className="hover:underline">Terms</a>
              </div>
              <p className="text-xs text-gray-400">
                © 2026 Socialix. Made with love.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <ModalSystem onClose={() => setIsCreatePostOpen(false)}>
          <CreatePost onClose={() => setIsCreatePostOpen(false)} onPost={handleCreatePost} />
        </ModalSystem>
      )}
    </Layout>
  );
};

export default HomePage;

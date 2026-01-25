import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import PostsFeed from "../components/PostsFeed";
import SuggestedUsers from "../components/SuggestedUsers";
import ModalSystem from "../components/ModalSystem";
import CreatePost from "../components/CreatePost";
import StoriesBar from "../components/StoriesBar";
import { Image, Smile } from "lucide-react"; 
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
      // Get feed posts (from followed users + own posts)
      const data = await postAPI.getFeed(currentUser.id);
      setPosts(data);
    } catch (err) {
      console.error('Error fetching feed:', err);
      // Fallback to all posts if feed fails
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
    // The CreatePost component now handles the API call directly
    // and returns the new post, so we just need to add it to the feed
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
      {/* CENTER COLUMN */}
      <div className="w-full max-w-[630px] flex flex-col gap-6">
        
        {/* 1. Stories Rail */}
        <StoriesBar />

        {/* 2. Create Post Trigger */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <img src={currentUser?.profilePic || "https://i.pravatar.cc/150?u=" + currentUser?.id} className="w-10 h-10 rounded-full bg-gray-200 object-cover" alt="" />
            <div 
                onClick={() => setIsCreatePostOpen(true)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 transition rounded-full px-4 py-2.5 text-gray-500 text-sm cursor-pointer"
            >
                What's on your mind, {currentUser?.username}?
            </div>
            <Image size={24} className="text-gray-400 cursor-pointer hover:text-green-500" />
            <Smile size={24} className="text-gray-400 cursor-pointer hover:text-yellow-500" />
        </div>

        {/* 3. Feed */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-2">No posts in your feed yet</p>
            <p className="text-sm text-gray-400">Follow some users to see their posts here, or create your own!</p>
          </div>
        ) : (
          <PostsFeed posts={posts} onDelete={handleDeletePost} />
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden lg:block w-[320px] pl-4">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <img src={currentUser?.profilePic || "https://i.pravatar.cc/150?u=" + currentUser?.id} className="w-12 h-12 rounded-full object-cover" alt="" />
                <div>
                    <p className="font-semibold text-sm">{currentUser?.username}</p>
                    <p className="text-gray-500 text-sm">{currentUser?.email}</p>
                </div>
            </div>
            <button className="text-blue-500 text-xs font-bold hover:text-blue-700">Switch</button>
        </div>

        <SuggestedUsers /> 
        
        <div className="mt-8 text-xs text-gray-400 uppercase">
            <p>© 2026 MY SOCIAL APP</p>
        </div>
      </div>

      {/* Modal */}
      {isCreatePostOpen && (
        <ModalSystem onClose={() => setIsCreatePostOpen(false)}>
          <CreatePost onClose={() => setIsCreatePostOpen(false)} onPost={handleCreatePost} />
        </ModalSystem>
      )}
    </Layout>
  );
};

export default HomePage;

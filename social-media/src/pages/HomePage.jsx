import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import PostsFeed from "../components/PostsFeed";
import SuggestedUsers from "../components/SuggestedUsers";
import ModalSystem from "../components/ModalSystem";
import CreatePost from "../components/CreatePost";
import StoriesBar from "../components/StoriesBar";
import { Image, Smile, TrendingUp } from "lucide-react"; 
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
      {/* Centered Content Container */}
      <div className="flex justify-center gap-8">
        
        {/* Main Feed - Centered with max-width */}
        <div className="w-full max-w-[680px] space-y-6">
          
          {/* Stories */}
          <StoriesBar />

          {/* Create Post Card */}
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <img 
                src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`} 
                className="w-12 h-12 rounded-full object-cover bg-[#F1F5F9]" 
                alt="" 
              />
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="flex-1 text-left bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-full px-5 py-3.5 text-[#64748B] transition-all duration-200"
              >
                What's on your mind, {currentUser?.username}?
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
              <button 
                onClick={() => setIsCreatePostOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-[#475569] hover:bg-[#F1F5F9] transition-all duration-200"
              >
                <Image size={20} className="text-[#22C55E]" />
                <span className="text-sm font-medium">Photo</span>
              </button>
              <button 
                onClick={() => setIsCreatePostOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-[#475569] hover:bg-[#F1F5F9] transition-all duration-200"
              >
                <Smile size={20} className="text-[#F59E0B]" />
                <span className="text-sm font-medium">Feeling</span>
              </button>
            </div>
          </div>

          {/* Feed */}
          {loading ? (
            <div className="card p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-3 border-[#7E22CE] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#64748B]">Loading your feed...</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F3E8FF] rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#7E22CE]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Your feed is empty</h3>
              <p className="text-[#64748B] mb-6 max-w-sm mx-auto">
                Follow some users to see their posts here, or create your own post to get started!
              </p>
              <button onClick={() => setIsCreatePostOpen(true)} className="btn-primary">
                Create your first post
              </button>
            </div>
          ) : (
            <PostsFeed posts={posts} onDelete={handleDeletePost} />
          )}
        </div>

        {/* Right Sidebar - Widgets */}
        <div className="hidden xl:block w-[320px] flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            
            {/* User Card */}
            <div className="card p-5">
              <div className="flex items-center gap-4">
                <img 
                  src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`} 
                  className="w-14 h-14 rounded-full object-cover bg-[#F1F5F9]" 
                  alt="" 
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1E293B] truncate">{currentUser?.username}</p>
                  <p className="text-sm text-[#64748B] truncate">{currentUser?.email}</p>
                </div>
              </div>
            </div>

            {/* Suggested Users */}
            <SuggestedUsers /> 

            {/* Footer Links */}
            <div className="px-2 space-y-3">
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#94A3B8]">
                <a href="#" className="hover:underline">About</a>
                <span>·</span>
                <a href="#" className="hover:underline">Help</a>
                <span>·</span>
                <a href="#" className="hover:underline">Privacy</a>
                <span>·</span>
                <a href="#" className="hover:underline">Terms</a>
              </div>
              <p className="text-xs text-[#94A3B8]">© 2026 Socialix</p>
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

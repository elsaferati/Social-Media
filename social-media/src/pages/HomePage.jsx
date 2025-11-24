import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout"; // Import the new Layout
import PostsFeed from "../components/PostsFeed";
import SuggestedUsers from "../components/SuggestedUsers";
import ModalSystem from "../components/ModalSystem";
import CreatePost from "../components/CreatePost";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:8800/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async (content) => {
    // ... your existing logic ...
    setIsCreatePostOpen(false); 
    window.location.reload();
  };

  // Fake Stories Data
  const stories = [1,2,3,4,5,6];

  return (
    <Layout>
      {/* CENTER COLUMN: Stories + Feed */}
      <div className="w-full max-w-[630px] flex flex-col gap-6">
        
        {/* Stories Rail */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 overflow-x-auto scrollbar-hide">
            {/* "Add Story" bubble */}
            <div className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer">
                <div className="w-16 h-16 rounded-full border-2 border-white ring-2 ring-gray-200 relative">
                    <img src={"https://i.pravatar.cc/150?u=" + currentUser?.id} className="w-full h-full rounded-full" alt="Me" />
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs border border-white">+</div>
                </div>
                <span className="text-xs text-gray-500">Your story</span>
            </div>
            {/* Other Stories */}
            {stories.map((s) => (
                <div key={s} className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer">
                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-600">
                        <img src={`https://i.pravatar.cc/150?img=${s + 10}`} className="w-full h-full rounded-full border-2 border-white" alt="story" />
                    </div>
                    <span className="text-xs text-gray-700 truncate w-16 text-center">user_{s}</span>
                </div>
            ))}
        </div>

        {/* Posts Feed */}
        <PostsFeed posts={posts} />
      </div>

      {/* RIGHT COLUMN: Suggestions (Hidden on small screens) */}
      <div className="hidden lg:block w-[320px] pl-4">
        
        {/* User Switcher Mini Profile */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <img src={"https://i.pravatar.cc/150?u=" + currentUser?.id} className="w-12 h-12 rounded-full" alt="" />
                <div>
                    <p className="font-semibold text-sm">{currentUser?.username}</p>
                    <p className="text-gray-500 text-sm">{currentUser?.name}</p>
                </div>
            </div>
            <button className="text-blue-500 text-xs font-bold hover:text-blue-700">Switch</button>
        </div>

        {/* Suggestions Component */}
        <SuggestedUsers /> 
        
        {/* Footer Links */}
        <div className="mt-8 text-xs text-gray-400">
            <p>© 2025 MY SOCIAL APP</p>
        </div>
      </div>

      {/* Modal Logic */}
      {isCreatePostOpen && (
        <ModalSystem onClose={() => setIsCreatePostOpen(false)}>
          <CreatePost onClose={() => setIsCreatePostOpen(false)} onPost={handleCreatePost} />
        </ModalSystem>
      )}
    </Layout>
  );
};

export default HomePage;
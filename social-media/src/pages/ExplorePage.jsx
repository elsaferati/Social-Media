import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PostsFeed from "../components/PostsFeed";
import SuggestedUsers from "../components/SuggestedUsers";
import { Compass } from "lucide-react";

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const res = await fetch("http://localhost:8800/api/posts/explore");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExplorePosts();
  }, []);

  return (
    <Layout>
      {/* LEFT: Main Explore Feed */}
      <div className="w-full max-w-[630px] flex flex-col gap-6">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white shadow-md mb-2 flex items-center justify-between">
           <div>
              <h1 className="text-2xl font-bold mb-1">Explore</h1>
              <p className="opacity-90 text-sm">Discover new people and inspiration.</p>
           </div>
           <Compass size={48} className="opacity-80" />
        </div>

        {/* Feed Content */}
        {loading ? (
          <div className="space-y-4">
             {/* Skeleton Loaders */}
             {[1,2].map(i => (
                 <div key={i} className="bg-white h-96 rounded-lg animate-pulse border border-gray-200"></div>
             ))}
          </div>
        ) : (
          <PostsFeed posts={posts} />
        )}
      </div>

      {/* RIGHT: Suggestions (Hidden on mobile) */}
      <div className="hidden lg:block w-[320px] pl-4">
         <SuggestedUsers />
      </div>
    </Layout>
  );
};

export default ExplorePage;
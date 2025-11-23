import React, { useState, useEffect } from "react";
import PostsFeed from "../components/PostsFeed";
import SuggestedUsers from "../components/SuggestedUsers";

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch random posts when page loads
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
    <div className="explore-page flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Explore</h1>
        <p className="text-gray-500 mb-6">Discover new posts from around the community.</p>
        
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading content...</div>
        ) : (
          <PostsFeed posts={posts} />
        )}
      </div>
      
      {/* Keep the Suggested Users sidebar here too, it fits the "Explore" theme */}
      <div className="w-full md:w-64 flex-shrink-0">
        <SuggestedUsers />
      </div>
    </div>
  );
};

export default ExplorePage;
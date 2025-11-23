import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PostsFeed from "../components/PostsFeed";
import SuggestedUsers from "../components/SuggestedUsers";
import ModalSystem from "../components/ModalSystem";
import CreatePost from "../components/CreatePost"; // Assuming you have this component

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { currentUser } = useAuth(); // Get the logged-in user

  // 1. Fetch Posts from Database
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
  }, []); // Empty brackets means run once on load

  // 2. Handle Creating a Post
  const handleCreatePost = async (content) => {
    try {
      await fetch("http://localhost:8800/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content,
          userId: currentUser.id // Attach the logged-in user's ID
        }),
      });
      
      // Refresh posts immediately after posting
      setIsCreatePostOpen(false);
      window.location.reload(); // Simple reload to show new post
    } catch (err) {
      console.log(err);
    }
  };

  // Dummy suggested users (we can make this real later)
  const suggestedUsers = [
    { id: 1, name: "Alice", username: "@alice" },
    { id: 2, name: "Bob", username: "@bob" },
  ];

  return (
    <div className="home-page flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Home</h1>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Post
          </button>
        </div>

        {/* Pass the REAL posts to your feed */}
        <PostsFeed posts={posts} />
      </div>

      <div className="w-full md:w-64 flex-shrink-0">
        <SuggestedUsers users={suggestedUsers} />
      </div>

      {isCreatePostOpen && (
        <ModalSystem onClose={() => setIsCreatePostOpen(false)}>
          <CreatePost onClose={() => setIsCreatePostOpen(false)} onPost={handleCreatePost} />
        </ModalSystem>
      )}
    </div>
  );
};

export default HomePage;
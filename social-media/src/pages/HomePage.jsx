import React, { useState } from "react";
import PostsFeed from "../components/PostsFeed";
import CreatePost from "../components/CreatePost";
import ModalSystem from "../components/ModalSystem";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState([
    { id: 1, content: "Hello world!", likes: 5, isLiked: false, userId: 2 },
    { id: 2, content: "My second post", likes: 2, isLiked: true, userId: 1 },
  ]);

  // Suggested users example
  const suggestedUsers = [
    { id: 1, name: "Alice", username: "@alice" },
    { id: 2, name: "Bob", username: "@bob" },
    { id: 3, name: "Charlie", username: "@charlie" },
  ];

  const handleCreatePost = (content) => {
    const newPost = {
      id: posts.length + 1,
      content,
      likes: 0,
      isLiked: false,
      userId: 1, // current user id
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="home-page flex flex-col md:flex-row gap-4">
      {/* Main feed */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Home</h1>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Post
          </button>
        </div>

        {/* Posts Feed */}
        <PostsFeed posts={posts} />
      </div>

      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <SuggestedUsers users={suggestedUsers} />
      </div>

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <ModalSystem onClose={() => setIsCreatePostOpen(false)}>
          <CreatePost
            onClose={() => setIsCreatePostOpen(false)}
            onPost={handleCreatePost}
          />
        </ModalSystem>
      )}
    </div>
  );
};

export default HomePage;

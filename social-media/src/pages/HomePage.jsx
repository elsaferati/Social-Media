import React, { useState } from "react";
import PostsFeed from "../components/PostsFeed";
import CreatePost from "../components/CreatePost";
import ModalSystem from "../components/ModalSystem";

const HomePage = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);

  return (
    <div className="home-page">
      <button
        onClick={openCreatePost}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create Post
      </button>

      <PostsFeed />

      {isCreatePostOpen && (
        <ModalSystem onClose={closeCreatePost}>
          <CreatePost onClose={closeCreatePost} />
        </ModalSystem>
      )}
    </div>
  );
};

export default HomePage;

import React, { useState } from "react";
import PostsFeed from "../components/PostsFeed";
import CreatePost from "../components/CreatePost";
import ModalSystem from "../components/ModalSystem";

const HomePage = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <div className="home-page">
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create Post
      </button>

      <PostsFeed />

      {isCreatePostOpen && (
        <ModalSystem onClose={() => setIsCreatePostOpen(false)}>
          <CreatePost onClose={() => setIsCreatePostOpen(false)} />
        </ModalSystem>
      )}
    </div>
  );
};

export default HomePage;

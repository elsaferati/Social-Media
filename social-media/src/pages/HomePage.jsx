import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PostsFeed from "../components/PostsFeed";
import CreatePost from "../components/CreatePost";
import ModalSystem from "../components/ModalSystem";

const HomePage = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);

  return (
    <div className="home-page flex flex-col h-screen">
      {/* Header */}
      <Header />

      <div className="content flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Feed */}
        <main className="flex-1 p-4">
          <button
            onClick={openCreatePost}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Create Post
          </button>

          <PostsFeed />
        </main>
      </div>

      {/* Modal for creating post */}
      {isCreatePostOpen && (
        <ModalSystem onClose={closeCreatePost}>
          <CreatePost onClose={closeCreatePost} />
        </ModalSystem>
      )}
    </div>
  );
};

export default HomePage;

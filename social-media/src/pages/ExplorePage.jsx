import React from "react";
import PostsFeed from "../components/PostsFeed";
import SuggestedUsers from "../components/SuggestedUsers";

const ExplorePage = () => {
  const posts = [
    { id: 1, content: "Explore post 1", likes: 3, isLiked: false, userId: 2 },
    { id: 2, content: "Explore post 2", likes: 5, isLiked: true, userId: 3 },
  ];

  const suggestedUsers = [
    { id: 1, name: "Alice", username: "@alice" },
    { id: 2, name: "Bob", username: "@bob" },
  ];

  return (
    <div className="explore-page flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <PostsFeed posts={posts} />
      </div>
      <div className="w-full md:w-64 flex-shrink-0">
        <SuggestedUsers users={suggestedUsers} />
      </div>
    </div>
  );
};

export default ExplorePage;

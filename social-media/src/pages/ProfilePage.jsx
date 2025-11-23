import React, { useState } from "react";
import PostsFeed from "../components/PostsFeed";
import ProfileHeader from "../components/ProfileHeader";
import SuggestedUsers from "../components/SuggestedUsers";

const ProfilePage = () => {
  const [posts, setPosts] = useState([
    { id: 1, content: "My first profile post", likes: 5, isLiked: false, userId: 1 },
    { id: 2, content: "Another post", likes: 2, isLiked: true, userId: 1 },
  ]);

  const suggestedUsers = [
    { id: 2, name: "Bob", username: "@bob" },
    { id: 3, name: "Charlie", username: "@charlie" },
  ];

  return (
    <div className="profile-page flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <ProfileHeader />
        <PostsFeed posts={posts} />
      </div>
      <div className="w-full md:w-64 flex-shrink-0">
        <SuggestedUsers users={suggestedUsers} />
      </div>
    </div>
  );
};

export default ProfilePage;

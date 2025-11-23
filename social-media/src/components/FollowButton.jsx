import React, { useState } from "react";

const FollowButton = ({ initialFollowed = false }) => {
  const [isFollowed, setIsFollowed] = useState(initialFollowed);

  const toggleFollow = () => setIsFollowed(!isFollowed);

  return (
    <button
      onClick={toggleFollow}
      className={`px-4 py-2 rounded ${isFollowed ? "bg-gray-300" : "bg-blue-500 text-white"}`}
    >
      {isFollowed ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;

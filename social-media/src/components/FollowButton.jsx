import React, { useState } from "react";

const FollowButton = ({ initialFollowed = false }) => {
  const [isFollowed, setIsFollowed] = useState(initialFollowed);

  const toggleFollow = () => setIsFollowed(!isFollowed);

  return (
    <button
      onClick={toggleFollow}
      className={`
        px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
        ${isFollowed 
            ? "bg-gray-100 text-black hover:bg-gray-200 border border-gray-200" // "Following" state
            : "bg-blue-500 text-white hover:bg-blue-600" // "Follow" state
        }
      `}
    >
      {isFollowed ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
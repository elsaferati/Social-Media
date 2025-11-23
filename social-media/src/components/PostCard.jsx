import React, { useState } from "react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    // TODO: Call backend API to persist like/unlike
  };

  return (
    <div className="post-card p-4 border mb-4 rounded">
      <p>{post.content}</p>
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={toggleLike}
          className={`px-2 py-1 rounded ${liked ? "bg-red-500 text-white" : "bg-gray-200"}`}
        >
          {liked ? "Unlike" : "Like"} ({likesCount})
        </button>
      </div>
    </div>
  );
};

export default PostCard;

import React, { useState } from "react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="post-card p-4 border mb-4 rounded">
      <p>{post.content}</p>
      <button
        onClick={toggleLike}
        className={`px-2 py-1 rounded mt-2 ${liked ? "bg-red-500 text-white" : "bg-gray-200"}`}
      >
        {liked ? "Unlike" : "Like"} ({likesCount})
      </button>
    </div>
  );
};

export default PostCard;

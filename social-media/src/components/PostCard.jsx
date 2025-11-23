import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4 border">
      <div className="flex items-center gap-3 mb-2">
        <div className="font-bold">{post.username || "Unknown User"}</div>
        <div className="text-gray-500 text-xs">
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
      <p className="text-gray-800">{post.content}</p>
    </div>
  );
};

export default PostCard;
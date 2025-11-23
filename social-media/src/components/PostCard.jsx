import React from "react";

function PostCard({ post }) {
  return (
    <div className="card p-4 mb-4">
      <div className="flex gap-3">
        <img
          src={post.avatar}
          alt="User"
          className="w-12 h-12 rounded-full"
        />

        <div className="flex-1">
          <h4 className="font-semibold">{post.name}</h4>
          <p className="mt-2">{post.content}</p>

          <div className="flex gap-6 mt-3 text-gray-600 text-sm">
            <button className="hover:text-blue-500">Like</button>
            <button className="hover:text-blue-500">Comment</button>
            <button className="hover:text-blue-500">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;

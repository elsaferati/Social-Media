import React, { useState } from "react";
import PostCard from "./PostCard";

const PostsFeed = ({ filter, userId }) => {
  const initialPosts = [
    { id: 1, content: "Hello world!", likes: 5, isLiked: false, userId: 2 },
    { id: 2, content: "My second post", likes: 2, isLiked: true, userId: 1 },
  ];

  const [posts] = useState(initialPosts);

  const displayedPosts = posts.filter(post => {
    if (filter === "user" && userId) return post.userId === parseInt(userId);
    return true;
  });

  return (
    <div className="posts-feed">
      {displayedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsFeed;

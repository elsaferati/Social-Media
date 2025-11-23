import React from "react";
import PostCard from "./PostCard";

const PostsFeed = ({ posts, filter, userId }) => {
  // Apply filter if needed
  const displayedPosts = posts?.filter(post => {
    if (filter === "user" && userId) return post.userId === parseInt(userId);
    if (filter === "bookmarks") return post.isBookmarked;
    return true;
  }) || [];

  return (
    <div className="posts-feed flex flex-col gap-4">
      {displayedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsFeed;

import React, { useState } from "react";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

function PostsFeed() {
  const [posts, setPosts] = useState([]);

  const addPost = (text) => {
    const newPost = {
      id: Date.now(),
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150",
      content: text,
      createdAt: new Date(),
    };

    setPosts([newPost, ...posts]);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <CreatePost onCreate={addPost} />

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostsFeed;

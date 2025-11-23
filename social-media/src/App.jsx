import React, { useState } from "react";

function CreatePost({ onCreate }) {
  const [postContent, setPostContent] = useState("");

  const handlePost = () => {
    if (postContent.trim()) {
      onCreate(postContent); // send text to feed
      setPostContent("");
    }
  };

  return (
    <div className="card p-4 mb-4">
      <div className="flex gap-3">
        <img
          src="https://i.pravatar.cc/150?img=1"
          alt="User"
          className="w-12 h-12 rounded-full"
        />

        <div className="flex-1">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border-none focus:outline-none resize-none text-lg"
            rows={3}
          />

          <div className="flex justify-end mt-3 pt-3 border-t border-gray-300">
            <button onClick={handlePost} className="btn-primary px-4 py-1">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;

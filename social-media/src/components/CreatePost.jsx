import React, { useState } from "react";

function CreatePost() {
  const [postContent, setPostContent] = useState("");

  const handlePost = () => {
    if (postContent.trim()) {
      alert("Post created successfully!");
      setPostContent("");
    }
  };

  return (
    <div
      className="card p-4"
      data-name="create-post"
      data-file="components/CreatePost.js"
    >
      <div className="flex gap-3">
        {/* User Avatar */}
        <img
          src="https://i.pravatar.cc/150?img=1"
          alt="User"
          className="w-12 h-12 rounded-full"
        />

        {/* Post Input */}
        <div className="flex-1">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border-none focus:outline-none resize-none text-lg"
            rows={3}
          />

          {/* Bottom Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full hover:bg-[var(--secondary-color)] flex items-center justify-center">
                <div className="icon-image text-xl text-[var(--primary-color)]"></div>
              </button>

              <button className="w-9 h-9 rounded-full hover:bg-[var(--secondary-color)] flex items-center justify-center">
                <div className="icon-smile text-xl text-[var(--primary-color)]"></div>
              </button>

              <button className="w-9 h-9 rounded-full hover:bg-[var(--secondary-color)] flex items-center justify-center">
                <div className="icon-map-pin text-xl text-[var(--primary-color)]"></div>
              </button>
            </div>

            <button onClick={handlePost} className="btn-primary">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;

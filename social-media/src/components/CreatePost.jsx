import React, { useState } from "react";

const CreatePost = ({ onClose, onPost }) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim() === "") return;
    onPost && onPost(content);
    setContent("");
    onClose && onClose();
  };

  return (
    <div className="create-post flex flex-col">
      <textarea
        className="border p-2 mb-2 rounded"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;

import React, { useState } from "react";
import { Image, MapPin, Smile } from "lucide-react"; // Icons for "feel"

const CreatePost = ({ onClose, onPost }) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim() === "") return;
    onPost && onPost(content);
    setContent("");
    onClose && onClose();
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden flex flex-col h-[70vh] md:h-auto">
      
      {/* Header */}
      <div className="border-b border-gray-200 p-3 flex justify-between items-center bg-white">
        <button onClick={onClose} className="text-gray-500 md:hidden">Cancel</button>
        <span className="font-semibold text-gray-700 mx-auto md:mx-0">Create new post</span>
        <button 
          onClick={handleSubmit} 
          className="text-blue-500 font-bold hover:text-blue-700 text-sm"
        >
          Share
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* User Info Row */}
        <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=me" alt="" className="w-full h-full object-cover"/>
            </div>
            <span className="font-semibold text-sm text-gray-800">my_username</span>
        </div>

        {/* Text Area - Modern & Borderless */}
        <textarea
          className="w-full flex-1 resize-none outline-none text-base placeholder-gray-400"
          placeholder="Write a caption..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />

        {/* Tools Row (Visual enhancement) */}
        <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
            <div className="flex gap-4 text-gray-400">
                <Smile size={24} className="cursor-pointer hover:text-gray-600"/>
                <Image size={24} className="cursor-pointer hover:text-gray-600"/>
                <MapPin size={24} className="cursor-pointer hover:text-gray-600"/>
            </div>
            <span className="text-xs text-gray-400">{content.length}/2200</span>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
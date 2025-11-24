import React, { useState } from "react";
import { Smile, Image } from "lucide-react"; // install lucide-react if needed

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white">
      {/* Cosmetic Icons */}
      <button className="text-gray-400 hover:text-gray-600 transition">
        <Smile size={24} />
      </button>
      
      {/* Input Field (Pill Shape) */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message..."
          className="w-full bg-gray-100 text-gray-800 rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-gray-300 transition placeholder-gray-500"
        />
        {/* Optional Image Icon inside the input logic could go here */}
      </div>

      {/* Send Button */}
      {text.trim().length > 0 ? (
        <button 
          onClick={handleSend} 
          className="text-blue-500 font-semibold px-2 hover:text-blue-700 transition"
        >
          Send
        </button>
      ) : (
        <button className="text-gray-400 hover:text-gray-600 transition">
          <Image size={24} />
        </button>
      )}
    </div>
  );
};

export default MessageInput;
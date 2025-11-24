import React from "react";

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex w-full ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`
          relative max-w-[70%] px-4 py-2 text-sm shadow-sm
          ${isOwn 
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-l-2xl rounded-tr-2xl rounded-br-sm" 
            : "bg-gray-100 text-gray-800 rounded-r-2xl rounded-tl-2xl rounded-bl-sm border border-gray-200"
          }
        `}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
import React from "react";

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div
      className={`p-2 m-1 max-w-xs rounded-lg ${
        isOwn ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
      }`}
    >
      {message.text}
    </div>
  );
};

export default MessageBubble;

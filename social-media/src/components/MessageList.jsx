import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col gap-1">
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 mt-10">
            <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center mb-2">
                <i className="fa-regular fa-paper-plane text-2xl"></i>
            </div>
            <p>No messages yet.</p>
            <p className="text-xs">Start the conversation!</p>
        </div>
      )}
      
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg}
          isOwn={msg.userId === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
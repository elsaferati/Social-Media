import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col p-2">
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

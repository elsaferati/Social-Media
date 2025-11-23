import React, { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatWindow = ({ currentUserId = 1 }) => {
  const [messages, setMessages] = useState([
    { userId: 2, text: "Hi there!" },
    { userId: 1, text: "Hello!" },
  ]);

  const handleSend = (text) => {
    setMessages([...messages, { userId: currentUserId, text }]);
  };

  return (
    <div className="chat-window flex flex-col h-full border rounded">
      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;

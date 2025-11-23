import React from "react";
import ChatWindow from "../components/ChatWindow";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const MessagesPage = () => {
  return (
    <div className="messages-page flex h-full">
      <ChatWindow>
        <MessageList />
        <MessageInput />
      </ChatWindow>
    </div>
  );
};

export default MessagesPage;

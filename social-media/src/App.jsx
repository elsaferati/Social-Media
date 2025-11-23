import React, { useState } from "react";
import './App.css'
import MessageList from "./components/MessageList";
import ChatWindow from "./components/ChatWindow";
import ProfileHeader from './components/ProfileHeader.jsx'
import Header from './components/Header.jsx'
import CreatePost from "./components/CreatePost";
import PostsFeed from "./components/PostsFeed";

function App() {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);

    // Example messages
    setMessages([
      { sender: "them", text: chat.lastMessage },
      { sender: "me", text: "Sure, let's do it!" },
    ]);
  };

  const handleSend = (text) => {
    setMessages((prev) => [...prev, { sender: "me", text }]);
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-[300px_1fr]">
      <Header />
      <ProfileHeader />
      <CreatePost />
      <PostsFeed />
      {/* Chat List */}
      <MessageList onSelectChat={handleSelectChat} />

      {/* Chat Window */}
      <ChatWindow
        chat={activeChat}
        messages={messages}
        onSend={handleSend}
      />
    </div>
  );
}

export default App;

import React from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

function ChatWindow({ chat, messages, onSend }) {
  if (!chat) {
    return (
      <div className="flex items-center justify-center text-[var(--text-secondary)]">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-3">
        <img src={chat.avatar} className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-bold">{chat.name}</h2>
          <p className="text-sm text-[var(--text-secondary)]">{chat.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            message={msg}
            isSender={msg.sender === "me"}
          />
        ))}
      </div>

      {/* Input */}
      <MessageInput onSend={onSend} />
    </div>
  );
}

export default ChatWindow;

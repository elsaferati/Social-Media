import React, { useState } from "react";

function MessageList({ onSelectChat }) {
  const [chats] = useState([
    {
      id: 1,
      name: "Michael Chen",
      username: "@mchen",
      avatar: "https://i.pravatar.cc/150?img=2",
      lastMessage: "That sounds great!",
      time: "2m ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Emma Wilson",
      username: "@emmaw",
      avatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "See you tomorrow!",
      time: "1h ago",
      unread: 0,
    },
    {
      id: 3,
      name: "Alex Turner",
      username: "@alexturner",
      avatar: "https://i.pravatar.cc/150?img=4",
      lastMessage: "Thanks for the help",
      time: "3h ago",
      unread: 0,
    },
  ]);

  return (
    <div
      className="border-r border-[var(--border-color)] overflow-y-auto"
      data-name="message-list"
      data-file="components/MessageList.js"
    >
      <div className="p-4 border-b border-[var(--border-color)]">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>

      <div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className="p-4 hover:bg-[var(--hover-bg)] cursor-pointer border-b border-[var(--border-color)] transition-all"
          >
            <div className="flex items-center gap-3">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {chat.time}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--text-secondary)] truncate">
                    {chat.lastMessage}
                  </p>

                  {chat.unread > 0 && (
                    <span className="bg-[var(--primary-color)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageList;

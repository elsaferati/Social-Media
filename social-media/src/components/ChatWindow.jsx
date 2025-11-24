import React, { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { MoreVertical, Phone, Video } from "lucide-react"; // install lucide-react if needed

const ChatWindow = ({ currentUserId = 1 }) => {
  // KEEPING YOUR DYNAMIC DATA LOGIC
  const [messages, setMessages] = useState([
    { userId: 2, text: "Hi there!" },
    { userId: 1, text: "Hello!" },
  ]);

  const handleSend = (text) => {
    setMessages([...messages, { userId: currentUserId, text }]);
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* 1. Header Area (Mocking a real chat header) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
           {/* Placeholder Avatar */}
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-blue-500"></div>
           <span className="font-semibold text-gray-800">Chat User</span>
        </div>
        <div className="flex gap-4 text-gray-400">
           <Phone size={20} className="cursor-pointer hover:text-black" />
           <Video size={20} className="cursor-pointer hover:text-black" />
           <MoreVertical size={20} className="cursor-pointer hover:text-black" />
        </div>
      </div>

      {/* 2. Messages Area */}
      {/* We pass specific styling props down via context or handle it in MessageList. 
          Assuming MessageList maps through these: */}
      <div className="flex-1 overflow-y-auto bg-white p-4">
        <MessageList 
            messages={messages} 
            currentUserId={currentUserId} 
            // You might need to update MessageList to use these classes for bubbles:
            // Mine: "bg-blue-500 text-white self-end rounded-l-2xl rounded-tr-2xl"
            // Theirs: "bg-gray-100 text-gray-800 self-start rounded-r-2xl rounded-tl-2xl"
        />
      </div>

      {/* 3. Input Area */}
      <div className="p-3 border-t border-gray-100">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatWindow;
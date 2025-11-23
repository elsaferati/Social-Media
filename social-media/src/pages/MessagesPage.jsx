import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const MessagesPage = () => {
  const { currentUser } = useAuth();
  
  // State
  const [friends, setFriends] = useState([]); // List of people to chat with
  const [selectedUser, setSelectedUser] = useState(null); // Who are we chatting with?
  const [messages, setMessages] = useState([]); // The actual chat history
  const [newMessage, setNewMessage] = useState(""); // Input box text

  const scrollRef = useRef(); // To auto-scroll to bottom

  // 1. Fetch Friends (People I follow)
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`http://localhost:8800/api/users/friends/${currentUser.id}`);
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFriends();
  }, [currentUser.id]);

  // 2. Fetch Messages (Runs when selectedUser changes, AND every 2 seconds)
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:8800/api/messages?senderId=${currentUser.id}&receiverId=${selectedUser.id}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages(); // Run once immediately

    // Polling: Check for new messages every 2 seconds
    const intervalId = setInterval(fetchMessages, 2000);

    // Cleanup: Stop checking when we leave the page or change user
    return () => clearInterval(intervalId);

  }, [selectedUser, currentUser.id]);

  // 3. Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await fetch("http://localhost:8800/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: selectedUser.id,
          content: newMessage,
        }),
      });

      // Clear input and refresh messages manually immediately
      setNewMessage("");
      const res = await fetch(
        `http://localhost:8800/api/messages?senderId=${currentUser.id}&receiverId=${selectedUser.id}`
      );
      const data = await res.json();
      setMessages(data);
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="messages-page h-[calc(100vh-80px)] flex bg-white border rounded shadow overflow-hidden m-4">
      {/* LEFT SIDE: Friends List */}
      <div className="w-1/3 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b font-bold text-lg bg-white">Chats</div>
        <div className="flex-1 overflow-y-auto">
          {friends.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">Follow someone to start chatting!</p>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => setSelectedUser(friend)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition ${
                  selectedUser?.id === friend.id ? "bg-blue-100" : ""
                }`}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                  {friend.username[0].toUpperCase()}
                </div>
                <span className="font-semibold">{friend.username}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Chat Window */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-100 font-bold flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                 {selectedUser.username[0].toUpperCase()}
              </div>
              {selectedUser.username}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10">Say Hello! 👋</div>
              )}
              
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    ref={scrollRef}
                    className={`max-w-[70%] p-3 rounded-lg text-sm ${
                      isMe
                        ? "bg-blue-500 text-white self-end rounded-tr-none"
                        : "bg-gray-200 text-gray-800 self-start rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <form className="p-4 border-t flex gap-2 bg-gray-50" onSubmit={handleSend}>
              <input
                type="text"
                className="flex-1 border p-2 rounded focus:outline-blue-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 font-bold">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a friend to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
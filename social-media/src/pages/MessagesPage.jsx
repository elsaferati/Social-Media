import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Search, MoreHorizontal, Send, Image } from "lucide-react"; 
import { userAPI, messageAPI } from "../services/api";

const MessagesPage = () => {
  const { currentUser } = useAuth();
  
  const [friends, setFriends] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(); 

  // 1. Fetch Friends
  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser?.id) return;
      
      try {
        const data = await userAPI.getFriends(currentUser.id);
        setFriends(data);
      } catch (err) {
        console.error('Error fetching friends:', err);
      }
    };
    fetchFriends();
  }, [currentUser]);

  // 2. Fetch Messages
  useEffect(() => {
    if (!selectedUser || !currentUser?.id) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await messageAPI.getMessages(currentUser.id, selectedUser.id);
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000);
    return () => clearInterval(intervalId);
  }, [selectedUser, currentUser?.id]);

  // 3. Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await messageAPI.send(currentUser.id, selectedUser.id, newMessage);
      setNewMessage("");
      
      // Immediate fetch update
      const data = await messageAPI.getMessages(currentUser.id, selectedUser.id);
      setMessages(data);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      {/* Container - Fixed Height for Chat feel */}
      <div className="w-full h-[85vh] bg-white border border-gray-200 rounded-xl overflow-hidden flex shadow-sm">
        
        {/* LEFT: Conversation List */}
        <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedUser ? "hidden md:flex" : "flex"}`}>
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
             <div className="font-bold text-lg flex items-center gap-1">
                 {currentUser?.username} <span className="text-xs">▼</span>
             </div>
             <Search size={20} className="text-gray-400" />
          </div>
          
          {/* List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 flex items-center justify-between">
                <span className="font-bold text-base">Messages</span>
                <span className="text-gray-500 text-sm font-semibold">Requests</span>
            </div>
            
            {friends.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                    No friends found. Follow people to chat!
                </div>
            ) : (
                friends.map((friend) => (
                <div
                    key={friend.id}
                    onClick={() => setSelectedUser(friend)}
                    className={`px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition ${
                    selectedUser?.id === friend.id ? "bg-gray-50" : ""
                    }`}
                >
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 to-pink-500 rounded-full p-[2px]">
                            <img 
                              src={friend.profilePic || "https://i.pravatar.cc/150?u=" + friend.id} 
                              className="w-full h-full rounded-full border-2 border-white object-cover" 
                              alt="" 
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="font-normal text-sm">{friend.username}</div>
                        <div className="text-gray-400 text-xs">Active recently</div>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* RIGHT: Chat Window */}
        <div className={`w-full md:w-2/3 flex flex-col ${!selectedUser ? "hidden md:flex" : "flex"}`}>
            {selectedUser ? (
                <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        {/* Back button for Mobile */}
                        <button onClick={() => setSelectedUser(null)} className="md:hidden text-2xl pr-2">←</button>
                        
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src={selectedUser.profilePic || "https://i.pravatar.cc/150?u=" + selectedUser.id} 
                              className="w-full h-full object-cover" 
                              alt="" 
                            />
                        </div>
                        <div className="font-semibold text-sm">{selectedUser.username}</div>
                    </div>
                    <MoreHorizontal size={24} className="text-gray-800" />
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-white">
                    {loading && messages.length === 0 ? (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 flex items-center justify-center text-4xl">👋</div>
                            <h3 className="text-lg font-medium">Say Hello!</h3>
                            <p className="text-gray-500 text-sm">Send a message to start the chat.</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.senderId === currentUser.id;
                            return (
                                <div
                                    key={msg.id}
                                    ref={scrollRef}
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                                    isMe
                                        ? "bg-blue-500 text-white self-end rounded-br-sm"
                                        : "bg-gray-100 text-black self-start rounded-bl-sm border border-gray-200"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <form className="p-4 flex items-center gap-3 bg-white border-t border-gray-100" onSubmit={handleSend}>
                    <button type="button" className="text-gray-400 hover:text-gray-600"><Image size={24} /></button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
                            placeholder="Message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                    </div>
                    <button 
                      type="submit"
                      disabled={!newMessage.trim() || sending} 
                      className="text-blue-500 font-semibold text-sm disabled:opacity-30 hover:text-blue-700"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                </form>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-4">
                        <Send size={40} className="ml-1 mt-1" />
                    </div>
                    <h2 className="text-xl font-light">Your Messages</h2>
                    <p className="text-gray-500 text-sm mt-2">Send private photos and messages to a friend.</p>
                </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;

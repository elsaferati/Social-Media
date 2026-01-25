import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Search, MoreHorizontal, Send, Image, Phone, Video, ArrowLeft, Smile } from "lucide-react"; 
import { userAPI, messageAPI } from "../services/api";

const MessagesPage = () => {
  const { currentUser } = useAuth();
  
  const [friends, setFriends] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(); 

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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await messageAPI.send(currentUser.id, selectedUser.id, newMessage);
      setNewMessage("");
      
      const data = await messageAPI.getMessages(currentUser.id, selectedUser.id);
      setMessages(data);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const filteredFriends = friends.filter(f => 
    f.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex gap-4">
        {/* Conversations List */}
        <div className={`w-full md:w-80 flex-shrink-0 card-flat flex flex-col ${selectedUser ? "hidden md:flex" : "flex"}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <MoreHorizontal size={20} className="text-gray-500" />
              </button>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all"
              />
            </div>
          </div>
          
          {/* Friends List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filteredFriends.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Send size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  {searchQuery ? 'No conversations found' : 'No friends yet. Follow people to chat!'}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedUser(friend)}
                    className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all ${
                      selectedUser?.id === friend.id 
                        ? "bg-indigo-50 border-2 border-indigo-200" 
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    <div className="relative">
                      <div className="avatar-ring">
                        <img 
                          src={friend.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`} 
                          className="w-12 h-12 rounded-full object-cover" 
                          alt="" 
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{friend.username}</p>
                      <p className="text-xs text-gray-500 truncate">Active now</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 card-flat flex flex-col ${!selectedUser ? "hidden md:flex" : "flex"}`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedUser(null)} 
                    className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="avatar-ring">
                    <img 
                      src={selectedUser.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`} 
                      className="w-10 h-10 rounded-full object-cover" 
                      alt="" 
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedUser.username}</p>
                    <p className="text-xs text-green-500">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                    <MoreHorizontal size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin bg-gradient-to-b from-gray-50/50 to-white">
                {loading && messages.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                      <span className="text-4xl">👋</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Start a conversation</h3>
                    <p className="text-gray-500 text-sm">Send a message to {selectedUser.username}</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser.id;
                    const showAvatar = !isMe && (index === 0 || messages[index - 1]?.senderId !== msg.senderId);
                    
                    return (
                      <div
                        key={msg.id}
                        ref={scrollRef}
                        className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                      >
                        {!isMe && showAvatar && (
                          <img 
                            src={selectedUser.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`}
                            className="w-7 h-7 rounded-full object-cover"
                            alt=""
                          />
                        )}
                        {!isMe && !showAvatar && <div className="w-7" />}
                        <div
                          className={`max-w-[70%] px-4 py-2.5 text-sm ${
                            isMe
                              ? "gradient-bg text-white rounded-2xl rounded-br-md shadow-md shadow-indigo-200"
                              : "bg-white text-gray-900 rounded-2xl rounded-bl-md border border-gray-200 shadow-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input */}
              <form className="p-4 border-t border-gray-100 flex items-center gap-3" onSubmit={handleSend}>
                <button type="button" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Image size={22} className="text-gray-500" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Smile size={20} className="text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim() || sending} 
                  className="p-3 gradient-bg text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-200 transition-all"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-28 h-28 gradient-bg rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-200">
                <Send size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
              <p className="text-gray-500 max-w-sm">
                Send private photos and messages to a friend or group.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar"; 
import { Menu, Heart, Send } from "lucide-react"; // Clean icons

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  return (
    <>
      {/* Main Header Container */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 h-14 flex justify-between items-center md:hidden">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-800">
             <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold font-[cursive] mt-1">My Social App</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
           {/* Notification Heart */}
           <div className="relative cursor-pointer">
              <Heart size={24} className="text-gray-800 hover:text-red-500 transition"/>
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
           </div>
           {/* Messages Icon */}
           <div className="relative cursor-pointer">
              <Send size={22} className="text-gray-800 -rotate-12 hover:text-blue-500 transition"/>
              <span className="absolute -top-1.5 -right-1 bg-red-500 text-[10px] text-white font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">2</span>
           </div>
        </div>
      </header>

      {/* Mobile Drawer (Sidebar) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative bg-white w-[280px] h-full shadow-2xl flex flex-col animate-slide-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 text-2xl">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
               <Sidebar /> {/* Reusing your Sidebar content here */}
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                        {/* If dynamic, use currentUser.img */}
                        <img src="https://i.pravatar.cc/150?u=me" alt="" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">{currentUser ? currentUser.username : "Guest"}</span>
                        <span className="text-xs text-gray-500">View Profile</span>
                    </div>
                </div>
                <button 
                  onClick={logout} 
                  className="w-full py-2 text-center text-red-500 border border-red-100 rounded-lg hover:bg-red-50 text-sm font-semibold"
                >
                  Log Out
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
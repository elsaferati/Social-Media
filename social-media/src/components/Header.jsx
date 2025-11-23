import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar"; // Import Sidebar here to use in mobile view

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center z-50 relative">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden text-gray-700 text-xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          &#9776;
        </button>
        <h1 className="text-xl font-bold text-blue-600">My Social App</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-700 hidden md:block">
          {currentUser ? `Hello, ${currentUser.username}` : "Guest"}
        </span>
        <button 
          onClick={logout} 
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="bg-gray-100 w-64 p-4 h-full shadow-lg transform transition-transform" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
            <button
              className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-800 rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              Close Menu
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
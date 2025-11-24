import React from "react";
import Sidebar from "./Sidebar";

// This wrapper should wrap your Routes in App.js or specific pages
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area - Shifted right to account for fixed sidebar */}
      <main className="flex-1 ml-16 md:ml-64 flex justify-center">
        <div className="w-full max-w-[950px] py-8 px-4 md:px-8 flex gap-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50">
        <Header />
      </div>

      {/* Left Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-20 lg:ml-72 flex justify-center w-full transition-all duration-300">
        <div className="w-full max-w-[1000px] py-6 px-4 md:px-8 animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

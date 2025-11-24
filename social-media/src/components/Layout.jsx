import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Assuming you have this for Mobile view

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa] text-gray-900 font-sans">
      
      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden sticky top-0 z-50">
        <Header />
      </div>

      {/* Left Sidebar (Hidden on mobile, Fixed on Desktop) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      {/* md:ml-[250px] accounts for the sidebar width */}
      <main className="flex-1 md:ml-[70px] lg:ml-[250px] flex justify-center w-full">
        <div className="w-full max-w-[950px] py-6 px-4 md:px-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
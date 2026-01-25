import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50">
        <Header />
      </div>

      {/* Desktop Sidebar - Fixed with solid background */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-[#E2E8F0] z-40 flex-col">
        <Sidebar />
      </aside>

      {/* Main Content - Properly offset and centered */}
      <main className="lg:ml-[260px] min-h-screen">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

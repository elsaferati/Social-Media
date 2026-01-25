import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50">
        <Header />
      </div>

      {/* Desktop Sidebar - Fixed position with solid background */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[#E5E7EB] z-40">
        <Sidebar />
      </aside>

      {/* Main Content Area - Properly offset from sidebar */}
      <main className="lg:ml-[280px] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

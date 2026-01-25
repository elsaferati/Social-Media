import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar - Fixed */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="max-w-[1400px] mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

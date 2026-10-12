'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/src/components/admin/AdminSidebar';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { Footer } from '@/src/components/layout/footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAF9F6] overflow-hidden text-[#2A2B2F] font-sans">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
    

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
              
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

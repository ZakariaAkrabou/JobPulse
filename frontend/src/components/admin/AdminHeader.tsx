'use client';

import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface AdminHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export function AdminHeader({ setSidebarOpen }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-[#E5E1D8] transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#6B6B72] hover:text-[#2A2B2F] hover:bg-[#F2EFE9] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center px-4 py-2 bg-white rounded-full border border-[#E5E1D8] focus-within:border-[#3F5D9E] focus-within:ring-2 focus-within:ring-[#3F5D9E]/20 transition-all">
          <Search className="w-5 h-5 text-[#6B6B72]" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none ml-2 text-sm text-[#2A2B2F] placeholder-[#6B6B72] w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full text-[#6B6B72] hover:text-[#3F5D9E] hover:bg-[#3F5D9E]/10 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#FAF9F6] rounded-full" />
        </button>

        <div className="h-8 w-px bg-[#E5E1D8]" />

        <button className="flex items-center gap-3 hover:bg-[#F2EFE9] p-1.5 rounded-full lg:rounded-xl transition-colors group">
          <div className="w-9 h-9 rounded-full bg-[#3F5D9E] flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden lg:block text-left mr-2">
            <p className="text-sm font-semibold text-[#2A2B2F]">Admin User</p>
            <p className="text-xs text-[#6B6B72]">admin@jobpulse.com</p>
          </div>
        </button>
      </div>
    </header>
  );
}

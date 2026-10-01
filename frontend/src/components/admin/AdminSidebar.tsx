'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  FileText,
  LogOut,
  X
} from 'lucide-react';

import { cn } from '@/src/lib/utils';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#2A2B2F]/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-[#FAF9F6] border-r border-[#E5E1D8] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 h-20 border-b border-[#E5E1D8]">
          <Link href="/admin" className="font-serif text-2xl tracking-tight text-[#2A2B2F] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-sm cursor-pointer">
            Job<span className="italic text-[#3F5D9E]">Pulse</span> Admin
          </Link>
          <button 
            className="lg:hidden text-[#6B6B72] hover:text-[#2A2B2F]"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-[#3F5D9E]/10 text-[#3F5D9E] font-medium" 
                    : "text-[#6B6B72] hover:bg-[#F2EFE9] hover:text-[#2A2B2F]"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#3F5D9E] rounded-r-full" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-[#3F5D9E]" : "text-[#6B6B72] group-hover:text-[#2A2B2F]"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E5E1D8]">
          <Link href="/">
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Exit Admin</span>
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}

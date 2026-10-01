'use client';

import React, { useState } from 'react';
import { Save, User, Bell, Shield, Mail, Globe, Monitor, Key, Lock, BellRing, Smartphone, CheckSquare, Briefcase } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const navItems = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'defaults', label: 'Platform Defaults', icon: Globe },
    { id: 'email', label: 'Email Templates', icon: Mail },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2A2B2F]">
            Settings
          </h1>
          <p className="text-sm text-[#6B6B72] mt-1">
            Manage your account settings and platform preferences.
          </p>
        </div>
        <button className="px-4 py-2 bg-[#3F5D9E] hover:bg-[#2B4375] text-white rounded-xl text-sm font-medium shadow-sm transition-all hover:shadow-md flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left whitespace-nowrap",
                    isActive 
                      ? "bg-[#3F5D9E]/10 text-[#3F5D9E] font-medium" 
                      : "text-[#6B6B72] hover:bg-[#F2EFE9] hover:text-[#2A2B2F]"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#2A2B2F] mb-6">Profile Information</h2>
                
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-[#3F5D9E] flex items-center justify-center text-white text-3xl font-bold shadow-sm">
                      A
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-[#E5E1D8] rounded-lg text-xs font-medium text-[#2A2B2F] shadow-sm hover:bg-[#F2EFE9] transition-colors">
                      Change Avatar
                    </button>
                  </div>

                  <div className="flex-1 space-y-5 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#2A2B2F]">First Name</label>
                        <input type="text" defaultValue="Admin" className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] transition-all text-[#2A2B2F]" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#2A2B2F]">Last Name</label>
                        <input type="text" defaultValue="User" className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] transition-all text-[#2A2B2F]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#2A2B2F]">Email Address</label>
                      <input type="email" defaultValue="admin@jobpulse.com" className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] transition-all text-[#2A2B2F]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#2A2B2F]">Role / Title</label>
                      <input type="text" defaultValue="Super Administrator" readOnly className="w-full px-4 py-2.5 bg-[#F2EFE9] border border-[#E5E1D8] rounded-xl text-sm text-[#6B6B72] cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-[#2A2B2F] mb-2">Change Password</h2>
                  <p className="text-sm text-[#6B6B72] mb-6">Ensure your account is using a long, random password to stay secure.</p>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#2A2B2F]">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] text-[#2A2B2F]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#2A2B2F]">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] text-[#2A2B2F]" />
                    </div>
                    <button className="px-4 py-2 bg-white border border-[#E5E1D8] text-[#2A2B2F] rounded-xl text-sm font-medium hover:bg-[#F2EFE9] transition-colors mt-2">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <hr className="border-[#E5E1D8]" />
                
                <div>
                  <h2 className="text-xl font-bold text-[#2A2B2F] mb-2">Two-Factor Authentication</h2>
                  <p className="text-sm text-[#6B6B72] mb-4">Add additional security to your account using two-factor authentication.</p>
                  <div className="flex items-center justify-between p-4 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-[#E5E1D8]">
                        <Key className="w-5 h-5 text-[#3F5D9E]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#2A2B2F] text-sm">Authenticator App</p>
                        <p className="text-xs text-[#6B6B72]">Not configured</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#3F5D9E] text-white rounded-lg text-sm font-medium hover:bg-[#2B4375] transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#2A2B2F] mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {[
                    { title: 'New Job Postings', desc: 'Receive alerts when an employer posts a new job.', icon: Briefcase },
                    { title: 'User Registrations', desc: 'Get notified when a new user joins the platform.', icon: User },
                    { title: 'System Alerts', desc: 'Critical system status and security alerts.', icon: BellRing },
                    { title: 'Weekly Reports', desc: 'A summary of platform activity every week.', icon: CheckSquare },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-[#E5E1D8]">
                          <item.icon className="w-5 h-5 text-[#3F5D9E]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#2A2B2F] text-sm">{item.title}</p>
                          <p className="text-xs text-[#6B6B72]">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={idx !== 3} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#E5E1D8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3F5D9E]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PLATFORM DEFAULTS */}
          {activeTab === 'defaults' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#2A2B2F] mb-6">Platform Defaults</h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E1D8] bg-[#FAF9F6]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-[#E5E1D8]">
                        <Monitor className="w-5 h-5 text-[#3F5D9E]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#2A2B2F] text-sm">Appearance</p>
                        <p className="text-xs text-[#6B6B72]">Customize the UI theme</p>
                      </div>
                    </div>
                    <select className="px-3 py-1.5 text-sm bg-white border border-[#E5E1D8] rounded-lg text-[#2A2B2F] focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20">
                      <option>Light Theme</option>
                      <option>Dark Theme</option>
                      <option>System Default</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E1D8] bg-[#FAF9F6]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-[#E5E1D8]">
                        <Globe className="w-5 h-5 text-[#3F5D9E]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#2A2B2F] text-sm">Language</p>
                        <p className="text-xs text-[#6B6B72]">Select your preferred language</p>
                      </div>
                    </div>
                    <select className="px-3 py-1.5 text-sm bg-white border border-[#E5E1D8] rounded-lg text-[#2A2B2F] focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20">
                      <option>English (US)</option>
                      <option>French (FR)</option>
                      <option>Spanish (ES)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EMAIL TEMPLATES */}
          {activeTab === 'email' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#2A2B2F] mb-6">Email Templates</h2>
                <div className="space-y-4">
                  {[
                    'Welcome Email (Candidate)',
                    'Welcome Email (Employer)',
                    'Job Application Received',
                    'Password Reset Request',
                  ].map((template, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl hover:border-[#3F5D9E]/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-[#E5E1D8] group-hover:border-[#3F5D9E]/50 transition-colors">
                          <Mail className="w-5 h-5 text-[#3F5D9E]" />
                        </div>
                        <p className="font-semibold text-[#2A2B2F] text-sm">{template}</p>
                      </div>
                      <button className="text-[#3F5D9E] text-sm font-medium hover:underline">
                        Edit Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

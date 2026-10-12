'use client';

import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2, ShieldBan, CheckCircle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function UsersManagement() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Alice Cooper', email: 'alice@example.com', role: 'Candidate', status: 'Active', joinDate: 'Oct 12, 2026' },
    { id: '2', name: 'Tech Innovations Ltd', email: 'contact@techinnovations.com', role: 'Employer', status: 'Active', joinDate: 'Sep 28, 2026' },
    { id: '3', name: 'Bob Smith', email: 'bob.smith@example.com', role: 'Candidate', status: 'Suspended', joinDate: 'Aug 15, 2026' },
    { id: '4', name: 'Sarah Jenkins', email: 's.jenkins@example.com', role: 'Candidate', status: 'Active', joinDate: 'Oct 20, 2026' },
    { id: '5', name: 'Global Corp', email: 'hr@globalcorp.com', role: 'Employer', status: 'Pending', joinDate: 'Oct 27, 2026' },
  ]);

  const [modal, setModal] = useState<{ isOpen: boolean; type: 'edit' | 'delete' | null; user: any }>({
    isOpen: false,
    type: null,
    user: null
  });

  const handleDelete = () => {
    if (modal.user) {
      setUsers(users.filter(u => u.id !== modal.user.id));
    }
    setModal({ isOpen: false, type: null, user: null });
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified update logic
    setModal({ isOpen: false, type: null, user: null });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2A2B2F]">
            Users Management
          </h1>
          <p className="text-sm text-[#6B6B72] mt-1">
            View, manage, and moderate users on the platform.
          </p>
        </div>
        <button className="px-4 py-2 bg-[#3F5D9E] hover:bg-[#2B4375] text-white rounded-xl text-sm font-medium shadow-sm transition-all hover:shadow-md">
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E5E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B72]" />
            <input 
              type="text" 
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] transition-all text-[#2A2B2F] placeholder-[#6B6B72]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2A2B2F] bg-white border border-[#E5E1D8] rounded-xl hover:bg-[#F2EFE9] transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E5E1D8] text-xs uppercase tracking-wider text-[#6B6B72] font-medium">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAF9F6] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#2A2B2F]">{user.name}</span>
                      <span className="text-sm text-[#6B6B72]">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#2A2B2F] font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                      user.status === 'Active' && "bg-emerald-100 text-emerald-700",
                      user.status === 'Suspended' && "bg-red-100 text-red-700",
                      user.status === 'Pending' && "bg-orange-100 text-orange-700"
                    )}>
                      {user.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                      {user.status === 'Suspended' && <ShieldBan className="w-3 h-3" />}
                      {user.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B6B72]">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setModal({ isOpen: true, type: 'edit', user })}
                        className="p-1.5 text-[#6B6B72] hover:text-[#3F5D9E] hover:bg-[#3F5D9E]/10 rounded-lg transition-colors" 
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setModal({ isOpen: true, type: 'delete', user })}
                        className="p-1.5 text-[#6B6B72] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-[#6B6B72] hover:text-[#2A2B2F] hover:bg-[#E5E1D8] rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="p-4 border-t border-[#E5E1D8] flex items-center justify-between text-sm text-[#6B6B72]">
          <span>Showing 1 to {users.length} of 14,592 entries</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded-lg border border-[#E5E1D8] hover:bg-[#FAF9F6] disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded-lg border border-[#E5E1D8] hover:bg-[#FAF9F6]">Next</button>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2A2B2F]/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-[#E5E1D8] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E1D8] bg-[#FAF9F6]">
              <h3 className="font-bold text-[#2A2B2F]">
                {modal.type === 'edit' ? 'Edit User' : 'Delete User'}
              </h3>
              <button 
                onClick={() => setModal({ isOpen: false, type: null, user: null })}
                className="text-[#6B6B72] hover:text-[#2A2B2F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {modal.type === 'delete' ? (
                <div className="space-y-4">
                  <p className="text-[#2A2B2F]">Are you sure you want to delete <strong>{modal.user?.name}</strong>? This action cannot be undone.</p>
                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      onClick={() => setModal({ isOpen: false, type: null, user: null })}
                      className="px-4 py-2 bg-white border border-[#E5E1D8] rounded-xl text-sm font-medium text-[#2A2B2F] hover:bg-[#F2EFE9]"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEditSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#2A2B2F]">Name</label>
                    <input 
                      type="text" 
                      defaultValue={modal.user?.name}
                      className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] text-[#2A2B2F]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#2A2B2F]">Email</label>
                    <input 
                      type="email" 
                      defaultValue={modal.user?.email}
                      className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] text-[#2A2B2F]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#2A2B2F]">Status</label>
                    <select className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] text-[#2A2B2F]">
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Suspended</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setModal({ isOpen: false, type: null, user: null })}
                      className="px-4 py-2 bg-white border border-[#E5E1D8] rounded-xl text-sm font-medium text-[#2A2B2F] hover:bg-[#F2EFE9]"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-[#3F5D9E] hover:bg-[#2B4375] text-white rounded-xl text-sm font-medium shadow-sm transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

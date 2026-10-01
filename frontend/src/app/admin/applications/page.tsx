'use client';

import React, { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Clock, Eye, Download, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState([
    { id: 'APP-001', candidate: 'Alice Cooper', job: 'Senior Frontend Developer', appliedDate: 'Oct 28, 2026', status: 'Under Review', matchScore: '92%' },
    { id: 'APP-002', candidate: 'Bob Smith', job: 'UX/UI Designer', appliedDate: 'Oct 27, 2026', status: 'Rejected', matchScore: '45%' },
    { id: 'APP-003', candidate: 'Sarah Jenkins', job: 'Backend Engineer (Go)', appliedDate: 'Oct 26, 2026', status: 'Accepted', matchScore: '98%' },
    { id: 'APP-004', candidate: 'Michael Brown', job: 'Product Manager', appliedDate: 'Oct 25, 2026', status: 'Pending', matchScore: '78%' },
    { id: 'APP-005', candidate: 'Alex Rivera', job: 'Marketing Specialist', appliedDate: 'Oct 24, 2026', status: 'Under Review', matchScore: '85%' },
  ]);

  const [modal, setModal] = useState<{ isOpen: boolean; app: any }>({
    isOpen: false,
    app: null
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2A2B2F]">
            Applications Review
          </h1>
          <p className="text-sm text-[#6B6B72] mt-1">
            Monitor and moderate candidate applications across all jobs.
          </p>
        </div>
        <button className="px-4 py-2 bg-white border border-[#E5E1D8] rounded-xl text-sm font-medium text-[#2A2B2F] shadow-sm hover:bg-[#F2EFE9] transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E5E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B72]" />
            <input 
              type="text" 
              placeholder="Search by candidate or job title..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] transition-all text-[#2A2B2F] placeholder-[#6B6B72]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2A2B2F] bg-white border border-[#E5E1D8] rounded-xl hover:bg-[#F2EFE9] transition-colors">
            <Filter className="w-4 h-4" />
            Filter Status
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E5E1D8] text-xs uppercase tracking-wider text-[#6B6B72] font-medium">
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Applied Job</th>
                <th className="px-6 py-4">Match Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8]">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-[#FAF9F6] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#2A2B2F]">{app.candidate}</span>
                      <span className="text-xs text-[#6B6B72]">{app.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#2A2B2F] font-medium">
                      {app.job}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-[#E5E1D8] rounded-full h-1.5 max-w-[60px]">
                        <div 
                          className={cn(
                            "h-1.5 rounded-full",
                            parseInt(app.matchScore) > 80 ? "bg-emerald-500" :
                            parseInt(app.matchScore) > 50 ? "bg-orange-500" :
                            "bg-red-500"
                          )} 
                          style={{ width: app.matchScore }} 
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#2A2B2F]">{app.matchScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                      app.status === 'Accepted' && "bg-emerald-100 text-emerald-700",
                      app.status === 'Rejected' && "bg-red-100 text-red-700",
                      app.status === 'Under Review' && "bg-[#3F5D9E]/10 text-[#3F5D9E]",
                      app.status === 'Pending' && "bg-orange-100 text-orange-700"
                    )}>
                      {app.status === 'Accepted' && <CheckCircle className="w-3 h-3" />}
                      {app.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                      {app.status === 'Under Review' && <Eye className="w-3 h-3" />}
                      {app.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {app.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B6B72]">
                    {app.appliedDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setModal({ isOpen: true, app })}
                        className="p-1.5 text-[#6B6B72] hover:text-[#3F5D9E] hover:bg-[#3F5D9E]/10 rounded-lg transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
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
          <span>Showing 1 to {applications.length} of 45,211 entries</span>
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
                Application Details
              </h3>
              <button 
                onClick={() => setModal({ isOpen: false, app: null })}
                className="text-[#6B6B72] hover:text-[#2A2B2F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[#6B6B72]">Candidate Name</h4>
                  <p className="font-semibold text-[#2A2B2F]">{modal.app?.candidate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#6B6B72]">Application ID</h4>
                  <p className="font-medium text-[#2A2B2F]">{modal.app?.id}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#6B6B72]">Applied Job</h4>
                <p className="font-medium text-[#2A2B2F]">{modal.app?.job}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[#6B6B72]">Match Score</h4>
                  <p className="font-medium text-[#2A2B2F]">{modal.app?.matchScore}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#6B6B72]">Status</h4>
                  <p className="font-medium text-[#2A2B2F]">{modal.app?.status}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E1D8]">
                <button 
                  onClick={() => setModal({ isOpen: false, app: null })}
                  className="px-4 py-2 bg-white border border-[#E5E1D8] rounded-xl text-sm font-medium text-[#2A2B2F] hover:bg-[#F2EFE9]"
                >
                  Close
                </button>
                <button 
                  onClick={() => setModal({ isOpen: false, app: null })}
                  className="px-4 py-2 bg-[#3F5D9E] hover:bg-[#2B4375] text-white rounded-xl text-sm font-medium shadow-sm transition-all"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

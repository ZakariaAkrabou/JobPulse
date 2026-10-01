'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Edit2, Trash2, MapPin, Building, Briefcase, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function JobsManagement() {
  const [jobs, setJobs] = useState([
    { 
      id: '1', 
      title: 'Senior Frontend Developer', 
      company: 'TechCorp Inc.', 
      location: 'Remote', 
      type: 'Full-time', 
      status: 'Published', 
      applicants: 124, 
      postedAt: 'Oct 12, 2026' 
    },
    { 
      id: '2', 
      title: 'UX/UI Designer', 
      company: 'Design Studio LLC', 
      location: 'New York, NY', 
      type: 'Contract', 
      status: 'Draft', 
      applicants: 0, 
      postedAt: 'Oct 25, 2026' 
    },
    { 
      id: '3', 
      title: 'Backend Engineer (Go)', 
      company: 'Global Innovations', 
      location: 'London, UK', 
      type: 'Full-time', 
      status: 'Published', 
      applicants: 89, 
      postedAt: 'Oct 15, 2026' 
    },
    { 
      id: '4', 
      title: 'Product Manager', 
      company: 'Startup Inc', 
      location: 'Remote', 
      type: 'Full-time', 
      status: 'Closed', 
      applicants: 312, 
      postedAt: 'Sep 01, 2026' 
    },
    { 
      id: '5', 
      title: 'Marketing Specialist', 
      company: 'Marketing Pros', 
      location: 'Austin, TX', 
      type: 'Part-time', 
      status: 'Under Review', 
      applicants: 12, 
      postedAt: 'Oct 27, 2026' 
    },
  ]);

  const [modal, setModal] = useState<{ isOpen: boolean; type: 'edit' | 'delete' | 'view' | null; job: any }>({
    isOpen: false,
    type: null,
    job: null
  });

  const handleDelete = () => {
    if (modal.job) {
      setJobs(jobs.filter(j => j.id !== modal.job.id));
    }
    setModal({ isOpen: false, type: null, job: null });
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    setModal({ isOpen: false, type: null, job: null });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2A2B2F]">
            Jobs Management
          </h1>
          <p className="text-sm text-[#6B6B72] mt-1">
            Review and manage job postings from employers.
          </p>
        </div>
        <button className="px-4 py-2 bg-[#3F5D9E] hover:bg-[#2B4375] text-white rounded-xl text-sm font-medium shadow-sm transition-all hover:shadow-md">
          + Post New Job
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E5E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B72]" />
            <input 
              type="text" 
              placeholder="Search jobs by title or company..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] transition-all text-[#2A2B2F] placeholder-[#6B6B72]"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="px-4 py-2 text-sm font-medium text-[#2A2B2F] bg-white border border-[#E5E1D8] rounded-xl hover:bg-[#F2EFE9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2A2B2F] bg-white border border-[#E5E1D8] rounded-xl hover:bg-[#F2EFE9] transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="p-4 sm:p-6 grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="group bg-white border border-[#E5E1D8] rounded-2xl p-4 sm:p-6 hover:shadow-md hover:border-[#3F5D9E]/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                {/* Job Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-[#2A2B2F] group-hover:text-[#3F5D9E] transition-colors">
                      {job.title}
                    </h3>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      job.status === 'Published' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                      job.status === 'Draft' && "bg-[#F2EFE9] text-[#6B6B72] border-[#E5E1D8]",
                      job.status === 'Closed' && "bg-red-50 text-red-700 border-red-200",
                      job.status === 'Under Review' && "bg-orange-50 text-orange-700 border-orange-200"
                    )}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B6B72]">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-4 h-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                </div>

                {/* Job Stats & Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex gap-6 text-center">
                    <div>
                      <p className="text-2xl font-bold text-[#2A2B2F]">{job.applicants}</p>
                      <p className="text-xs text-[#6B6B72] uppercase tracking-wider font-medium">Applicants</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2A2B2F] mt-1.5">{job.postedAt}</p>
                      <p className="text-xs text-[#6B6B72] uppercase tracking-wider font-medium mt-1">Posted</p>
                    </div>
                  </div>
                  
                  <div className="h-10 w-px bg-[#E5E1D8] hidden sm:block" />
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setModal({ isOpen: true, type: 'view', job })}
                      className="p-2 text-[#6B6B72] hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors bg-[#FAF9F6]" 
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setModal({ isOpen: true, type: 'edit', job })}
                      className="p-2 text-[#6B6B72] hover:text-[#3F5D9E] hover:bg-[#3F5D9E]/10 rounded-xl transition-colors bg-[#FAF9F6]" 
                      title="Edit Job"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setModal({ isOpen: true, type: 'delete', job })}
                      className="p-2 text-[#6B6B72] hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors bg-[#FAF9F6]" 
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="p-4 border-t border-[#E5E1D8] flex items-center justify-center text-sm">
          <button className="px-6 py-2 bg-[#FAF9F6] hover:bg-[#F2EFE9] text-[#2A2B2F] font-medium rounded-xl transition-colors border border-[#E5E1D8]">
            Load More Jobs
          </button>
        </div>
      </div>

      {/* Action Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2A2B2F]/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-[#E5E1D8] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E1D8] bg-[#FAF9F6]">
              <h3 className="font-bold text-[#2A2B2F]">
                {modal.type === 'edit' ? 'Edit Job' : modal.type === 'delete' ? 'Delete Job' : 'Job Details'}
              </h3>
              <button 
                onClick={() => setModal({ isOpen: false, type: null, job: null })}
                className="text-[#6B6B72] hover:text-[#2A2B2F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {modal.type === 'delete' ? (
                <div className="space-y-4">
                  <p className="text-[#2A2B2F]">Are you sure you want to delete <strong>{modal.job?.title}</strong>? This will also remove all associated applications.</p>
                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      onClick={() => setModal({ isOpen: false, type: null, job: null })}
                      className="px-4 py-2 bg-white border border-[#E5E1D8] rounded-xl text-sm font-medium text-[#2A2B2F] hover:bg-[#F2EFE9]"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
                    >
                      Delete Job
                    </button>
                  </div>
                </div>
              ) : modal.type === 'view' ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-[#6B6B72]">Job Title</h4>
                    <p className="font-semibold text-[#2A2B2F]">{modal.job?.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-[#6B6B72]">Company</h4>
                      <p className="font-medium text-[#2A2B2F]">{modal.job?.company}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#6B6B72]">Location</h4>
                      <p className="font-medium text-[#2A2B2F]">{modal.job?.location}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#6B6B72]">Status</h4>
                    <p className="font-medium text-[#2A2B2F]">{modal.job?.status}</p>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={() => setModal({ isOpen: false, type: null, job: null })}
                      className="px-4 py-2 bg-white border border-[#E5E1D8] rounded-xl text-sm font-medium text-[#2A2B2F] hover:bg-[#F2EFE9]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEditSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#2A2B2F]">Job Title</label>
                    <input 
                      type="text" 
                      defaultValue={modal.job?.title}
                      className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] text-[#2A2B2F]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#2A2B2F]">Location</label>
                    <input 
                      type="text" 
                      defaultValue={modal.job?.location}
                      className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] text-[#2A2B2F]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#2A2B2F]">Status</label>
                    <select className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5D9E]/20 focus:border-[#3F5D9E] text-[#2A2B2F]">
                      <option>Published</option>
                      <option>Draft</option>
                      <option>Closed</option>
                      <option>Under Review</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setModal({ isOpen: false, type: null, job: null })}
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

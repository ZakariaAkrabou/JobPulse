import React from 'react';
import { Users, Briefcase, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const metadata = {
  title: 'Admin Dashboard - JobPulse',
  description: 'JobPulse admin dashboard overview',
};

const stats = [
  {
    name: 'Total Users',
    value: '14,592',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'from-[#3F5D9E] to-[#2B4375]',
    bgColor: 'bg-[#3F5D9E]/10',
    iconColor: 'text-[#3F5D9E]',
  },
  {
    name: 'Active Jobs',
    value: '2,431',
    change: '+5.2%',
    trend: 'up',
    icon: Briefcase,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
  },
  {
    name: 'Applications',
    value: '45,211',
    change: '-2.4%',
    trend: 'down',
    icon: FileText,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-700',
  },
  {
    name: 'Placement Rate',
    value: '68.4%',
    change: '+8.1%',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-700',
  },
];

const recentActivity = [
  { id: 1, user: 'Sarah Jenkins', action: 'Applied for', target: 'Senior Frontend Developer', time: '2 minutes ago', status: 'pending' },
  { id: 2, user: 'TechCorp Inc.', action: 'Posted a new job', target: 'UX Designer', time: '1 hour ago', status: 'completed' },
  { id: 3, user: 'Michael Brown', action: 'Updated profile', target: 'Resume & Portfolio', time: '3 hours ago', status: 'completed' },
  { id: 4, user: 'Global Innovations', action: 'Hired', target: 'Sarah Jenkins', time: '5 hours ago', status: 'success' },
  { id: 5, user: 'Alex Rivera', action: 'Reported issue with', target: 'Job Application #459', time: '1 day ago', status: 'failed' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2A2B2F]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#6B6B72] mt-1">
            Monitor key metrics, user activity, and system health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-[#E5E1D8] rounded-xl text-sm font-medium text-[#2A2B2F] shadow-sm hover:bg-[#F2EFE9] transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-[#3F5D9E] hover:bg-[#2B4375] text-white rounded-xl text-sm font-medium shadow-sm transition-all hover:shadow-md">
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className="group bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Background Glow on Hover */}
            <div className={cn(
              "absolute -inset-0.5 opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl bg-gradient-to-r",
              stat.color
            )} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bgColor)}>
                  <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                  stat.trend === 'up' 
                    ? "text-emerald-700 bg-emerald-100" 
                    : "text-red-700 bg-red-100"
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#2A2B2F] tracking-tight">{stat.value}</p>
                <p className="text-sm text-[#6B6B72] font-medium mt-1">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E1D8] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#2A2B2F]">Growth Metrics</h2>
            <select className="bg-[#FAF9F6] border-none text-sm text-[#2A2B2F] rounded-lg focus:ring-2 focus:ring-[#3F5D9E]">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-72 w-full flex items-end gap-2 pt-10">
            {/* Simple CSS Bar Chart Placeholder */}
            {[40, 70, 45, 90, 65, 85, 100, 60, 80, 50, 75, 95].map((height, i) => (
              <div key={i} className="relative flex-1 group">
                <div 
                  className="absolute bottom-0 w-full bg-[#3F5D9E]/10 rounded-t-sm group-hover:bg-[#3F5D9E]/30 transition-colors"
                  style={{ height: '100%' }}
                />
                <div 
                  className="absolute bottom-0 w-full bg-[#3F5D9E] rounded-t-sm opacity-90 group-hover:opacity-100 transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity (Takes up 1 column) */}
        <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#2A2B2F]">Recent Activity</h2>
            <button className="text-[#6B6B72] hover:text-[#2A2B2F]">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 space-y-6">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-4">
                {/* Timeline Line */}
                {index !== recentActivity.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-[#E5E1D8]" />
                )}
                
                <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-[#FAF9F6] border-4 border-white flex items-center justify-center shadow-sm">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    activity.status === 'success' ? 'bg-emerald-500' :
                    activity.status === 'failed' ? 'bg-red-500' :
                    activity.status === 'completed' ? 'bg-[#3F5D9E]' :
                    'bg-orange-500'
                  )} />
                </div>
                
                <div className="flex-1 pb-1">
                  <p className="text-sm text-[#2A2B2F]">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    <span className="text-[#6B6B72]">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-[#6B6B72] mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-2.5 text-sm font-medium text-[#3F5D9E] bg-[#3F5D9E]/10 hover:bg-[#3F5D9E]/20 rounded-xl transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}

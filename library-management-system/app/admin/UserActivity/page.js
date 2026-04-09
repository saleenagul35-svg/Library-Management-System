'use client';

import { useState, useEffect } from 'react';
import { Search, BookMarked, RefreshCw, AlertTriangle, Filter, Download } from 'lucide-react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const ACTION_CONFIG = {
  Borrowed: { icon: BookMarked, label: 'Borrowed', style: 'bg-secondary/10 text-secondary-700', dot: 'bg-secondary' },
  Returned: { icon: RefreshCw, label: 'Returned', style: 'bg-primary/10 text-primary-700', dot: 'bg-primary' },
  Overdued: { icon: AlertTriangle, label: 'overdued', style: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

export default function UserLogsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loader, setLoader] = useState(true)
  const [activityData, setActivityData] = useState([])

  const fetchingAPIs = async () => {
    try {
      console.log("hello");

      const token = localStorage.getItem('Admintoken');
      const response = await fetch("http://localhost:5000/api/membersActivity", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setActivityData(data.data);
        console.log(data.data);

      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false)
    }
  };

  const logs = activityData.filter(l => {
    const matchS = l.userId.name.toLowerCase().includes(search.toLowerCase()) || l.bookId.Title.toLowerCase().includes(search.toLowerCase());
    const matchF = filter === 'all' || l.status.toLowerCase() === filter.toLowerCase();
    return matchS && matchF;
  });

  useEffect(() => {
    fetchingAPIs();
  }, []);
  if (loader) {
    return (
      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">

        <CircularProgress sx={{ color: "#52512a" }} />

      </Stack>
    )
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">Members Activity</h1>
          <p className="mt-1 text-sm text-primary-800/50">All borrowing, return & overdue events</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-card-bg px-4 py-2.5 text-sm font-medium text-primary/70 hover:border-primary/40 hover:text-primary transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/35" />
          <input
            className="w-full rounded-xl border border-primary/15 bg-card-bg py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-primary/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="Search user or book…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'borrowed', 'returned', 'overdued'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold capitalize transition-all ${filter === f
                ? 'bg-primary text-white shadow-brand-sm'
                : 'border border-primary/15 bg-card-bg text-primary/60 hover:border-primary/30 hover:text-primary'
                }`}
            >
              {f === 'all' ? 'All Events' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Log table */}
      <div className="rounded-2xl border border-primary/[0.1] bg-card-bg shadow-brand-sm overflow-hidden animate-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/[0.08] bg-brand-bg/50">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50">User</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50">Book</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50">Activity</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50">Date</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/[0.04]">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-primary/40">
                    No activity found
                  </td>
                </tr>
              )}
              {logs.map((log, i) => {
                const cfg = ACTION_CONFIG[log.status];
                const Icon = cfg.icon;
                return (
                  <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors animate-fade-up" style={{ animationDelay: `${200 + i * 50}ms` }}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-primary-950">{log.userId.name}</p>
                      <p className="text-[11px] text-primary-800/40 font-mono">REG-{log.userId.id}</p>
                    </td>
                    <td className="px-5 py-4 text-primary-800/70 italic">{log.bookId.Title}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.style}`}>
                        <Icon size={11} strokeWidth={2} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-primary-800/60 text-xs">
                      <p>{log.issueDate}</p>

                    </td>
                    <td className="px-5 py-4 text-xs">
                      {log.dueDate
                        ? <span className={log.status.toLowerCase() === 'overdued' ? 'font-semibold text-red-600' : 'text-primary-800/60'}>{log.dueDate}</span>
                        : <span className="text-primary-800/25">—</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-primary/[0.06] px-5 py-3">
          <p className="text-xs text-primary-800/40">
            Showing <strong className="text-primary-800/70">{logs.length}</strong> of <strong className="text-primary-800/70">{activityData.length}</strong> log entries
          </p>
        </div>
      </div>
    </div>
  );
}
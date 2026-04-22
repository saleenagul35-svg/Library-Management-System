'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import {
  BookOpen,
  Users,
  BookCopy,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  BookMarked,
  RefreshCw,
  Plus,
  BarChart2,
} from 'lucide-react';


// ─── Data (replace with API calls in production) ──────────────────────────────
export default function AdminDashboardPage() {

  const Counting = () => {
    return topBooks.reduce((acc, curr) => {
      return acc + curr.totalBorrowed
    }, 0)

  }

  const getGreeting = () => {
    const greeting = new Date().getHours()
    if (greeting >= 5 && greeting < 12) {
      return "Good Morning, "
    } else if (greeting >= 12 && greeting <= 14) {
      return "Good noon, "
    } else if (greeting > 14 && greeting < 17) {
      return "Good Afternoon, "
    } else if (greeting >= 17 && greeting < 19) {
      return "Good Evening, "
    } else {
      return "Night Owl, "
    }

  }

  const countingTime = (time) => {
    const diff = new Date() - new Date(time);

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)
    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${weeks}w ago`
    if (days < 365) return `${months}w ago`
    return `${years}y ago`
  }

  //============================== APIs ===========================//

  const fetchData = async (url) => {
          const token = localStorage.getItem('Admintoken')
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { data: totalBooks = 0, isPending: P1 } = useQuery({
    queryKey: ["totalBooks"],
    queryFn: () => fetchData("http://localhost:5000/api/bookCount"),
    refetchInterval: 15000
  })
  const { data: totalStudents = 0, isPending: P2 } = useQuery({
    queryKey: ["totalStudents"],
    queryFn: () => fetchData("http://localhost:5000/api/membersCount"),
    refetchInterval: 15000
  })
  const { data: topBooks = [], isPending: P3 } = useQuery({
    queryKey: ["topBooks"],
    queryFn: () => fetchData("http://localhost:5000/api/topBooks"),
    refetchInterval: 15000
  })
  const { data: totalBorrowings = 0, isPending: P4 } = useQuery({
    queryKey: ["totalBorrowings"],
    queryFn: () => fetchData("http://localhost:5000/api/borrowedRequestCount"),
    refetchInterval: 15000
  })
  const { data: overDueBooks = 0, isPending: P5 } = useQuery({
    queryKey: ["overDueBooks"],
    queryFn: () => fetchData("http://localhost:5000/api/overDueCount"),
    refetchInterval: 15000
  })
  const { data: activity = [], isPending: P6 } = useQuery({
    queryKey: ["activity"],
    queryFn: () => fetchData("http://localhost:5000/api/RecentActvity"),
    refetchInterval: 150000
  })

  const STAT_CARDS = [
    {
      id: 'total-books',
      label: 'Total Books',
      value: `${totalBooks}`,
      icon: BookOpen,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      accent: 'border-primary/20',
    },
    {
      id: 'active-borrows',
      label: 'Active Borrowings',
      value: `${totalBorrowings}`,
      icon: BookCopy,
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
      accent: 'border-secondary/20',
    },
    {
      id: 'registered-users',
      label: 'Registered Members',
      value: `${totalStudents}`,
      icon: Users,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-700',
      accent: 'border-amber-300/30',
    },
    {
      id: 'overdue',
      label: 'Overdue Books',
      value: `${overDueBooks}`,
      icon: AlertTriangle,
      iconBg: 'bg-red-700/10',
      iconColor: 'text-red-600',
      accent: 'border-red-200/40',
    },
  ];


  // ─── Sub-components ───────────────────────────────────────────────────────────


  /** Individual stat card */
  function StatCard({ card, index }) {
    const Icon = card.icon;
    const sparkColor =
      card.id === 'total-books' ? '#864c25' :
        card.id === 'active-borrows' ? '#515427' :
          card.id === 'registered-users' ? '#b45309' : '#dc2626';

    return (
      <div
        className={`
           group relative overflow-hidden rounded-2xl border bg-card-bg p-5
           shadow-brand-sm transition-all duration-300
           hover:-translate-y-1 hover:shadow-brand-lg
           ${card.accent}
          animate-fade-up
      `}
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Subtle radial glow on hover */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle, ${sparkColor}18 0%, transparent 70%)` }}
          aria-hidden="true"
        />

        {/* Top row: icon only */}
        <div className="flex items-start mb-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
            <Icon size={20} strokeWidth={1.75} className={card.iconColor} />
          </div>
        </div>

        {/* Value */}
        <p className="font-display text-3xl font-bold text-primary-950 leading-none mb-1">
          {card.value}
        </p>

        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-800/50">
          {card.label}
        </p>
      </div>
    );
  }

  /** Activity type config */
  const ACTIVITY_CONFIG = {
    Borrowed: { icon: BookMarked, label: 'Borrowed', color: 'bg-secondary/10 text-secondary-700', dot: 'bg-secondary' },
    Returned: { icon: RefreshCw, label: 'Returned', color: 'bg-primary/10 text-primary-700', dot: 'bg-primary' },
    Overdued: { icon: AlertTriangle, label: 'Overdued', color: 'bg-red-100 text-red-700', dot: 'bg-red-700' },
  };

  /** Single activity row */
  function ActivityRow({ item, index }) {
    const cfg = ACTIVITY_CONFIG[item.status];
    const Icon = cfg.icon;

    return (
      <div
        className="flex items-center gap-4 py-3 border-b border-primary/[0.05] last:border-0"

        style={{ animationDelay: `${200 + index * 60}ms` }}
      >
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${cfg.color}`}>
          <Icon size={14} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-900 truncate">{item.userId.name}</p>
          <p className="text-xs text-primary-800/50 truncate">
            <span className="italic">{item.bookId.Title}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-primary-800/40">
            <Clock size={9} />
            {countingTime(item.activityDate)}
          </span>
        </div>
      </div>
    );
  }

  /** Top borrowed books bar chart */
  function TopBooksChart() {
    return (
      <div className="space-y-3">
        {topBooks.map((book, i) => (
          <div key={i} >
            <div className="flex items-center justify-between mb-1">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary-900 truncate">{book.Title}</p>
                <p className="text-xs text-primary-800/45">{book.Author}</p>
              </div>
              <span className="ml-3 flex-shrink-0 text-sm font-bold text-primary">{book.totalBorrowed}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-400 transition-all duration-700"
                style={{ width: `${(book.totalBorrowed / Counting()) * 100}%`, transitionDelay: `${400 + i * 80}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /** Quick action button */
  function QuickAction({ icon: Icon, label, href, color }) {
    return (
      <Link
        href={href}
        className={`
        flex flex-col items-center gap-2 rounded-xl p-4 text-center
        border border-primary/10 bg-card-bg hover:border-primary/25
        hover:shadow-brand-sm transition-all duration-200 hover:-translate-y-0.5
      `}
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <span className="text-xs font-semibold text-primary-900 leading-tight">{label}</span>
      </Link>
    );
  }

  // ─── Page ─────────────────────────────────────────────────────────────────────

  const now = new Date();
  const timeString = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  if (P1 || P2 || P3 || P4 || P5 || P6) {
    return (

      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">

        <CircularProgress sx={{ color: "#52512a" }} />

      </Stack>
    )
  } else {



    return (
      <div className="min-h-full p-6 lg:p-8">


        {/* ── Page header ── */}
        <div className="mb-8 animate-fade-up">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-primary-950 leading-tight">
                {getGreeting()} Admin
              </h1>
              <p className="mt-1 text-sm text-primary-800/50">{timeString}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/inventory/new"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-brand-sm hover:bg-primary-600 hover:-translate-y-px hover:shadow-brand-md transition-all duration-200"
              >
                <Plus size={15} strokeWidth={2.5} />
                Add Book
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_CARDS.map((card, i) => (
            <StatCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* ── Main grid: Activity + Top Books ── */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* Recent activity (3/5 width) */}
          <div className="lg:col-span-3 rounded-2xl border border-primary/[0.1] bg-card-bg shadow-brand-sm overflow-hidden animate-fade-up" style={{ animationDelay: '160ms' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-primary/[0.08]">
              <div>
                <h2 className="font-display text-lg font-semibold text-primary-950">Recent Activity</h2>
                <p className="text-xs text-primary-800/45 mt-0.5">Latest borrow & return events</p>
              </div>
            </div>
            <div className="px-5 divide-y divide-primary/[0.04]">
              {activity.map((item, i) => (
                <ActivityRow key={item._id} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* Top borrowed books (2/5 width) */}
          <div className="lg:col-span-2 rounded-2xl border border-primary/[0.1] bg-card-bg shadow-brand-sm overflow-hidden animate-fade-up" style={{ animationDelay: '220ms' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-primary/[0.08]">
              <div>
                <h2 className="font-display text-lg font-semibold text-primary-950">Top Books</h2>
                <p className="text-xs text-primary-800/45 mt-0.5">Most borrowed this month</p>
              </div>
              <BarChart2 size={16} className="text-primary/30" />
            </div>
            <div className="px-5 py-4">
              <TopBooksChart />
            </div>
          </div>
        </div>

        {/* ── Quick actions row ── */}
        <div className="rounded-2xl border border-primary/[0.1] bg-card-bg shadow-brand-sm overflow-hidden animate-fade-up" style={{ animationDelay: '280ms' }}>
          <div className="px-5 py-4 border-b border-primary/[0.08]">
            <h2 className="font-display text-lg font-semibold text-primary-950">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            <QuickAction icon={Plus} label="Add New Book" href="/admin/inventory/new" color="bg-primary/10 text-primary" />
            <QuickAction icon={Users} label="Manage Users" href="/admin/logs" color="bg-secondary/10 text-secondary" />
            <QuickAction icon={BookCopy} label="View Borrowings" href="/admin/issuedOverdue" color="bg-amber-500/10 text-amber-700" />
            <QuickAction icon={BarChart2} label="Manage Inventory" href="/admin/inventory" color="bg-blue-500/10 text-blue-700" />
          </div>
        </div>

        {/* ── System status strip ── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/[0.08] bg-card-bg px-5 py-3 animate-fade-up" style={{ animationDelay: '340ms' }}>
          <div className="flex items-center gap-2 text-xs text-primary-800/50">
            <CheckCircle2 size={13} className="text-secondary" />
            All systems operational
          </div>
        </div>

      </div>
    );
  }
}
'use client';

import Link from 'next/link';
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
import { useState, useEffect } from 'react';

// ─── Data (replace with API calls in production) ──────────────────────────────
export default function AdminDashboardPage() {




  //============================== total Books ===========================//

  const [totalBooks, setTotalBooks] = useState(0)
  const getFun = async () => {
    try {
      const token = localStorage.getItem("Admintoken")
      const response = await fetch("http://localhost:5000/data", {
        method: "GET",
       headers:{
         "authorization": `Bearer ${token}`
       }

      })
      const Data = await response.json()
      const dataArray = Data.data
      setTotalBooks(dataArray)

    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {

    getFun()

  }

    , [])

  //============================== total Students ===========================//

  const [totalStudents, setTotalStudents] = useState(0)
  const TotalStnd = async () => {
    try {
      const token = localStorage.getItem("Admintoken")
      const response = await fetch("http://localhost:5000/StudentData", {

        method: "GET",
        headers: {
          "authorization": `Bearer ${token}`
        }
      })

      let data = await response.json()
      console.log(data);

      let length = data.data.length
      setTotalStudents(length)

    } catch (error) {
      console.log(error);

    }

  }
  useEffect(() => {

    TotalStnd()

  }, [])





  const STAT_CARDS = [
    {
      id: 'total-books',
      label: 'Total Books',
      value: `${totalBooks.length}`,
      icon: BookOpen,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      accent: 'border-primary/20',
    },
    {
      id: 'active-borrows',
      label: 'Active Borrowings',
      value: '3,204',
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
      value: '47',
      icon: AlertTriangle,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-600',
      accent: 'border-red-200/40',
    },
  ];

  const RECENT_ACTIVITY = [
    { id: 1, type: 'borrow', user: 'Amelia Hassan', book: 'The Name of the Rose', time: '2 min ago', status: 'success' },
    { id: 2, type: 'return', user: 'Liam Chen', book: 'Sapiens', time: '14 min ago', status: 'success' },
    { id: 3, type: 'overdue', user: 'Noah Williams', book: 'Meditations', time: '1 hr ago', status: 'warning' },
    { id: 4, type: 'borrow', user: 'Sophia Park', book: 'Dune', time: '2 hr ago', status: 'success' },
    { id: 5, type: 'return', user: 'James Okafor', book: 'A Brief History of Time', time: '3 hr ago', status: 'success' },
    { id: 6, type: 'borrow', user: 'Mia Fernandez', book: 'Crime and Punishment', time: '5 hr ago', status: 'success' },
  ];

  const TOP_BOOKS = [
    { title: 'Dune', author: 'Frank Herbert', borrows: 284, pct: 92 },
    { title: 'Sapiens', author: 'Yuval Noah Harari', borrows: 261, pct: 85 },
    { title: 'The Name of the Rose', author: 'Umberto Eco', borrows: 238, pct: 77 },
    { title: 'Meditations', author: 'Marcus Aurelius', borrows: 197, pct: 64 },
    { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', borrows: 164, pct: 53 },
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
    borrow: { icon: BookMarked, label: 'Borrowed', color: 'bg-secondary/10 text-secondary-700', dot: 'bg-secondary' },
    return: { icon: RefreshCw, label: 'Returned', color: 'bg-primary/10 text-primary-700', dot: 'bg-primary' },
    overdue: { icon: AlertTriangle, label: 'Overdue', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  };

  /** Single activity row */
  function ActivityRow({ item, index }) {
    const cfg = ACTIVITY_CONFIG[item.type];
    const Icon = cfg.icon;

    return (
      <div
        className="flex items-center gap-4 py-3 border-b border-primary/[0.05] last:border-0 animate-fade-up"
        style={{ animationDelay: `${200 + index * 60}ms` }}
      >
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${cfg.color}`}>
          <Icon size={14} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-900 truncate">{item.user}</p>
          <p className="text-xs text-primary-800/50 truncate">
            <span className="italic">{item.book}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-primary-800/40">
            <Clock size={9} />
            {item.time}
          </span>
        </div>
      </div>
    );
  }

  /** Top borrowed books bar chart */
  function TopBooksChart() {
    return (
      <div className="space-y-3">
        {TOP_BOOKS.map((book, i) => (
          <div key={i} className="animate-fade-up" style={{ animationDelay: `${300 + i * 60}ms` }}>
            <div className="flex items-center justify-between mb-1">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary-900 truncate">{book.title}</p>
                <p className="text-xs text-primary-800/45">{book.author}</p>
              </div>
              <span className="ml-3 flex-shrink-0 text-sm font-bold text-primary">{book.borrows}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-400 transition-all duration-700"
                style={{ width: `${book.pct}%`, transitionDelay: `${400 + i * 80}ms` }}
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

  return (
    <div className="min-h-full p-6 lg:p-8">

      {/* ── Page header ── */}
      <div className="mb-8 animate-fade-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary-950 leading-tight">
              Good morning, Admin
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
            <Link
              href="/admin/logs"
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-700 transition-colors"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div className="px-5 divide-y divide-primary/[0.04]">
            {RECENT_ACTIVITY.map((item, i) => (
              <ActivityRow key={item.id} item={item} index={i} />
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
          <QuickAction icon={BookCopy} label="View Borrowings" href="/admin/logs" color="bg-amber-500/10 text-amber-700" />
          <QuickAction icon={BarChart2} label="Analytics" href="/admin/analytics" color="bg-blue-500/10 text-blue-700" />
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
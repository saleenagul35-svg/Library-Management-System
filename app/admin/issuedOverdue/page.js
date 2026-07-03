'use client';

import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import customFetch from "@/lib/userAPI";
import {
  BookOpen,
  RotateCcw,
  Search,
  Filter,
  ChevronDown,
  AlertTriangle,
  Loader2,
  BookMarked,
  Hash,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${day} ${month} ${year}`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'Overdued') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-red-100 text-red-700 border border-red-200">
        <AlertTriangle size={10} strokeWidth={2.5} />
        Overdue
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-secondary/10 text-secondary-700 border border-secondary/20">
      <CheckCircle2 size={10} strokeWidth={2} />
      Borrowed
    </span>
  );
}

// ─── Book Card (Mobile) ───────────────────────────────────────────────────────
function BookCard({ record, onReturn, returning }) {
  return (
    <div className="rounded-2xl border p-4 transition-all duration-200 bg-card-bg border-primary/15">
      {/* Book title row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 mt-0.5 bg-primary/10">
            <BookMarked size={18} className="text-primary" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-snug text-primary-950">
              {record.bookId.Title}
            </p>
            <p className="text-xs mt-0.5 text-primary-800/40">
              {record.bookId.Author}
            </p>
          </div>
        </div>
        <StatusBadge status={record.status} />
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg p-2.5 bg-primary/[0.02] border border-primary/[0.04]">
          <p className="text-[10px] uppercase tracking-wider mb-1 text-primary-800/30">
            Borrower
          </p>
          <p className="text-xs font-medium truncate text-primary-800/85">
            {record.userId.name}
          </p>
          <p className="text-[11px] truncate text-primary-800/40">
            REG-{record.userId.id}
          </p>
        </div>
        <div className="rounded-lg p-2.5 bg-primary/[0.02] border border-primary/[0.04]">
          <p className="text-[10px] uppercase tracking-wider mb-1 text-primary-800/30">
            Due Date
          </p>
          <p className={`text-xs font-medium ${record.status === 'Overdued' ? 'text-red-600' : 'text-primary-800/85'}`}>
            {formatDate(record.dueDate)}
          </p>
          <p className="text-[11px] text-primary-800/40">
            Issued {formatDate(record.issueDate)}
          </p>
        </div>
      </div>

      {/* Return button */}
      <button
        onClick={() => onReturn(record._id)}
        disabled={returning === record._id}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] bg-primary/10 text-primary-800 border border-primary/20 hover:bg-primary/20"
      >
        {returning === record._id ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <RotateCcw size={14} strokeWidth={2.2} />
        )}
        {returning === record._id ? 'Marking...' : 'Mark as Returned'}
      </button>
    </div>
  );
}

// ─── Table Row (Desktop) ──────────────────────────────────────────────────────
function TableRow({ record, onReturn, returning, index }) {
  return (
    <tr
      className="border-b border-primary/[0.08] transition-colors duration-150 group hover:bg-primary/[0.02]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Book */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0 bg-primary/10">
            <BookMarked size={15} className="text-primary" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-snug text-primary-950">
              {record.bookId.Title}
            </p>
            <p className="text-xs mt-0.5 text-primary-800/40">
              {record.bookId.Author}
            </p>
          </div>
        </div>
      </td>

      {/* Borrower */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 text-xs font-bold bg-primary/5 text-primary-800/70">
            {record.userId.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-primary-800/85">
              {record.userId.name}
            </p>
            <p className="text-[11px] flex items-center gap-1 text-primary-800/35">
              REG-{record.userId.id}
            </p>
          </div>
        </div>
      </td>

      {/* Issue Date */}
      <td className="px-5 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-primary-800/30" />
          <span className="text-sm text-primary-800/55">
            {formatDate(record.issueDate)}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className="px-5 py-4">
        <span className={`text-sm font-medium ${record.status === 'Overdued' ? 'text-red-600' : 'text-primary-800/75'}`}>
          {formatDate(record.dueDate)}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={record.status} />
      </td>

      {/* Action */}
      <td className="px-5 py-4">
        <button
          onClick={() => onReturn(record._id)}
          disabled={returning === record._id}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 bg-primary/10 text-primary-800 border border-primary/20 hover:bg-primary/20"
        >
          {returning === record._id ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <RotateCcw size={12} strokeWidth={2.2} />
          )}
          {returning === record._id ? 'Processing...' : 'Mark Returned'}
        </button>
      </td>
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function IssuedBooks() {
  const [returning, setReturning] = useState(null);
  const [alert, setAlert] = useState(false)
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'Borrowed' | 'Overdued'
  const [filterOpen, setFilterOpen] = useState(false);


  // ── Fetch issued books ──
  const fetchData = async (url) => {

    try {
      const response = await customFetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      throw error
    }
  };
  const { data: records = [], isLoading: L1,refetch } = useQuery({
    queryKey: ["BorrowedBooks"],
    queryFn: () => fetchData("/api/BorrowedBooks"),
    refetchInterval: 5000,
    staleTime: 5000,
    gcTime: 10 * 60 * 1000
  })


  // ── Mark as returned ──
  const handleReturn = async (recordId) => {
    setReturning(recordId);
    try {

      const res = await customFetch(`/api/returnBook/${recordId}`, {
        method: 'PUT',
        headers: {
   
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        refetch()
      }
    } catch (error) {
      setAlert("Something went wrong")
    } finally {
      setReturning(null);
    }
  };

  // ── Filters + Search ──
  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.bookId.Title.toLowerCase().includes(q) ||
      r.userId.name.toLowerCase().includes(q) ||
      r.userId.id.toString().toLowerCase().includes(q)

    const matchFilter = filter === 'all' || r.status === filter;

    return matchSearch && matchFilter;
  });

  const overdueCount = records.filter((r) => r.status === 'Overdued').length;
  const borrowedCount = records.filter((r) => r.status === 'Borrowed').length;

  const filterLabels = {
    all: 'All Issued',
    Borrowed: 'Borrowed',
    Overdued: 'Overdue',
  };
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [alert])
  if (L1) {
    return (
      <Stack
        sx={{ color: 'grey.500' }}
        className="flex justify-center items-center min-h-screen"
        spacing={2}
        direction="row"
      >
        <CircularProgress sx={{ color: '#52512a' }} />
      </Stack>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-full">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen size={18} className="text-primary" strokeWidth={1.75} />
            </div>
            <h1 className="text-xl font-bold text-primary-950">Issued Books</h1>
          </div>
          <p className="text-sm ml-12 text-primary-800/45">
            {records.length} book{records.length !== 1 ? 's' : ''} currently borrowed
            {overdueCount > 0 && (
              <span className="ml-2 text-red-600 font-medium">
                · {overdueCount} overdue
              </span>
            )}
          </p>
        </div>

        {/* Stats chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary-700 border border-secondary/20">
            <BookMarked size={11} />
            {borrowedCount} Borrowed
          </span>
          {overdueCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-700 border border-red-200">
              <AlertTriangle size={11} />
              {overdueCount} Overdue
            </span>
          )}
        </div>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-800/30" />
          <input
            type="text"
            placeholder="Search by book, borrower, roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200 bg-card-bg border border-primary/15 text-primary-950 placeholder:text-primary-800/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen((p) => !p)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap bg-card-bg border border-primary/15 text-primary-800/70 hover:border-primary/30 hover:text-primary"
          >
            <Filter size={14} />
            {filterLabels[filter]}
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden z-20 shadow-xl bg-card-bg border border-primary/20">
              {[
                { key: 'all', label: 'All Issued' },
                { key: 'Borrowed', label: `Borrowed (${borrowedCount})` },
                { key: 'Overdued', label: `Overdue (${overdueCount})` },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setFilter(opt.key); setFilterOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-primary/5"
                  style={{
                    color: filter === opt.key ? '#52512a' : 'rgba(0,0,0,0.55)',
                    background: filter === opt.key ? 'rgba(82,81,42,0.08)' : 'transparent',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5">
            <BookOpen size={28} className="text-primary-800/40" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-primary-800/60">
              {search || filter !== 'all' ? 'No matching records' : 'No books currently issued'}
            </p>
            <p className="text-xs mt-1 text-primary-800/30">
              {search ? `No results for "${search}"` : 'All books have been returned'}
            </p>
          </div>
          {(search || filter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setFilter('all'); }}
              className="text-xs px-4 py-2 rounded-lg transition-colors border border-primary/30 text-primary hover:bg-primary/5"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Mobile Cards ── */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {filtered.map((record) => (
            <BookCard
              key={record._id}
              record={record}
              onReturn={handleReturn}
              returning={returning}
            />
          ))}
        </div>
      )}

      {/* ── Desktop Table ── */}
      {filtered.length > 0 && (
        <div className="hidden md:block rounded-2xl overflow-hidden border border-primary/[0.1] bg-card-bg shadow-brand-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/[0.08] bg-brand-bg/50">
                {['Book', 'Borrower', 'Issued On', 'Due Date', 'Status', 'Action'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50 ${i === 2 ? 'hidden lg:table-cell' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, i) => (
                <TableRow
                  key={record._id}
                  record={record}
                  onReturn={handleReturn}
                  returning={returning}
                  index={i}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {alert && <Stack spacing={2} className="fixed top-17 right-15 w-100 z-1000">
        <Alert sx={{ backgroundColor: "#54552b", color: "#fdfdef" }} severity="error">{alert}</Alert>
      </Stack>}
    </div>
  );
}
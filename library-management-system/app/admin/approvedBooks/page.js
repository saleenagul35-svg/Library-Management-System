'use client';

import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Calendar,
  Search,
  CheckCircle2,
  Loader2,
  BookMarked,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month} ${year}`;
}


// ─── Book Card (Mobile) ───────────────────────────────────────────────────────
function BookCard({ record, onIssue, issuing }) {
  return (
    <div className="rounded-2xl border p-4 transition-all duration-200 bg-card-bg border-primary/15">
      {/* Book title row */}
      <div className="flex items-start gap-3 mb-3">
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

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg p-2.5 bg-primary/[0.02] border border-primary/[0.04]">
          <p className="text-[10px] uppercase tracking-wider mb-1 text-primary-800/30">
            Requester
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
            Approved On
          </p>
          <p className="text-xs font-medium text-primary-800/85">
            {formatDate(record.approvedDate)}
          </p>
        </div>
        <div className="rounded-lg p-2.5 bg-primary/[0.02] border border-primary/[0.04]">
          <p className="text-[10px] uppercase tracking-wider mb-1 text-primary-800/30">
            Expire Date
          </p>
          <p className="text-xs font-medium text-primary-800/85">
            {formatDate(record.expireDate)}
          </p>
        </div>
      </div>

      {/* Issue button */}
      <button
        onClick={() => onIssue(record._id)}
        disabled={issuing === record._id}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] bg-primary/10 text-primary-800 border border-primary/20 hover:bg-primary/20"
      >
        {issuing === record._id ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <BookMarked size={14} strokeWidth={2.2} />
        )}
        {issuing === record._id ? 'Issuing...' : 'Issue Book'}
      </button>
    </div>
  );
}

// ─── Table Row (Desktop) ──────────────────────────────────────────────────────
function TableRow({ record, onIssue, issuing, index }) {
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

      {/* Requester */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 text-xs font-bold bg-secondary/20 text-primary-800/70">
            {record.userId.name.charAt(0)}
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

      {/* Approved On */}
      <td className="px-5 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-primary-800/30" />
          <span className="text-sm text-primary-800/55">
            {formatDate(record.approvedDate)}
          </span>
        </div>
      </td>
      <td className="px-5 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-primary-800/30" />
          <span className="text-sm text-primary-800/55">
            {formatDate(record.expireDate)}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-secondary/10 text-secondary-700 border border-secondary/20">
          <CheckCircle2 size={10} strokeWidth={2} />
          Approved
        </span>
      </td>

      {/* Action */}
      <td className="px-5 py-4">
        <button
          onClick={() => onIssue(record._id)}
          disabled={issuing === record._id}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 bg-primary/10 text-primary-800 border border-primary/20 hover:bg-primary/20"
        >
          {issuing === record._id ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <BookMarked size={12} strokeWidth={2.2} />
          )}
          {issuing === record._id ? 'Issuing...' : 'Issue Book'}
        </button>
      </td>
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ApprovedBooks() {
  const [issuing, setIssuing] = useState(null);
  const [search, setSearch] = useState('');
    // ── Fetch approved books ──
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
const {data : records = [], isPending: P1 } = useQuery({
  queryKey: ["approvedRequestsData"],
  queryFn: ()=>fetchData("http://localhost:5000/api/approvedRequestsData"),
  refetchInterval: 500
})

  // ── Issue book ──
  const handleIssue = async (recordId) => {
    setIssuing(recordId)
    try {
      const token = localStorage.getItem('Admintoken');
      await fetch(`http://localhost:5000/api/BookIssue/${recordId}`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIssuing(null);
    }
  };


  // ── Search filter ──
  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.bookId.Title.toLowerCase().includes(q) ||
      r.userId.name.toLowerCase().includes(q) ||
        r.userId.id.toString().toLowerCase().includes(q)
    );
  });
  if (P1) {
    return (
      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">

        <CircularProgress sx={{ color: "#52512a" }} />

      </Stack>
    )
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
            <h1 className="text-xl font-bold text-primary-950">
              Approved Books
            </h1>
          </div>
          <p className="text-sm ml-12 text-primary-800/45">
            {records.length} book{records.length !== 1 ? 's' : ''} approved &amp; ready to issue
          </p>
        </div>

        {/* Stats chip */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary-700 border border-secondary/20">
            <CheckCircle2 size={11} />
            {records.length} Approved
          </span>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-800/30"
          />
          <input
            type="text"
            placeholder="Search by book, requester, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200 bg-card-bg border border-primary/15 text-primary-950 placeholder:text-primary-800/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
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
              {search ? 'No matching records' : 'No approved books found'}
            </p>
            <p className="text-xs mt-1 text-primary-800/30">
              {search ? `No results for "${search}"` : 'Approved requests will appear here'}
            </p>
          </div>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs px-4 py-2 rounded-lg transition-colors border border-primary/30 text-primary hover:bg-primary/5"
            >
              Clear search
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
              onIssue={handleIssue}
              issuing={issuing}
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
                {['Book', 'Requester', 'Approved On', 'Expire Date', 'Status', 'Action'].map((h, i) => (
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
                  onIssue={handleIssue}
                  issuing={issuing}
                  index={i}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
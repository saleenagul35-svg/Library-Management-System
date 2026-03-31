'use client';

import { useEffect, useState } from 'react';
import {
  Search, Plus, Filter, BookOpen,
  ChevronUp, ChevronDown, MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';


const STATUS_STYLES = {
  available: 'bg-secondary/10 text-secondary-700',
  borrowed: 'bg-primary/10 text-primary-700',
  overdue: 'bg-red-100 text-red-700',
};

export default function InventoryPage() {

  const [books, setBooks] = useState([])


  useEffect(() => {
    const getFun = async () => {
      try {
        const token = localStorage.getItem("Admintoken")
        const response = await fetch("http://localhost:5000/data", {
          method: "GET",
          headers: {
            "authorization": `Bearer ${token}`
          }

        })
        const Data = await response.json()
        const dataArray = Data.data
        setBooks(dataArray)

      } catch (error) {
        console.log(error);

      }
    }
    getFun()
    console.log("useEffect running")
  }

    , [])



  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDir, setSortDir] = useState('asc');

  const filtered = books

    .filter(b =>
      b.Title.toLowerCase().includes(search.toLowerCase()) ||
      b.Author.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const v = String(a[sortField]).localeCompare(String(b[sortField]));
      return sortDir === 'asc' ? v : -v;
    });

  function toggleSort(field) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  function SortIcon({ field }) {
    if (sortField !== field) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary" />
      : <ChevronDown size={12} className="text-primary" />;
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">Book Inventory</h1>
          <p className="mt-1 text-sm text-primary-800/50">{books
            .length} books in catalogue</p>
        </div>
        <Link href="/admin/inventory/new" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-brand-sm hover:bg-primary-600 hover:-translate-y-px transition-all">
          <Plus size={15} strokeWidth={2.5} /> Add Book
        </Link>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/35" />
          <input
            className="w-full rounded-xl border border-primary/15 bg-card-bg py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-primary/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="Search by title or author…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-card-bg px-4 py-2.5 text-sm font-medium text-primary/60 hover:border-primary/30 hover:text-primary transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-primary/[0.1] bg-card-bg shadow-brand-sm overflow-hidden animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/[0.08] bg-brand-bg/50">
                {[['Title', 'Title'], ['Author', 'Author'], ['Genre', 'Genre']].map(([f, l]) => (
                  <th key={f} className="px-5 py-3.5 text-left">
                    <button onClick={() => toggleSort(f)} className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50 hover:text-primary transition-colors">
                      {l} <SortIcon field={f} />
                    </button>
                  </th>
                ))}
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50">Copies</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/[0.04]">
              {filtered.map((book, i) => (
                <tr key={book.id} className="group hover:bg-primary/[0.02] transition-colors animate-fade-up" style={{ animationDelay: `${200 + i * 40}ms` }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary/60 flex-shrink-0">
                        <BookOpen size={14} strokeWidth={1.75} />
                      </div>
                      <span className="font-medium text-primary-950">{book.Title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-primary-800/60">{book.Author}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-brand-bg px-2.5 py-1 text-[11px] font-medium text-primary-800/60">
                      {book.Genre}
                    </span>
                  </td>
                  <td className="px-5 py-4">

                    <span className="rounded-full bg-brand-bg px-2.5 py-1 text-[11px] font-medium text-primary-800/60">{book.Copy}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[book.Status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {book.Status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-primary/30 hover:bg-primary/8 hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between border-t border-primary/[0.06] px-5 py-3">
          <p className="text-xs text-primary-800/40">
            Showing <strong className="text-primary-800/70">{filtered.length}</strong> of <strong className="text-primary-800/70">{books
              .length}</strong> books
          </p>
          {/* TODO: wire pagination to API (?page=&limit=) */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`h-7 w-7 rounded-lg text-xs font-medium transition-all ${p === 1 ? 'bg-primary text-white' : 'text-primary/50 hover:bg-primary/8 hover:text-primary'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
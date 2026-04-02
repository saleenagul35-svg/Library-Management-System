'use client';

import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Search, Plus, Filter, BookOpen,
  ChevronUp, ChevronDown, Pencil, Trash2,
  X, AlertTriangle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLES = {
  available: 'bg-secondary/10 text-secondary-700',
  borrowed: 'bg-primary/10 text-primary-700',
  overdue: 'bg-red-100 text-red-700',
};

const BOOKS_PER_PAGE = 10;

/* ─── Delete Confirmation Modal ─────────────────────────────────────── */
function DeleteModal({ book, onCancel, onConfirm }) {
  if (!book) return null;
  return (
    /* backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>

      {/* card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl animate-fade-up overflow-hidden">

        {/* top accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary-600" />

        {/* close */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-primary/30 hover:bg-primary/8 hover:text-primary transition-all">
          <X size={15} />
        </button>

        <div className="px-6 pb-6 pt-5">
          {/* icon + heading */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-600 flex-shrink-0">
              <AlertTriangle size={18} strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-primary-950">Delete Book?</h2>
              <p className="text-xs text-primary-800/50">This action cannot be undone.</p>
            </div>
          </div>

          {/* book info card */}
          <div className="mb-5 rounded-xl border border-primary/10 bg-brand-bg/60 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <BookOpen size={16} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-primary-950 truncate">{book.Title}</p>
                <p className="text-xs text-primary-800/60 mt-0.5">{book.Author}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {book.Genre && (
                    <span className="rounded-full bg-brand-bg border border-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary-800/60">
                      {book.Genre}
                    </span>
                  )}
                  {book.Copy !== undefined && (
                    <span className="rounded-full bg-brand-bg border border-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary-800/60">
                      {book.Copy} {book.Copy === 1 ? 'copy' : 'copies'}
                    </span>
                  )}
                  {book.Status && (
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLES[book.Status] ?? ''}`}>
                      {book.Status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onCancel}
              className="rounded-xl border border-primary/15 bg-white px-4 py-2 text-sm font-medium text-primary/70 hover:border-primary/30 hover:text-primary transition-all">
              Cancel
            </button>
            <button
              onClick={() => onConfirm(book)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 hover:-translate-y-px transition-all">
              <Trash2 size={13} strokeWidth={2.5} /> Delete Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Pagination ─────────────────────────────────────────────────────── */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // build page numbers array with ellipsis logic
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-primary/50 hover:bg-primary/8 hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-all">
        <ChevronLeft size={13} />
      </button>

      {pages.map((p, idx) =>
        p === '...'
          ? <span key={`el-${idx}`} className="px-1 text-xs text-primary/30">…</span>
          : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-7 w-7 rounded-lg text-xs font-medium transition-all ${p === currentPage
                ? 'bg-primary text-white shadow-sm'
                : 'text-primary/50 hover:bg-primary/8 hover:text-primary'
                }`}>
              {p}
            </button>
          )
      )}

      {/* next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-primary/50 hover:bg-primary/8 hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-all">
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function InventoryPage() {
  const [loader, setLoader] = useState(true);
  const [books, setBooks] = useState([]);

  // modal state
  const [bookToDelete, setBookToDelete] = useState(null);

  // search / sort / page
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('Title');
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  /* fetch */
  const fetchingAPIs = async () => {
    try {
      const token = localStorage.getItem('Admintoken');
      const headers = {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const res1 = await fetch('http://localhost:5000/api/bookData', { method: 'GET', headers });
      const data1 = res1.ok ? await res1.json() : null;
      if (data1) setBooks(data1.data);
      
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => { fetchingAPIs(); }, []);

  /* reset to page 1 when search changes */
  useEffect(() => { setCurrentPage(1); }, [search]);

  /* sort + filter */
  const filtered = books
    .filter(b =>
      b?.Title?.toLowerCase().includes(search.toLowerCase()) ||
      b?.Author?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const v = String(a[sortField] ?? '').localeCompare(String(b[sortField] ?? ''));
      return sortDir === 'asc' ? v : -v;
    });

  /* pagination math */
  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  );

  function toggleSort(field) {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  }

  function SortIcon({ field }) {
    if (sortField !== field) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary" />
      : <ChevronDown size={12} className="text-primary" />;
  }

  /* handlers — UI only, no API calls */
  function handleEditClick(book) {
    // TODO: add your own edit logic / navigation here
    console.log('Edit book:', book);
  }

  function handleDeleteClick(book) {
    setBookToDelete(book);
  }

  function handleDeleteCancel() {
    setBookToDelete(null);
  }

  function handleDeleteConfirm(book) {
    // TODO: add your own delete API call here
    console.log('Confirmed delete for:', book);
    setBookToDelete(null);
  }

  if (loader) {
    return (
      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">
        <CircularProgress sx={{ color: '#52512a' }} />
      </Stack>
    );
  }

  return (
    <>
      {/* Delete Modal */}
      <DeleteModal
        book={bookToDelete}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <div className="min-h-full p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 animate-fade-up">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary-950">Book Inventory</h1>
            <p className="mt-1 text-sm text-primary-800/50">{books.length} books in catalogue</p>
          </div>
          <Link
            href="/admin/inventory/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-brand-sm hover:bg-primary-600 hover:-translate-y-px transition-all">
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
                  {/* Actions column */}
                  <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-800/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/[0.04]">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-primary/40">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((book, i) => (
                    <tr
                      key={book._id ?? i}
                      className="group hover:bg-primary/[0.02] transition-colors animate-fade-up"
                      style={{ animationDelay: `${200 + i * 40}ms` }}>

                      {/* Title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary/60 flex-shrink-0">
                            <BookOpen size={14} strokeWidth={1.75} />
                          </div>
                          <span className="font-medium text-primary-950">{book.Title}</span>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-5 py-4 text-primary-800/60">{book.Author}</td>

                      {/* Genre */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-brand-bg px-2.5 py-1 text-[11px] font-medium text-primary-800/60">
                          {book.Genre}
                        </span>
                      </td>

                      {/* Copies */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-brand-bg px-2.5 py-1 text-[11px] font-medium text-primary-800/60">
                          {book.Copy}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[book.Status] ?? ''}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {book.Status}
                        </span>
                      </td>

                      {/* Actions: Edit + Delete */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5 transition-opacity">

                          {/* Edit button */}
                          <button
                            onClick={() => handleEditClick(book)}
                            title="Edit book"
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-primary/40
                              hover:bg-primary/10 hover:text-primary
                              transition-all duration-150 active:scale-95">
                            <Pencil size={13} strokeWidth={2} />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteClick(book)}
                            title="Delete book"
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-primary/40
                              hover:bg-primary/10 hover:text-primary-800/60
                              transition-all duration-150 active:scale-95">
                            <Trash2 size={13} strokeWidth={2} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer — count + pagination */}
          <div className="flex items-center justify-between border-t border-primary/[0.06] px-5 py-3">
            <p className="text-xs text-primary-800/40">
              Showing{' '}
              <strong className="text-primary-800/70">
                {filtered.length === 0 ? 0 : (currentPage - 1) * BOOKS_PER_PAGE + 1}–{Math.min(currentPage * BOOKS_PER_PAGE, filtered.length)}
              </strong>{' '}
              of <strong className="text-primary-800/70">{filtered.length}</strong> books
            </p>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
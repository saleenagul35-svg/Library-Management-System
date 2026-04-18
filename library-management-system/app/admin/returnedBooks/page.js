'use client';

import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import {

    Calendar,
    RotateCcw,
    Search,
    CheckCircle2,
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
function BookCard({ record }) {
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
                        Borrowed On
                    </p>
                    <p className="text-xs font-medium text-primary-800/85">
                        {formatDate(record.issueDate)}
                    </p>
                </div>
                <div className="rounded-lg p-2.5 bg-primary/[0.02] border border-primary/[0.04]">
                    <p className="text-[10px] uppercase tracking-wider mb-1 text-primary-800/30">
                        Returned On
                    </p>
                    <p className="text-xs font-medium text-primary-800/85">
                        {formatDate(record.returnDate)}
                    </p>
                </div>
            </div>

        </div>
    );
}

// ─── Table Row (Desktop) ──────────────────────────────────────────────────────
function TableRow({ record, index }) {
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

            {/* Borrowed On */}
            <td className="px-5 py-4 hidden lg:table-cell">
                <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-primary-800/30" />
                    <span className="text-sm text-primary-800/55">
                        {formatDate(record.issueDate)}
                    </span>
                </div>
            </td>
            <td className="px-5 py-4 hidden lg:table-cell">
                <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-primary-800/30" />
                    <span className="text-sm text-primary-800/55">
                        {formatDate(record.returnDate)}
                    </span>
                </div>
            </td>

            {/* Status */}
            <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-primary/10 text-primary-800 border border-primary/20 hover:bg-primary/20">
                    <CheckCircle2 size={10} strokeWidth={2} />
                    {record.status}
                </span>
            </td>
        </tr>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function returnedBooks() {
    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState('');

    const [loader, setLoader] = useState(true)


    // ── Fetch returned Books──
    const fetchingAPIs = async () => {
        try{
            const token = localStorage.getItem('Admintoken');
            const response = await fetch("http://localhost:5000/api/returnedBooks", {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRecords(data.data);

            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false)

        }
    };
    useEffect(() => {
        fetchingAPIs()
    }, []);



    // ── Search filter ──
    const filtered = records.filter((r) => {
        const q = search.toLowerCase();
        return (
            !q ||
            r.book.title.toLowerCase().includes(q) ||
            r.user.name.toLowerCase().includes(q) ||
            r.user.rollNo.toLowerCase().includes(q) ||
            r.user.email.toLowerCase().includes(q)
        );
    });
    if (loader) {
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
                            <RotateCcw size={18} className="text-primary" strokeWidth={1.75} />
                        </div>
                        <h1 className="text-xl font-bold text-primary-950">
                            Returned Books 
                        </h1>
                    </div>
                    <p className="text-sm ml-12 text-primary-800/45">
                        {records.length} book{records.length !== 1 ? 's' : ''} Returned
                    </p>
                </div>

                {/* Stats chip */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium  border  bg-primary/10 text-primary-800 border border-primary/20 hover:bg-primary/20">
                        <CheckCircle2 size={11} />
                        {records.length} Returned
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
                        placeholder="Search by book, Borrower, ID"
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
                        <RotateCcw size={28} className="text-primary-800/40" strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-primary-800/60">
                            {search ? 'No matching records' : 'No Returned books found'}
                        </p>
                        <p className="text-xs mt-1 text-primary-800/30">
                            {search ? `No results for "${search}"` : 'Returned books will appear here'}
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
                                {['Book', 'Borrower', 'Borrowed On', 'Returned On', 'Status'].map((h, i) => (
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
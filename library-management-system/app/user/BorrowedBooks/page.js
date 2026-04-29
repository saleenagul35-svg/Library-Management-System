"use client";

import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import customFetch from "@/lib/userAPI";
const STATUS_CONFIG = {
  Borrowed: { label: "Active", bg: "bg-[#e8f0e0]", color: "text-[#4a6b3a]", dot: "bg-[#6b9e50]" },
  "due-soon": { label: "Due Soon", bg: "bg-[#fef3e2]", color: "text-[#8b5e1a]", dot: "bg-[#8b5e1a]" },
  Overdued: { label: "Overdue", bg: "bg-[#fde8e8]", color: "text-[#8b2a2a]", dot: "bg-[#d94f4f]" },
  Returned: { label: "Returned", bg: "bg-[#ece8f0]", color: "text-[#5a4a6b]", dot: "bg-[#9b80c8]" },
};

function computeStatus(book) {
  if (book.status !== "Borrowed") return book.status;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(book.dueDate);
  due.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (daysLeft >= 0 && daysLeft <= 3) return "due-soon";
  return book.status;
}

function getDaysLeft(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Book Row Card ─────────────────────────────────────────────────────────────
function BorrowedBookRow({ book, index }) {
  const colors = ["bg-[#515427]", "bg-[#8b5e1a]", "bg-[#7a6f4e]", "bg-[#864c25]"];
  const [hovered, setHovered] = useState(false);

  const status = STATUS_CONFIG[computeStatus(book)];
  const computedStatus = computeStatus(book);
  const daysLeft = getDaysLeft(book.dueDate);
  const initials = book.bookId.Title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const bgColor = colors[index % colors.length];

  const dueDateColor =
    computedStatus === "Overdued"
      ? "text-[#d94f4f]"
      : computedStatus === "due-soon"
        ? "text-[#e6a832]"
        : "text-[#7a6f4e]";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`grid items-center gap-[18px] rounded-[14px] px-[22px] py-[18px] border transition-all duration-[250ms] ease-[cubic-bezier(.16,1,.3,1)]
        ${hovered
          ? "bg-[#fafaf0] border-[rgba(200,185,154,.5)] shadow-[0_8px_32px_rgba(81,84,39,.1)]"
          : "bg-[#fffff3] border-[rgba(200,185,154,.2)] shadow-[0_2px_8px_rgba(81,84,39,.04)]"
        }`}
      style={{ gridTemplateColumns: "64px 1fr auto" }}
    >
      {/* Cover thumbnail */}
      <div className={`${bgColor} w-[64px] h-[80px] rounded-[8px] flex items-center justify-center flex-shrink-0 shadow-[0_4px_14px_rgba(0,0,0,.18)] relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <span className="text-[15px] text-white/92 font-serif font-bold relative z-10">{initials}</span>
      </div>

      {/* Book info */}
      <div className="min-w-0">
        <div className="flex items-center gap-[10px] flex-wrap mb-1">
          <h3 className="text-[#515427] text-[15px] font-bold font-serif m-0 whitespace-nowrap overflow-hidden text-ellipsis">
            {book.bookId.Title}
          </h3>
          <span className={`${status.bg} ${status.color} text-[10px] font-semibold px-[9px] py-[2px] rounded-[20px] flex items-center gap-1 flex-shrink-0`}>
            <span className={`${status.dot} w-[5px] h-[5px] rounded-full inline-block`} />
            {status.label}
          </span>
        </div>
        <p className="text-[#9b8a6a] text-[12px] mb-2 italic">
          by {book.bookId.Author} · {book.bookId.Genre} · {book.bookId.Pages} pages
        </p>
        <div className="flex gap-5 flex-wrap">
          <div className="text-[11px] text-[#b0a080]">
            <span className="text-[#9b8a6a] font-medium">Borrowed:</span> {formatDate(book.issueDate)}
          </div>
          <div className="text-[11px]">
            <span className="text-[#9b8a6a] font-medium">Due:</span>{" "}
            <span className={`${dueDateColor} ${book.status === "Overdued" ? "font-semibold" : "font-normal"}`}>
              {formatDate(book.dueDate)}
              {book.status !== "Returned" && (
                <span className="ml-[6px] text-[10px]">
                  {book.status === "Overdued"
                    ? `(${Math.abs(daysLeft)}d Overdued)`
                    : `(${daysLeft}d left)`}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-[7px] flex-shrink-0">
        {book.status === "Returned" && (
          <span className="text-[12px] text-[#9b8a6a] px-[18px] py-2 text-center">Returned</span>
        )}
      </div>
    </div>
  );
}

// ─── Progress Ring ─────────────────────────────────────────────────────────────
function ProgressRing({ value, max, color, label, sublabel }) {
  const r = 32, circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex items-center gap-4">
      <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(200,185,154,.2)" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset .8s ease" }}
        />
      </svg>
      <div>
        <div className="font-serif text-[22px] font-bold text-[#515427]">
          {value}<span className="text-[13px] text-[#9b8a6a] font-serif">/{max}</span>
        </div>
        <div className="text-[12px] font-semibold text-[#7a6f4e]">{label}</div>
        <div className="text-[11px] text-[#b0a080]">{sublabel}</div>
      </div>
    </div>
  );
}

// ─── Main BorrowedBooksPage ────────────────────────────────────────────────────
export default function BorrowedBooksPage() {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");


  const filters = ["All", "Active", "Due Soon", "Overdue", "Returned"];
  const filterMap = { "All": null, "Active": "Borrowed", "Due Soon": "due-soon", "Overdue": "Overdued", "Returned": "Returned" };


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
  const { data: userdata = [], isLoading: L1 } = useQuery({
    queryKey: ["UserData"],
    queryFn: () => fetchData("/api/UserData"),
    refetchInterval: 60000,
    staleTime: 60000,
    gcTime: 10 * 60 * 1000
  })
  const filtered = userdata
    .filter(b => !filterMap[filter] || computeStatus(b) === filterMap[filter])
    .sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "title") return a.bookId.Title.localeCompare(b.bookId.Title);
      if (sortBy === "issueDate") return new Date(b.issueDate) - new Date(a.issueDate);
      return 0;
    });

  const stats = {
    active: userdata.filter(b => b.status === "Borrowed").length,
    overdue: userdata.filter(b => b.status === "Overdued").length,
    dueSoon: userdata.filter(b => computeStatus(b) === "due-soon").length,
    returned: userdata.filter(b => b.status === "Returned").length,
    total: userdata.length,
  };

  if (L1) {
    return (
      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">
        <CircularProgress sx={{ color: "#52512a" }} />
      </Stack>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-8 pt-10 pb-[72px] font-sans">

      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-[10px] mb-[6px]">
          <span className="text-[28px]">📖</span>
          <h1 className="font-serif text-[28px] font-bold text-[#515427] m-0">My Borrowed Books</h1>
        </div>
        <p className="text-[#9b8a6a] text-[14px] m-0">Track your reading journey and manage your borrowed collection</p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        {[
          { label: "Currently Borrowed", val: stats.active + stats.overdue, sub: "books in hand", color: "text-[#6b9e50]", bg: "bg-[#f0f5eb]", border: "border-[#6b9e5022]" },
          { label: "Overdue", val: stats.overdue, sub: "need immediate return", color: "text-[#d94f4f]", bg: "bg-[#fde8e8]", border: "border-[#d94f4f22]" },
          { label: "Due This Week", val: stats.dueSoon, sub: "return soon", color: "text-[#e6a832]", bg: "bg-[#fef3e2]", border: "border-[#e6a83222]" },
          { label: "Total Borrowed", val: stats.total, sub: "all time", color: "text-[#9b80c8]", bg: "bg-[#ece8f0]", border: "border-[#9b80c822]" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} ${s.border} rounded-[14px] px-[22px] py-5 border`}>
            <div className={`font-serif text-[30px] font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[12px] font-semibold text-[#515427] mt-[2px]">{s.label}</div>
            <div className="text-[11px] text-[#9b8a6a] mt-[1px]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Quota Tracker ── */}
      <div className="bg-[#f8f7ec] rounded-[16px] px-7 py-6 border border-[rgba(200,185,154,.3)] mb-8 flex items-center justify-between flex-wrap gap-5">
        <div>
          <h3 className="font-serif text-[16px] text-[#515427] m-0 mb-1">Borrowing Quota</h3>
          <p className="text-[12px] text-[#9b8a6a] m-0">Premium members can borrow up to 5 books simultaneously</p>
        </div>
        <ProgressRing value={stats.active + stats.overdue} max={5} color="#864c25" label="Books Borrowed" sublabel="" />
      </div>

      {/* ── Filters & Sort ── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-[6px] flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-[14px] py-[6px] rounded-[20px] border-[1.5px] text-[12px] cursor-pointer font-[inherit] transition-all duration-[180ms]
                ${filter === f
                  ? "bg-[#515427] text-[#fffff3] border-[#515427] font-semibold"
                  : "bg-transparent text-[#7a6f4e] border-[rgba(200,185,154,.45)]"
                }`}
            >
              {f}
              {f !== "All" && filterMap[f] && (
                <span className="ml-[5px] text-[10px] opacity-80">
                  ({userdata.filter(b => computeStatus(b) === filterMap[f]).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#9b8a6a]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-[6px] rounded-[8px] border-[1.5px] border-[rgba(200,185,154,.45)] bg-[#fffff3] text-[#515427] text-[12px] font-[inherit] cursor-pointer outline-none"
          >
            <option value="dueDate">Due Date</option>
            <option value="issueDate">Borrowed Date</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </div>

      {/* ── Book List ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-[60px] px-5 text-[#9b8a6a]">
          <div className="text-[36px] mb-3">📭</div>
          <h3 className="text-[18px] text-[#515427] font-serif mb-[6px]">No books here</h3>
          <p className="text-[14px]">You have no books in this category.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((book, index) => (
            <BorrowedBookRow key={book._id} book={book} index={index} />
          ))}
        </div>
      )}

      {/* ── Overdue Banner ── */}
      {stats.overdue > 0 && (
        <div className="mt-7 bg-[#fde8e8] border border-[#f5c0c0] rounded-[14px] px-[22px] py-[18px] flex items-center gap-[14px]">
          <span className="text-[22px]">⚠️</span>
          <div>
            <div className="text-[14px] font-semibold text-[#8b2a2a] mb-[2px]">
              You have {stats.overdue} overdue book{stats.overdue > 1 ? "s" : ""}
            </div>
            <div className="text-[12px] text-[#b05050]">
              Late returns may affect your borrowing privileges. Please return them as soon as possible.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
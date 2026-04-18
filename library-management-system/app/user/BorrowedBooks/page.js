"use client";

import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const STATUS_CONFIG = {
  Borrowed: { label: "Active", bg: "#e8f0e0", color: "#4a6b3a", dot: "#6b9e50" },
  "due-soon": { label: "Due Soon", bg: "#fef3e2", color: "#8b5e1a", dot: "#e6a832" },
  Overdued: { label: "Overdue", bg: "#fde8e8", color: "#8b2a2a", dot: "#d94f4f" },
  Returned: { label: "Returned", bg: "#ece8f0", color: "#5a4a6b", dot: "#9b80c8" },
};

// ✅ SIRF YEH FUNCTION ADD HUA — due-soon frontend pe calculate hoga
// Overdue, Borrowed, Returned backend se aate hain, unhe touch nahi kiya
function computeStatus(book) {
  if (book.status !== "Borrowed") return book.status; // Overdued, Returned → as-is
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(book.dueDate);
  due.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (daysLeft >= 0 && daysLeft <= 3) return "due-soon"; // 0-3 din bachay → due-soon
  return book.status; // baqi sab unchanged
}

function getDaysLeft(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Book Row Card ────────────────────────────────────────────────────────────
function BorrowedBookRow({ book, index }) {
  const colors = ["#515427", "#8b5e1a", "#7a6f4e", "#864c25"];
  const [hovered, setHovered] = useState(false);

  // ✅ SIRF YEH LINE BADLI — book.status ki jagah computeStatus(book)
  const status = STATUS_CONFIG[computeStatus(book)];
  const computedStatus = computeStatus(book); // due date text color ke liye

  const daysLeft = getDaysLeft(book.dueDate);
  const initials = book.bookId.Title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const colordecision = () => {
    let selectedColor = colors[index % colors.length];
    return selectedColor;
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "64px 1fr auto",
        gap: "18px",
        alignItems: "center",
        background: hovered ? "#fafaf0" : "#fffff3",
        border: "1px solid",
        borderColor: hovered ? "rgba(200,185,154,.5)" : "rgba(200,185,154,.2)",
        borderRadius: "14px",
        padding: "18px 22px",
        transition: "all .25s cubic-bezier(.16,1,.3,1)",
        boxShadow: hovered ? "0 8px 32px rgba(81,84,39,.1)" : "0 2px 8px rgba(81,84,39,.04)",
      }}
    >
      {/* Cover thumbnail */}
      <div style={{
        width: "64px", height: "80px", background: `${colordecision()}`,
        borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "0 4px 14px rgba(0,0,0,.18)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,.1) 0%, transparent 60%)" }} />
        <span style={{ fontSize: "15px", color: "rgba(255,255,255,.92)", fontFamily: "Georgia, serif", fontWeight: "700", position: "relative", zIndex: 1 }}>{initials}</span>
      </div>

      {/* Book info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
          <h3 style={{ color: "#515427", fontSize: "15px", fontWeight: "700", fontFamily: "Georgia, serif", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.bookId.Title}</h3>
          <span style={{ background: status.bg, color: status.color, fontSize: "10px", fontWeight: "600", padding: "2px 9px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: status.dot, display: "inline-block" }} />
            {status.label}
          </span>
        </div>
        <p style={{ color: "#9b8a6a", fontSize: "12px", margin: "0 0 8px", fontStyle: "italic" }}>by {book.bookId.Author} · {book.bookId.Genre} · {book.bookId.Pages} pages</p>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ fontSize: "11px", color: "#b0a080" }}>
            <span style={{ color: "#9b8a6a", fontWeight: "500" }}>Borrowed:</span> {formatDate(book.issueDate)}
          </div>
          <div style={{ fontSize: "11px" }}>
            <span style={{ color: "#9b8a6a", fontWeight: "500" }}>Due:</span>{" "}
            {/* ✅ SIRF YEH — book.status ki jagah computedStatus */}
            <span style={{ color: computedStatus === "Overdued" ? "#d94f4f" : computedStatus === "due-soon" ? "#e6a832" : "#7a6f4e", fontWeight: book.status === "overdue" ? "600" : "400" }}>
              {formatDate(book.dueDate)}
              {book.status !== "Returned" && (
                <span style={{ marginLeft: "6px", fontSize: "10px" }}>
                  {book.status === "Overdued" ? `(${Math.abs(daysLeft)}d Overdued)` : `(${daysLeft}d left)`}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", flexShrink: 0 }}>
        {book.status === "Returned" &&
          <span style={{ fontSize: "12px", color: "#9b8a6a", padding: "8px 18px", textAlign: "center" }}>Returned</span>
        }
      </div>
    </div>
  );
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ value, max, color, label, sublabel }) {
  const r = 32, circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(200,185,154,.2)" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset .8s ease" }} />
      </svg>
      <div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "700", color: "#515427" }}>{value}<span style={{ fontSize: "13px", color: "#9b8a6a", fontFamily: "inherit" }}>/{max}</span></div>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#7a6f4e" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "#b0a080" }}>{sublabel}</div>
      </div>
    </div>
  );
}

// ─── Main BorrowedBooksPage ────────────────────────────────────────────────────
export default function BorrowedBooksPage() {
  const [loader, setLoader] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");
  const [userdata, setUserData] = useState([]);

  const filters = ["All", "Active", "Due Soon", "Overdue", "Returned"];
  const filterMap = { "All": null, "Active": "Borrowed", "Due Soon": "due-soon", "Overdue": "Overdued", "Returned": "Returned" };

  const fetchingData = async () => {
    try {
      const token = localStorage.getItem('UserLoginToken');
      const response = await fetch("http://localhost:5000/api/UserData", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  // ✅ SIRF YEH — filtering aur counts ke liye computeStatus use karo
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
    // ✅ SIRF YEH — dueSoon frontend se compute hoga
    dueSoon: userdata.filter(b => computeStatus(b) === "due-soon").length,
    returned: userdata.filter(b => b.status === "Returned").length,
    total: userdata.length,
  };

  useEffect(() => {
    fetchingData();
  }, []);

  if (loader) {
    return (
      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">
        <CircularProgress sx={{ color: "#52512a" }} />
      </Stack>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px 72px", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{ fontSize: "28px" }}>📖</span>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "700", color: "#515427", margin: 0 }}>My Borrowed Books</h1>
        </div>
        <p style={{ color: "#9b8a6a", fontSize: "14px", margin: 0 }}>Track your reading journey and manage your borrowed collection</p>
      </div>

      {/* ── Stats Row ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px", marginBottom: "32px",
      }}>
        {[
          { label: "Currently Borrowed", val: stats.active, sub: "books in hand", color: "#6b9e50", bg: "#f0f5eb" },
          { label: "Overdue", val: stats.overdue, sub: "need immediate return", color: "#d94f4f", bg: "#fde8e8" },
          { label: "Due This Week", val: stats.dueSoon, sub: "return soon", color: "#e6a832", bg: "#fef3e2" },
          { label: "Total Borrowed", val: stats.total, sub: "all time", color: "#9b80c8", bg: "#ece8f0" },
        ].map((s) => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: "14px", padding: "20px 22px",
            border: `1px solid ${s.color}22`,
          }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "30px", fontWeight: "700", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#515427", marginTop: "2px" }}>{s.label}</div>
            <div style={{ fontSize: "11px", color: "#9b8a6a", marginTop: "1px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Quota Tracker ── */}
      <div style={{
        background: "#f8f7ec", borderRadius: "16px", padding: "24px 28px",
        border: "1px solid rgba(200,185,154,.3)", marginBottom: "32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px",
      }}>
        <div>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#515427", margin: "0 0 4px" }}>Borrowing Quota</h3>
          <p style={{ fontSize: "12px", color: "#9b8a6a", margin: 0 }}>Premium members can borrow up to 5 books simultaneously</p>
        </div>
        <ProgressRing value={stats.active + stats.overdue} max={5} color="#864c25" label="Books Borrowed" />
      </div>

      {/* ── Filters & Sort ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: "20px", border: "1.5px solid",
              borderColor: filter === f ? "#515427" : "rgba(200,185,154,.45)",
              background: filter === f ? "#515427" : "transparent",
              color: filter === f ? "#fffff3" : "#7a6f4e",
              cursor: "pointer", fontSize: "12px", fontWeight: filter === f ? "600" : "400",
              fontFamily: "inherit", transition: "all .18s",
            }}>{f}
              {/* ✅ SIRF YEH — filter count bhi computeStatus se */}
              {f !== "All" && filterMap[f] && (
                <span style={{ marginLeft: "5px", fontSize: "10px", opacity: .8 }}>
                  ({userdata.filter(b => computeStatus(b) === filterMap[f]).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#9b8a6a" }}>Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
            padding: "6px 12px", borderRadius: "8px", border: "1.5px solid rgba(200,185,154,.45)",
            background: "#fffff3", color: "#515427", fontSize: "12px", fontFamily: "inherit",
            cursor: "pointer", outline: "none",
          }}>
            <option value="dueDate">Due Date</option>
            <option value="issueDate">Borrowed Date</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </div>

      {/* ── Book List ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9b8a6a" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
          <h3 style={{ fontSize: "18px", color: "#515427", fontFamily: "Georgia, serif", marginBottom: "6px" }}>No books here</h3>
          <p style={{ fontSize: "14px" }}>You have no books in this category.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((book, index) => (
            <BorrowedBookRow key={book._id} book={book} index={index} />
          ))}
        </div>
      )}

      {/* ── Overdue Banner ── */}
      {stats.overdue > 0 && (
        <div style={{
          marginTop: "28px", background: "#fde8e8", border: "1px solid #f5c0c0",
          borderRadius: "14px", padding: "18px 22px",
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <span style={{ fontSize: "22px" }}>⚠️</span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#8b2a2a", marginBottom: "2px" }}>
              You have {stats.overdue} overdue book{stats.overdue > 1 ? "s" : ""}
            </div>
            <div style={{ fontSize: "12px", color: "#b05050" }}>
              Late returns may affect your borrowing privileges. Please return them as soon as possible.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
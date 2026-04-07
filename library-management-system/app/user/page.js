"use client";

import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function UserHomePage() {

  // ─── Data ─────────────────────────────────────────────────────────────────────
  const [loader, setLoader] = useState(true)
  const [books, setBooks] = useState([]);
  let token = null

  const fetchingAPIs = async () => {
    try {
      if (localStorage.getItem("UserLoginToken")) {
        token = localStorage.getItem("UserLoginToken")
      } else if (localStorage.getItem("user_Signup_Token")) {
        token = localStorage.getItem("user_Signup_Token")
      }
      const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
      const [res1] = await Promise.all([
        fetch("http://localhost:5000/api/bookData", { method: "GET", headers })
      ])
      const [data1] = await Promise.all([
        res1 ? res1.json() : null
      ])
      if (data1) {
        setBooks(data1.data);
        setLoader(false)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    fetchingAPIs();
  }, []);

  const GENRES = ["All", "Fiction", "Self-Help", "History", "Novel", "Psychology", "Productivity", "Classic", "Philosophy"];

  // ─── Sub-components ────────────────────────────────────────────────────────────

  function BookCover({ book }) {
    const initials = book.Title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    return (
      <div style={{ width: "100%", height: "215px", background: book.color, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ width: "80px", height: "100px", background: "rgba(255,255,255,.15)", borderRadius: "4px", border: "2px solid rgba(255,255,255,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "22px", color: "rgba(255,255,255,.9)", fontFamily: "Georgia, serif", fontWeight: "700" }}>{initials}</span>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,.4) 100%)" }} />
        <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,243,.88)", color: "#515427", fontSize: "10px", fontWeight: "600", padding: "3px 9px", borderRadius: "20px" }}>{book.Genre}</span>
      </div>
    );
  }

  function BookCard({ book, onBorrowClick }) {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fffff3", borderRadius: "15px", overflow: "hidden",
          boxShadow: hovered ? "0 18px 52px rgba(81,84,39,.16), 0 4px 12px rgba(0,0,0,.06)" : "0 4px 18px rgba(81,84,39,.09), 0 1px 4px rgba(0,0,0,.04)",
          border: "1px solid rgba(200,185,154,.22)", display: "flex", flexDirection: "column",
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          transition: "all .28s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <BookCover book={book} />
        <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ color: "#515427", fontSize: "15px", fontWeight: "700", margin: "0 0 4px", fontFamily: "Georgia, serif", lineHeight: "1.3" }}>{book.Title}</h3>
          <p style={{ color: "#9b8a6a", fontSize: "12px", margin: "0 0 9px", fontStyle: "italic" }}>{book.Author}</p>
          <div style={{ marginTop: "auto", paddingTop: "14px" }}>
            <button
              onClick={() => onBorrowClick(book)}
              style={{
                width: "100%", padding: "10px", borderRadius: "9px", border: "none",
                background: "#864c25",
                color: "#fffff3",
                cursor: "pointer",
                fontSize: "13px", fontWeight: "600", fontFamily: "inherit",
                boxShadow: "0 4px 12px rgba(134,76,37,.28)",
                transition: "all .18s ease",
              }}
            >
              Request To Borrow
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ConfirmModal({ book, onConfirm, onCancel }) {
    return (
      <div
        onClick={onCancel}
        style={{ position: "fixed", inset: 0, background: "rgba(18,16,8,.55)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "20px" }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ background: "#fffff3", borderRadius: "20px", padding: "36px 40px", maxWidth: "400px", width: "100%", boxShadow: "0 28px 80px rgba(0,0,0,.24)", textAlign: "center", fontFamily: "Georgia, serif" }}
        >
          <div style={{ fontSize: "44px", marginBottom: "14px" }}>📖</div>
          <h3 style={{ color: "#515427", fontSize: "21px", margin: "0 0 8px", fontWeight: "700" }}>Borrow this book?</h3>
          <p style={{ color: "#515427", fontSize: "16px", fontWeight: "700", margin: "0 0 4px" }}>{book.Title}</p>
          <p style={{ color: "#9b8a6a", fontSize: "13px", margin: "0 0 24px" }}>by {book.Author} · {book.Genre}</p>
          <p style={{ color: "#7a6f4e", fontSize: "13px", margin: "0 0 26px", lineHeight: "1.65" }}>
            Borrowing period is <strong style={{ color: "#515427" }}>14 days</strong>. The book will be reserved for you immediately.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={onCancel} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1.5px solid #d4c9a8", background: "transparent", color: "#7a6f4e", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={() => onConfirm(book)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#864c25", color: "#fffff3", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", fontWeight: "600", boxShadow: "0 4px 16px rgba(134,76,37,.32)" }}>Confirm Request</button>
          </div>
        </div>
      </div>
    );
  }

  function Toast({ message, onClose }) {
    useEffect(() => {
      const t = setTimeout(onClose, 3800);
      return () => clearTimeout(t);
    }, [onClose]);
    return (
      <div style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 1000, background: "#515427", color: "#fffff3", padding: "14px 20px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,.3)", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", minWidth: "270px", fontFamily: "inherit" }}>
        <span style={{ fontSize: "20px" }}>📚</span>
        <div>
          <div style={{ fontWeight: "600", marginBottom: "2px" }}>Book Reserved!</div>
          <div style={{ fontSize: "12px", color: "#c8b99a" }}>{message}</div>
        </div>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "#c8b99a", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>×</button>
      </div>
    );
  }

  // ─── Main State ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [modalBook, setModalBook] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = books.filter((b) => {
    const matchSearch = b.Title.toLowerCase().includes(search.toLowerCase()) || b.Author.toLowerCase().includes(search.toLowerCase())
      || b.Genre?.toLowerCase().includes(search.toLowerCase())
    const matchGenre = activeGenre === "All" || b.Genre?.toLowerCase().trim() === activeGenre.toLowerCase().trim();
    return matchSearch && matchGenre;
  });

  const handleConfirmBorrow = async(book) => {
    setModalBook(null);
    setToast(`"${book.Title}" has been reserved for you.`);
    try {
      const token = localStorage.getItem("UserLoginToken")
      const response =await fetch("http://localhost:5000/api/borrowRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({bookId:`${book._id}`})
      })
    } catch (error) {
      console.log(error);
    }
  };

  if (loader) {
    return (
      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">
        <CircularProgress sx={{ color: "#52512a" }} />
      </Stack>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#fffff3;font-family:'Inter',sans-serif}
        input::placeholder{color:#b0a080}
        input:focus{outline:none}
        .pill:hover{background:#515427!important;color:#fffff3!important}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ minHeight: "100vh", background: "#fffff3", fontFamily: "'Inter', sans-serif" }}>

        {/* ── HERO ────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(155deg, #f5f4df 0%, #fffff3 65%)", borderBottom: "1px solid rgba(200,185,154,.18)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 32px 52px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(134,76,37,.1)", color: "#864c25", padding: "5px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", letterSpacing: ".8px", textTransform: "uppercase", marginBottom: "20px" }}>✦ Premium Digital Collection</div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: "700", color: "#515427", lineHeight: "1.15", margin: "0 0 14px" }}>
              Your Personal<br /><em style={{ color: "#864c25" }}>Reading Sanctuary</em>
            </h1>
            <p style={{ color: "#9b8a6a", fontSize: "16px", maxWidth: "440px", margin: "0 auto 38px", lineHeight: "1.7" }}>Curated titles handpicked for the discerning reader. Your next masterpiece awaits.</p>

            {/* Search Bar */}
            <div style={{ maxWidth: "570px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: "14px", border: "1.5px solid rgba(200,185,154,.45)", boxShadow: "0 6px 28px rgba(81,84,39,.09)", overflow: "hidden" }}>
                <svg style={{ marginLeft: "18px", flexShrink: 0 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b0a080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input type="text" placeholder="Find your next masterpiece..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: "16px 14px", border: "none", background: "transparent", fontSize: "15px", color: "#515427", fontFamily: "inherit" }} />
                <button style={{ margin: "7px", padding: "10px 22px", background: "#864c25", color: "#fffff3", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(134,76,37,.28)" }}>Search</button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", justifyContent: "center", gap: "48px", marginTop: "40px", flexWrap: "wrap" }}>
              {[{ val: `${books.length} +`, label: "Books Available" }, { val: "180+", label: "Genres" }, { val: "14 Days", label: "Borrow Period" }].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "700", color: "#515427" }}>{s.val}</div>
                  <div style={{ fontSize: "12px", color: "#9b8a6a", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CATALOG ─────────────────────────────────────── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 72px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "22px", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "26px", fontWeight: "700", color: "#515427", marginBottom: "3px" }}>Featured Collection</h2>
              <p style={{ color: "#9b8a6a", fontSize: "13px" }}>Showing {filtered.length} of {books.length} titles</p>
            </div>
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
              {GENRES.map((g) => (
                <button key={g} className="pill" onClick={() => setActiveGenre(g)} style={{ padding: "6px 15px", borderRadius: "20px", border: "1.5px solid", borderColor: activeGenre === g ? "#515427" : "rgba(200,185,154,.45)", background: activeGenre === g ? "#515427" : "transparent", color: activeGenre === g ? "#fffff3" : "#7a6f4e", cursor: "pointer", fontSize: "12px", fontWeight: activeGenre === g ? "600" : "400", fontFamily: "inherit", transition: "all .2s" }}>{g}</button>
              ))}
            </div>
          </div>
          <div style={{ height: "1px", background: "linear-gradient(to right, rgba(200,185,154,.45), transparent)", marginBottom: "30px" }} />

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "72px 20px", color: "#9b8a6a" }}>
              <div style={{ fontSize: "40px", marginBottom: "14px" }}>🔍</div>
              <h3 style={{ fontSize: "20px", color: "#515427", marginBottom: "6px", fontFamily: "Georgia, serif" }}>No books found</h3>
              <p>Try a different search term or genre filter.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "26px", animation: "fadeIn .4s ease" }}>
              {filtered.map((book) => (
                <BookCard key={book._id} book={book} onBorrowClick={setModalBook} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(200,185,154,.28)", padding: "20px 32px", textAlign: "center", color: "#b0a080", fontSize: "12px" }}>✦ Folio Premium Library — Crafted for curious minds ✦</div>
      </div>

      {/* Modal */}
      {modalBook && <ConfirmModal book={modalBook} onConfirm={handleConfirmBorrow} onCancel={() => setModalBook(null)} />}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
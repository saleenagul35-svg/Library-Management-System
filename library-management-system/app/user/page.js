"use client";

import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Image from "next/image";
function BookCover({ book }) {

  return (
    <div className="w-full h-[250px] flex items-center justify-center relative" style={{ backgroundColor: "#c8b99a" }}>

      <Image src={book.ImageURL} fill alt={book.Title} />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      <span className="absolute top-[10px] right-[10px] uppercase bg-[#515427] text-white text-[10px] font-semibold px-[9px] py-[3px] rounded-[20px]">
        {book.Genre}
      </span>
    </div>
  );
}
function BookCard({ book, onBorrowClick, onDetaillClick }) {
  return (
    <div className="bg-[#fffff3] rounded-[15px] overflow-hidden shadow-[0_4px_18px_rgba(81,84,39,.09),0_1px_4px_rgba(0,0,0,.04)] hover:shadow-[0_18px_52px_rgba(81,84,39,.16),0_4px_12px_rgba(0,0,0,.06)] border border-[#c8b99a]/22 flex flex-col hover:-translate-y-[5px] transition-all duration-300 ease-out group">
      <BookCover book={book} />
      <div className="p-[16px_18px_18px] flex-1 flex flex-col">
        <h3 className="text-[#515427] text-[15px] font-bold mb-[4px] font-serif leading-tight">{book.Title}</h3>
        <p className="text-[#9b8a6a] text-[12px] mb-[9px] italic">{book.Author}</p>
        <p className="text-[#9b8a6a] text-[12px] mb-[9px] italic font-serif">Pages. {book.Pages}</p>
        <p className="line-clamp-1 text-[#9b8a6a] cursor-pointer text-[12px] mb-[9px] italic font-serif" onClick={() => onDetaillClick(book)} >{book.Description}</p>
        <div className="mt-auto pt-[14px]">
          <button
            onClick={() => onBorrowClick(book)}
            className="w-full p-[10px] rounded-[9px] border-none bg-[#864c25] text-[#fffff3] cursor-pointer text-[13px] font-semibold shadow-[0_4px_12px_rgba(134,76,37,.28)] transition-all duration-200 active:scale-95"
          >
            Request To Borrow
          </button>
        </div>
      </div>
    </div>
  );
}


export default function UserHomePage() {
  // ─── Data ─────────────────────────────────────────────────────────────────────
  const [loader, setLoader] = useState(true);
  const [books, setBooks] = useState([]);


  const fetchingAPIs = async () => {
    try {
      const  token = localStorage.getItem("UserLoginToken") || localStorage.getItem("user_Signup_Token");;
console.log("sign", localStorage.getItem("user_Signup_Token"));

      const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };
      const res1 = await fetch("http://localhost:5000/api/bookData", { method: "GET", headers });
      const data1 = await res1.json();

      if (data1) {
        setBooks(data1.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchingAPIs();
  }, []);

  const GENRES = ["All", "Fiction", "Self-Help", "History", "Novel", "Psychology", "Productivity", "Classic", "Philosophy"];

  // ─── Sub-components ────────────────────────────────────────────────────────────




  function ConfirmModal({ book, onConfirm, onCancel }) {
    return (
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-[#121008]/55 backdrop-blur-[5px] flex items-center justify-center z-[999] p-5"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#fffff3] rounded-[20px] p-[36px_40px] max-w-[400px] w-full shadow-[0_28px_80px_rgba(0,0,0,.24)] text-center font-serif"
        >
          <div className="text-[44px] mb-[14px]">📖</div>
          <h3 className="text-[#515427] text-[21px] mb-2 font-bold">Borrow this book?</h3>
          <p className="text-[#515427] text-[16px] font-bold mb-1">{book.Title}</p>
          <p className="text-[#9b8a6a] text-[13px] mb-6">by {book.Author} · {book.Genre} · Pages. {book.Pages}</p>
          <p className="text-[#7a6f4e] text-[13px] mb-[26px] leading-[1.65] font-sans">
            Borrowing period is <strong className="text-[#515427]">14 days</strong>. The book will be reserved for you immediately.
          </p>
          <div className="flex gap-[10px] font-sans">
            <button onClick={onCancel} className="flex-1 p-3 rounded-[10px] border-[1.5px] border-[#d4c9a8] bg-transparent text-[#7a6f4e] cursor-pointer text-[14px]">Cancel</button>
            <button onClick={() => onConfirm(book)} className="flex-1 p-3 rounded-[10px] border-none bg-[#864c25] text-[#fffff3] cursor-pointer text-[14px] font-bold shadow-[0_4px_16px_rgba(134,76,37,.32)]">Confirm Request</button>
          </div>
        </div>
      </div>
    );
  }
  function DetailModal({ book, onDetaillClick }) {
    return (
      <div
        onClick={() => onDetaillClick(null)}
        className="fixed inset-0 bg-[#121008]/55 backdrop-blur-[5px] flex items-center justify-center z-[999] p-5"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#fffff3] rounded-[20px] p-[36px_40px] max-w-[400px] w-full shadow-[0_28px_80px_rgba(0,0,0,.24)] text-center font-serif"
        >
          <div className="text-[44px] mb-[14px]">📖</div>
          <h3 className="text-[#515427] text-[21px] mb-2 font-bold">{book.Title}</h3>
          <p className="text-[#9b8a6a] text-[13px] mb-6">{book.Description}</p>
        </div>
      </div>
    );
  }

  function Toast({ message, onClose }) {
    useEffect(() => {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }, [onClose]);
    return (
      <div className="fixed top-7 right-7 z-[1000] bg-[#515427] text-[#fffff3] p-[14px_20px] rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,.3)] flex items-center gap-3 text-[14px] min-w-[270px] animate-in slide-in-from-right-10 duration-700">
        <span className="text-[20px]">📚</span>
        <div>
          <div className="font-semibold mb-0.5">Book Reservation!</div>
          <div className="text-[12px] text-[#c8b99a]">{message}</div>
        </div>
      </div>
    );
  }

  // ─── Logic ───────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [modalBook, setModalBook] = useState(null);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = books && books.length > 0 ? books.filter((b) => {
    const matchSearch = b.Title.toLowerCase().includes(search.toLowerCase()) ||
      b.Author.toLowerCase().includes(search.toLowerCase()) ||
      b.Genre?.toLowerCase().includes(search.toLowerCase());
    const matchGenre = activeGenre === "All" || b.Genre?.toLowerCase().trim() === activeGenre.toLowerCase().trim();
    return matchSearch && matchGenre;
  }) : [];

  const handleConfirmBorrow = async (book) => {
    setModalBook(null);

    try {
      const token = localStorage.getItem("UserLoginToken") ||  localStorage.getItem("user_Signup_Token");
      const response = await fetch("http://localhost:5000/api/borrowRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ bookId: `${book._id}` })
      });
      const data = await response.json()
      setToast(`${data.message}`);

    } catch (error) {
      console.log(error);
    }
  };

  if (loader) {
    return (
      <Stack className="flex justify-center items-center min-h-screen text-gray-500" spacing={2} direction="row">
        <CircularProgress sx={{ color: "#52512a" }} />
      </Stack>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffff3] font-sans antialiased text-[#515427]">

      {/* ── HERO ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#f5f4df] via-[#fffff3] to-[#fffff3] border-b border-[#c8b99a]/18">
        <div className="max-w-[1100px] mx-auto px-8 py-[60px] pb-[52px] text-center">
          <div className="inline-flex items-center gap-[5px] bg-[#864c25]/10 text-[#864c25] px-[14px] py-[5px] rounded-[20px] text-[11px] font-bold tracking-wider uppercase mb-5">
            ✦ Premium Digital Collection
          </div>
          <h1 className="font-serif text-[clamp(32px,4.5vw,52px)] font-bold text-[#515427] leading-[1.15] mb-[14px]">
            Your Personal<br /><em className="text-[#864c25] not-italic">Reading Sanctuary</em>
          </h1>
          <p className="text-[#9b8a6a] text-base max-w-[440px] mx-auto mb-[38px] leading-[1.7]">
            Curated titles handpicked for the discerning reader. Your next masterpiece awaits.
          </p>

          {/* Search Bar */}
          <div className="max-w-[570px] mx-auto">
            <div className="flex items-center bg-white rounded-[14px] border-[1.5px] border-[#c8b99a]/45 shadow-[0_6px_28px_rgba(81,84,39,.09)] overflow-hidden">
              <svg className="ml-[18px] shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b0a080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Find your next masterpiece..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-[14px] py-4 border-none bg-transparent text-[15px] text-[#515427] placeholder-[#b0a080] focus:outline-none"
              />
              <button className="m-[7px] px-[22px] py-[10px] bg-[#864c25] text-[#fffff3] rounded-[10px] text-[13px] font-bold shadow-[0_4px_12px_rgba(134,76,37,.28)] active:scale-95 transition-transform">
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-10 flex-wrap">
            {[{ val: `${books.length || 0} +`, label: "Books Available" }, { val: "180+", label: "Genres" }, { val: "14 Days", label: "Borrow Period" }].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-2xl font-bold text-[#515427]">{s.val}</div>
                <div className="text-[12px] text-[#9b8a6a] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATALOG ─────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-8 py-[40px] pb-[72px]">
        <div className="flex items-end justify-between mb-[22px] flex-wrap gap-[14px]">
          <div>
            <h2 className="font-serif text-[26px] font-bold text-[#515427] mb-[3px]">Featured Collection</h2>
            <p className="text-[#9b8a6a] text-[13px]">Showing {filtered.length} of {books.length} titles</p>
          </div>
          <div className="flex gap-[7px] flex-wrap">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`px-[15px] py-1.5 rounded-[20px] border-[1.5px] text-[12px] transition-all duration-200 ${activeGenre === g
                  ? "bg-[#515427] text-[#fffff3] border-[#515427] font-semibold"
                  : "bg-transparent text-[#7a6f4e] border-[#c8b99a]/45 hover:bg-[#515427] hover:text-[#fffff3] hover:border-[#515427]"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-[#c8b99a]/45 to-transparent mb-[30px]" />

        {filtered.length === 0 ? (
          <div className="text-center py-[72px] px-5 text-[#9b8a6a]">
            <div className="text-[40px] mb-[14px]">🔍</div>
            <h3 className="text-[20px] text-[#515427] mb-[6px] font-serif">No books found</h3>
            <p>Try a different search term or genre filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[26px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filtered.map((book) => (
              <BookCard key={book._id} book={book} onBorrowClick={setModalBook} onDetaillClick={setDetail} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#c8b99a]/28 py-5 px-8 text-center text-[#b0a080] text-[12px]">
        ✦ Folio Premium Library — Crafted for curious minds ✦
      </div>

      {/* Modal & Toast */}
      {modalBook && <ConfirmModal book={modalBook} onConfirm={handleConfirmBorrow} onCancel={() => setModalBook(null)} />}
      {detail && <DetailModal book={detail} onDetaillClick={setDetail} />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
"use client";

import { useState } from "react";

// TODO: Replace with API call
const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Fiction",
    isbn: "978-0743273565",
    copies: 4,
    status: "Available",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Literary Fiction",
    isbn: "978-0061935466",
    copies: 2,
    status: "Issued",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    isbn: "978-0451524935",
    copies: 6,
    status: "Available",
  },
  {
    id: 4,
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Dystopian",
    isbn: "978-0060850524",
    copies: 3,
    status: "Issued",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Literary Fiction",
    isbn: "978-0316769174",
    copies: 5,
    status: "Available",
  },
  {
    id: 6,
    title: "Moby Dick",
    author: "Herman Melville",
    genre: "Adventure",
    isbn: "978-1503280786",
    copies: 1,
    status: "Issued",
  },
  {
    id: 7,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    isbn: "978-0141439518",
    copies: 7,
    status: "Available",
  },
  {
    id: 8,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    isbn: "978-0547928227",
    copies: 4,
    status: "Issued",
  },
];

const StatusBadge = ({ status }) => {
  // Available → light secondary (#e8eacc, text #515427)
  // Issued    → muted primary  (#f3e0d3, text #864c25)
  const styles =
    status === "Available"
      ? { backgroundColor: "#e8eacc", color: "#515427" }
      : { backgroundColor: "#f3e0d3", color: "#864c25" };

  return (
    <span
      style={{
        ...styles,
        padding: "3px 10px",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
};

export default function BookInventoryPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .inv-root {
          font-family: 'DM Sans', sans-serif;
          background: #faf8f5;
          min-height: 100vh;
          color: #2a2318;
        }

        /* ── Topbar ── */
        .inv-topbar {
          background: #fff;
          border-bottom: 1px solid #ede8e0;
          padding: 0 36px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .inv-topbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .inv-topbar-logo {
          width: 34px;
          height: 34px;
          background: #864c25;
          border-radius: 8px;
          display: grid;
          place-items: center;
        }
        .inv-topbar-logo svg { display: block; }
        .inv-topbar-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          color: #515427;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .inv-topbar-nav {
          display: flex;
          gap: 4px;
        }
        .inv-nav-link {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 500;
          color: #7a7260;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
          border: none;
          background: none;
        }
        .inv-nav-link:hover { background: #f4f0ea; color: #2a2318; }
        .inv-nav-link.active { background: #f4f0ea; color: #864c25; font-weight: 600; }

        /* ── Main ── */
        .inv-main {
          padding: 36px 36px 60px;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── Page header ── */
        .inv-page-header {
          margin-bottom: 28px;
        }
        .inv-breadcrumb {
          font-size: 0.75rem;
          color: #a89f90;
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }
        .inv-breadcrumb span { color: #864c25; }
        .inv-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #515427;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .inv-page-sub {
          font-size: 0.83rem;
          color: #9e9382;
          margin-top: 4px;
        }

        /* ── Toolbar ── */
        .inv-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .inv-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 380px;
        }
        .inv-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #b0a898;
          pointer-events: none;
        }
        .inv-search {
          width: 100%;
          height: 40px;
          padding: 0 14px 0 38px;
          border: 1.5px solid #e2dbd0;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #2a2318;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .inv-search::placeholder { color: #c0b8ac; }
        .inv-search:focus {
          border-color: #864c25;
          box-shadow: 0 0 0 3px rgba(134,76,37,0.10);
        }
        .inv-count-chip {
          background: #f4f0ea;
          color: #7a7260;
          font-size: 0.77rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          white-space: nowrap;
        }
        .inv-spacer { flex: 1; }
        .inv-btn-add {
          height: 40px;
          padding: 0 20px;
          background: #864c25;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(134,76,37,0.20);
          white-space: nowrap;
        }
        .inv-btn-add:hover {
          background: #6e3d1c;
          box-shadow: 0 4px 14px rgba(134,76,37,0.28);
          transform: translateY(-1px);
        }
        .inv-btn-add:active { transform: translateY(0); }

        /* ── Stats row ── */
        .inv-stats {
          display: flex;
          gap: 14px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .inv-stat-card {
          background: #fff;
          border: 1px solid #ede8e0;
          border-radius: 10px;
          padding: 14px 22px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 130px;
        }
        .inv-stat-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #a89f90;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .inv-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #515427;
          line-height: 1.1;
        }
        .inv-stat-value.accent { color: #864c25; }

        /* ── Table card ── */
        .inv-table-card {
          background: #fff;
          border: 1px solid #ede8e0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(42,35,24,0.05);
        }
        .inv-table-wrap {
          overflow-x: auto;
        }
        .inv-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .inv-table thead tr {
          background: #f8f5f0;
          border-bottom: 1.5px solid #ede8e0;
        }
        .inv-table th {
          padding: 13px 18px;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 700;
          color: #515427;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .inv-table tbody tr {
          border-bottom: 1px solid #f0ebe3;
          transition: background 0.12s;
        }
        .inv-table tbody tr:last-child { border-bottom: none; }
        .inv-table tbody tr:hover { background: #fdf9f5; }
        .inv-table td {
          padding: 14px 18px;
          color: #3a3025;
          vertical-align: middle;
        }
        .inv-book-title {
          font-weight: 600;
          color: #2a2318;
        }
        .inv-book-author {
          font-size: 0.78rem;
          color: #9e9382;
          margin-top: 1px;
        }
        .inv-isbn {
          font-size: 0.78rem;
          color: #a89f90;
          font-family: monospace;
        }
        .inv-copies {
          font-weight: 600;
          color: #515427;
        }
        .inv-actions {
          display: flex;
          gap: 6px;
        }
        .inv-action-btn {
          width: 30px;
          height: 30px;
          border: 1px solid #e2dbd0;
          border-radius: 6px;
          background: #fff;
          cursor: pointer;
          display: grid;
          place-items: center;
          color: #9e9382;
          transition: all 0.12s;
        }
        .inv-action-btn:hover {
          border-color: #864c25;
          color: #864c25;
          background: #fdf5ef;
        }
        .inv-action-btn.danger:hover {
          border-color: #c0392b;
          color: #c0392b;
          background: #fdf0ef;
        }

        /* ── Empty state ── */
        .inv-empty {
          padding: 60px 20px;
          text-align: center;
          color: #a89f90;
        }
        .inv-empty-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          opacity: 0.4;
        }
        .inv-empty p { font-size: 0.9rem; }

        /* ── Modal ── */
        .inv-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(42,35,24,0.45);
          backdrop-filter: blur(3px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .inv-modal {
          background: #fff;
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 60px rgba(42,35,24,0.20);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .inv-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #515427;
          margin-bottom: 4px;
        }
        .inv-modal-sub {
          font-size: 0.8rem;
          color: #a89f90;
          margin-bottom: 24px;
        }
        .inv-field {
          margin-bottom: 16px;
        }
        .inv-field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #515427;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .inv-field input, .inv-field select {
          width: 100%;
          height: 40px;
          padding: 0 12px;
          border: 1.5px solid #e2dbd0;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #2a2318;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .inv-field input:focus, .inv-field select:focus {
          border-color: #864c25;
          box-shadow: 0 0 0 3px rgba(134,76,37,0.10);
        }
        .inv-field-row { display: flex; gap: 12px; }
        .inv-field-row .inv-field { flex: 1; }
        .inv-modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 24px;
        }
        .inv-btn-cancel {
          height: 38px;
          padding: 0 18px;
          background: #f4f0ea;
          color: #7a7260;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .inv-btn-cancel:hover { background: #ede8e0; }
        .inv-btn-save {
          height: 38px;
          padding: 0 20px;
          background: #864c25;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .inv-btn-save:hover { background: #6e3d1c; }
      `}</style>

      <div className="inv-root">
        {/* ── Topbar ── */}
        <header className="inv-topbar">
          <div className="inv-topbar-brand">
            <div className="inv-topbar-logo">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="5" height="14" rx="1" fill="white" opacity="0.9"/>
                <rect x="8" y="2" width="5" height="14" rx="1" fill="white" opacity="0.6"/>
                <rect x="14" y="4" width="2" height="10" rx="1" fill="white" opacity="0.4"/>
              </svg>
            </div>
            <span className="inv-topbar-title">LibraryAdmin</span>
          </div>
          <nav className="inv-topbar-nav">
            {["Dashboard", "Books", "Members", "Loans", "Reports"].map((n) => (
              <button key={n} className={`inv-nav-link${n === "Books" ? " active" : ""}`}>
                {n}
              </button>
            ))}
          </nav>
        </header>

        {/* ── Main ── */}
        <main className="inv-main">
          {/* Page header */}
          <div className="inv-page-header">
            <div className="inv-breadcrumb">Admin &rsaquo; <span>Book Inventory</span></div>
            <h1 className="inv-page-title">Book Inventory</h1>
            <p className="inv-page-sub">Manage your library collection — add, edit, and track all titles.</p>
          </div>

          {/* Stats */}
          <div className="inv-stats">
            {[
              { label: "Total Titles", value: books.length, accent: false },
              { label: "Available", value: books.filter(b => b.status === "Available").length, accent: false },
              { label: "Issued", value: books.filter(b => b.status === "Issued").length, accent: true },
              { label: "Total Copies", value: books.reduce((s, b) => s + b.copies, 0), accent: false },
            ].map((s) => (
              <div key={s.label} className="inv-stat-card">
                <span className="inv-stat-label">{s.label}</span>
                <span className={`inv-stat-value${s.accent ? " accent" : ""}`}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="inv-toolbar">
            <div className="inv-search-wrap">
              <svg className="inv-search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                className="inv-search"
                type="text"
                placeholder="Search by title, author, or genre…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="inv-count-chip">{filtered.length} results</span>
            <div className="inv-spacer" />
            <button className="inv-btn-add" onClick={() => setShowModal(true)}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1V12M1 6.5H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Book
            </button>
          </div>

          {/* Table */}
          <div className="inv-table-card">
            <div className="inv-table-wrap">
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title &amp; Author</th>
                    <th>Genre</th>
                    <th>ISBN</th>
                    <th>Copies</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="inv-empty">
                          <div className="inv-empty-icon">📚</div>
                          <p>No books match your search.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((book, i) => (
                      <tr key={book.id}>
                        <td style={{ color: "#c0b8ac", fontWeight: 500 }}>{String(i + 1).padStart(2, "0")}</td>
                        <td>
                          <div className="inv-book-title">{book.title}</div>
                          <div className="inv-book-author">{book.author}</div>
                        </td>
                        <td>{book.genre}</td>
                        <td><span className="inv-isbn">{book.isbn}</span></td>
                        <td><span className="inv-copies">{book.copies}</span></td>
                        <td><StatusBadge status={book.status} /></td>
                        <td>
                          <div className="inv-actions">
                            {/* Edit */}
                            <button className="inv-action-btn" title="Edit">
                              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M9 2L11 4L4.5 10.5H2.5V8.5L9 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            {/* View */}
                            <button className="inv-action-btn" title="View">
                              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <ellipse cx="6.5" cy="6.5" rx="5.5" ry="3.5" stroke="currentColor" strokeWidth="1.3"/>
                                <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/>
                              </svg>
                            </button>
                            {/* Delete */}
                            <button className="inv-action-btn danger" title="Delete">
                              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M2 3.5H11M5 3.5V2.5H8V3.5M4 3.5V10.5H9V3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ── Add Book Modal ── */}
      {showModal && (
        <div className="inv-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="inv-modal">
            <div className="inv-modal-title">Add New Book</div>
            <div className="inv-modal-sub">Fill in the details below to add a book to the inventory.</div>
            <div className="inv-field">
              <label>Title</label>
              <input type="text" placeholder="e.g. The Great Gatsby" />
            </div>
            <div className="inv-field">
              <label>Author</label>
              <input type="text" placeholder="e.g. F. Scott Fitzgerald" />
            </div>
            <div className="inv-field-row">
              <div className="inv-field">
                <label>Genre</label>
                <input type="text" placeholder="e.g. Fiction" />
              </div>
              <div className="inv-field">
                <label>Copies</label>
                <input type="number" placeholder="1" min="1" />
              </div>
            </div>
            <div className="inv-field">
              <label>ISBN</label>
              <input type="text" placeholder="978-XXXXXXXXXX" />
            </div>
            <div className="inv-field">
              <label>Status</label>
              <select>
                <option>Available</option>
                <option>Issued</option>
              </select>
            </div>
            <div className="inv-modal-actions">
              <button className="inv-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="inv-btn-save" onClick={() => setShowModal(false)}>Save Book</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
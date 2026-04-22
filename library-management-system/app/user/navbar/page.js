"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link"
export default function UserNavbar({ borrowedCount = 0 }) {
  const router = useRouter();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);

  const NAV_LINKS = [
    { label: "Home", path: "/user" },
    { label: "My Borrowed Books", path: "/user/BorrowedBooks" },
    {
      label: "My Requests",
      path: "/user/myRequests",
      children: [

        { label: "Pending Requests", path: "/user/pending" },
        { label: "Approved Requests", path: "/user/approved" },
        { label: "Rejected Requests", path: "/user/rejected" },
        { label: "Expired Approvals", path: "/user/expired" },
      
      ],
    },
    { label: "Profile", path: "/user/profile" },
  ];

  return (
    <>
      <style>{`
        .nav-btn:hover {
          background: rgba(81,84,39,.08) !important;
          color: #515427 !important;
        }
        .dropdown-item:hover {
          background: rgba(81,84,39,.08);
          color: #515427;
        }
      `}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,243,.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(200,185,154,.22)",
        padding: "0 32px",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto", height: "62px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* Logo */}
          <Link href="/user"
            style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <span style={{ fontSize: "22px" }}>📚</span>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "19px", fontWeight: "700", color: "#515427" }}>Folio</span>
            <span style={{ fontSize: "11px", color: "#9b8a6a", fontStyle: "italic", marginTop: "3px" }}>Premium Library</span>
          </Link>

          {/* Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {NAV_LINKS.map(({ label, path, children }) => {
              const isActive = pathname === path;
              const isOpen = openDropdown === label;

              // ── Dropdown wala button ──
              if (children) {
                return (
                  <div key={label} style={{ position: "relative" }}>
                    <button
                      className="nav-btn"
                      onClick={() => setOpenDropdown(isOpen ? null : label)}
                      style={{
                        background: isActive ? "#515427" : "transparent",
                        border: "none",
                        color: isActive ? "#fffff3" : "#7a6f4e",
                        padding: "7px 15px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: isActive ? "600" : "400",
                        fontFamily: "inherit",
                        transition: "all .2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {label}
                      <span style={{
                        fontSize: "10px",
                        transition: "transform .2s",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        display: "inline-block",
                      }}>▾</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        minWidth: "170px",
                        background: "rgba(255,255,243,0.98)",
                        border: "1px solid rgba(200,185,154,.35)",
                        borderRadius: "10px",
                        padding: "6px",
                        boxShadow: "0 4px 16px rgba(81,84,39,.10)",
                        zIndex: 200,
                      }}>
                        {children.map((child) => (
                          <Link
                          href={child.path}
                            key={child.path}
                            className="dropdown-item"
                            onClick={() => {
                              
                              setOpenDropdown(null);
                            }}
                            style={{
                              display: "block",
                              width: "100%",
                              background: "transparent",
                              border: "none",
                              textAlign: "left",
                              padding: "9px 16px",
                              fontSize: "13px",
                              fontFamily: "inherit",
                              color: "#7a6f4e",
                              cursor: "pointer",
                              borderRadius: "6px",
                              transition: "background .15s",
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // ── Normal button ──
              return (
                <Link
                  key={label}
                  className="nav-btn"
                  href={path}
                  style={{
                    background: isActive ? "#515427" : "transparent",
                    border: "none",
                    color: isActive ? "#fffff3" : "#7a6f4e",
                    padding: "7px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: isActive ? "600" : "400",
                    fontFamily: "inherit",
                    transition: "all .2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

        </div>
      </nav>
    </>
  );
}
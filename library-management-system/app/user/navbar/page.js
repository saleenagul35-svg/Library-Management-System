"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function UserNavbar({ borrowedCount = 0 }) {
  const router = useRouter();
  const pathname = usePathname();

  const NAV_LINKS = [
    { label: "Home", path: "/user" },
    { label: "My Borrowed Books", path: "/user/BorrowedBooks" },
    { label: "My Requests", path: "/user/myRequests" },
    { label: "Profile", path: "/user/profile" },

  ];

  return (
    <>
      <style>{`
        .nav-btn:hover {
          background: rgba(81,84,39,.08) !important;
          color: #515427 !important;
        }
      `}</style>

      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,243,.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(200,185,154,.22)",
        padding: "0 32px",
      }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          height: "62px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* ── Logo ── */}
          <div
            onClick={() => router.push("/user")}
            style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          >
            <span style={{ fontSize: "22px" }}>📚</span>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "19px", fontWeight: "700", color: "#515427" }}>Folio</span>
            <span style={{ fontSize: "11px", color: "#9b8a6a", fontStyle: "italic", marginTop: "3px" }}>Premium Library</span>
          </div>

          {/* ── Nav Links ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {NAV_LINKS.map(({ label, path }) => {
              const isActive = pathname === path;
              return (
                <button
                  key={label}
                  className="nav-btn"
                  onClick={() => router.push(path)}
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
                </button>
              );
            })}
          </div>

        </div>
      </nav>
    </>
  );
}
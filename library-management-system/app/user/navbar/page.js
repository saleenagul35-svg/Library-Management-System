"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function UserNavbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

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
        .nav-btn:hover { background: rgba(81,84,39,.08) !important; color: #515427 !important; }
        .dropdown-item:hover { background: rgba(81,84,39,.08); color: #515427; }
        .mobile-link:hover { background: rgba(81,84,39,.08) !important; color: #515427 !important; }
        @keyframes mobileSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: mobileSlide 0.25s ease forwards; }
      `}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,243,.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(200,185,154,.22)",
        padding: "0 20px",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto", height: "62px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* Logo */}
          <Link href="/user" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "22px" }}>📚</span>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "19px", fontWeight: "700", color: "#515427" }}>Folio</span>
            <span style={{ fontSize: "11px", color: "#9b8a6a", fontStyle: "italic", marginTop: "3px" }}>Premium Library</span>
          </Link>

          {/* Desktop Nav — sirf jab mobile nahi */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {NAV_LINKS.map(({ label, path, children }) => {
                const isActive = pathname === path;
                const isOpen = openDropdown === label;

                if (children) {
                  return (
                    <div key={label} style={{ position: "relative" }}>
                      <button
                        className="nav-btn"
                        onClick={() => setOpenDropdown(isOpen ? null : label)}
                        style={{
                          background: isActive ? "#515427" : "transparent", border: "none",
                          color: isActive ? "#fffff3" : "#7a6f4e", padding: "7px 15px",
                          borderRadius: "8px", cursor: "pointer", fontSize: "13px",
                          fontWeight: isActive ? "600" : "400", fontFamily: "inherit",
                          transition: "all .2s", display: "flex", alignItems: "center", gap: "5px",
                        }}
                      >
                        {label}
                        <span style={{
                          fontSize: "10px", transition: "transform .2s",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block",
                        }}>▾</span>
                      </button>

                      {isOpen && (
                        <div style={{
                          position: "absolute", top: "calc(100% + 6px)", left: 0,
                          minWidth: "170px", background: "rgba(255,255,243,0.98)",
                          border: "1px solid rgba(200,185,154,.35)", borderRadius: "10px",
                          padding: "6px", boxShadow: "0 4px 16px rgba(81,84,39,.10)", zIndex: 200,
                        }}>
                          {children.map((child) => (
                            <Link href={child.path} key={child.path} className="dropdown-item"
                              onClick={() => setOpenDropdown(null)}
                              style={{
                                display: "block", padding: "9px 16px", fontSize: "13px",
                                fontFamily: "inherit", color: "#7a6f4e", cursor: "pointer",
                                borderRadius: "6px", transition: "background .15s",
                              }}
                            >{child.label}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link key={label} className="nav-btn" href={path} style={{
                    background: isActive ? "#515427" : "transparent", border: "none",
                    color: isActive ? "#fffff3" : "#7a6f4e", padding: "7px 15px",
                    borderRadius: "8px", cursor: "pointer", fontSize: "13px",
                    fontWeight: isActive ? "600" : "400", fontFamily: "inherit",
                    transition: "all .2s", display: "flex", alignItems: "center", gap: "5px",
                  }}>{label}</Link>
                );
              })}
            </div>
          )}

          {/* Hamburger — sirf mobile pe */}
          {isMobile && (
            <button
              onClick={() => { setMobileOpen(!mobileOpen); setOpenDropdown(null); }}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                padding: "6px", display: "flex", flexDirection: "column",
                gap: "5px", justifyContent: "center",
              }}
            >
              <span style={{
                display: "block", width: "22px", height: "2px", background: "#515427",
                borderRadius: "2px", transition: "all 0.3s ease",
                transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
              }} />
              <span style={{
                display: "block", width: "22px", height: "2px", background: "#515427",
                borderRadius: "2px", transition: "all 0.3s ease",
                opacity: mobileOpen ? 0 : 1,
              }} />
              <span style={{
                display: "block", width: "22px", height: "2px", background: "#515427",
                borderRadius: "2px", transition: "all 0.3s ease",
                transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
              }} />
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileOpen && (
          <div className="mobile-menu" style={{
            borderTop: "1px solid rgba(200,185,154,.22)",
            padding: "10px 0 16px",
            background: "rgba(255,255,243,.98)",
          }}>
            {NAV_LINKS.map(({ label, path, children }) => {
              const isActive = pathname === path;
              const isOpen = openDropdown === label;

              if (children) {
                return (
                  <div key={label}>
                    <button
                      className="mobile-link"
                      onClick={() => setOpenDropdown(isOpen ? null : label)}
                      style={{
                        width: "100%", background: "transparent", border: "none",
                        textAlign: "left", padding: "11px 20px", fontSize: "14px",
                        fontFamily: "inherit", color: "#515427", cursor: "pointer",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        fontWeight: "600", borderRadius: "8px", transition: "background .15s",
                      }}
                    >
                      {label}
                      <span style={{
                        fontSize: "10px", transition: "transform .2s",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block",
                      }}>▾</span>
                    </button>

                    {isOpen && (
                      <div style={{ paddingLeft: "16px" }}>
                        {children.map((child) => (
                          <Link href={child.path} key={child.path} className="mobile-link"
                            onClick={() => { setMobileOpen(false); setOpenDropdown(null); }}
                            style={{
                              display: "block", padding: "9px 20px", fontSize: "13px",
                              fontFamily: "inherit", color: "#7a6f4e", cursor: "pointer",
                              borderRadius: "6px", transition: "background .15s",
                              borderLeft: "2px solid rgba(81,84,39,.2)",
                            }}
                          >{child.label}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={label} href={path} className="mobile-link"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block", padding: "11px 20px", fontSize: "14px",
                    fontFamily: "inherit", cursor: "pointer", borderRadius: "8px",
                    transition: "background .15s",
                    fontWeight: isActive ? "600" : "400",
                    color: isActive ? "#515427" : "#7a6f4e",
                    background: isActive ? "rgba(81,84,39,.08)" : "transparent",
                  }}
                >{label}</Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
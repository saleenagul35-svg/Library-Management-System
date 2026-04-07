'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import {
  LayoutDashboard,
  Library,
  ScrollText,
  BookOpen,
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
} from 'lucide-react';

// ─── Navigation config ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
    badge: null,
  },
  {
    href: '/admin/inventory',
    label: 'Book Inventory',
    icon: Library,
    exact: false,
    badge: 'New',
  },
  {
    href: '/admin/logs',
    label: 'User Logs',
    icon: ScrollText,
    exact: false,
    badge: null,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: TrendingUp,
    exact: false,
    badge: null,
  },
  {
    href: '/admin/UserActivity',
    label: 'User Activity',
    icon: ScrollText,
    exact: false,
    badge: null,
  },

  // '/admin/BorrowedBooks': 'Books Borrowed',
];


// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated logo mark in sidebar header */
function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.08]">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/40 flex-shrink-0">
        <BookOpen size={20} strokeWidth={1.6} className="text-white" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-xl ring-2 ring-primary/40 animate-ping opacity-30" />
      </div>
      <div>
        <p className="font-display text-lg font-bold text-white leading-none tracking-tight">
          Bibliotheca
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 mt-0.5">
          Admin Console
        </p>
      </div>
    </div>
  );
}

/** Single nav link with active state */
function NavItem({ item, onClick }) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 rounded-xl px-4 py-3 mx-3
        text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-white/[0.12] text-white shadow-sm'
          : 'text-white/50 hover:bg-white/[0.07] hover:text-white/90'
        }
      `}
    >
      {/* Active left-bar indicator */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
      )}

      <span className={`
        flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0
        transition-all duration-200
        ${isActive
          ? 'bg-primary/30 text-primary-200'
          : 'bg-white/[0.06] text-white/40 group-hover:bg-white/[0.10] group-hover:text-white/70'
        }
      `}>
        <Icon size={16} strokeWidth={isActive ? 2 : 1.75} />
      </span>

      <span className="flex-1">{item.label}</span>

      {item.badge && (
        <span className="rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-bold text-white leading-none">
          {item.badge}
        </span>
      )}

      {isActive && (
        <ChevronRight size={13} className="text-white/30" />
      )}
    </Link>
  );
}

/** Bottom user card in sidebar */
function SidebarUserCard() {
  const LogOutAdmin = () => {
    localStorage.removeItem("Admintoken")
    window.location.href = "/authentication"
  }
  return (
    <div className="mx-3 mb-4 rounded-xl border border-white/[0.08] bg-white/[0.05] p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/40 text-white font-bold text-sm flex-shrink-0">
          SG
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Saleena Gul</p>
          <p className="text-[11px] text-white/35 ">saleenagul35@gmail.com</p>
        </div>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white/70 transition-colors"
          aria-label="Log out"
          onClick={LogOutAdmin}
        >
          <LogOut size={13} />
        </button>
      </div>
    </div>
  );
}

/** The full sidebar — used in both desktop (fixed) and mobile (drawer) */
function Sidebar({ onClose }) {
  return (
    <aside
      className="flex h-full w-64 flex-col"
      style={{
        /* Glassmorphism: deep olive base + glass layers */
        background: `
          linear-gradient(
            160deg,
            rgba(81,84,39,0.97)  0%,
            rgba(58,60,27,0.98) 60%,
            rgba(42,44,18,0.99) 100%
          )
        `,
        backdropFilter: 'blur(24px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Noise grain overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient accent blobs */}
      <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/[0.08] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-20 left-0 h-40 w-40 rounded-full bg-secondary-300/[0.04] blur-3xl" aria-hidden="true" />

      {/* Brand */}
      <div className="relative z-10">
        <SidebarBrand />
      </div>

      {/* Mobile close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
        >
          <X size={16} />
        </button>
      )}

      {/* Nav section */}
      <nav className="relative z-10 flex-1 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p className="px-7 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} onClick={onClose} />
        ))}

        {/* Divider */}
        <div className="mx-6 my-4 h-px bg-white/[0.07]" />

        <p className="px-7 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
          System
        </p>

        <Link
          href="/admin/settings"
          onClick={onClose}
          className="group flex items-center gap-3 rounded-xl px-4 py-3 mx-3 text-sm font-medium text-white/40 hover:bg-white/[0.07] hover:text-white/80 transition-all duration-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/30 group-hover:bg-white/[0.10] group-hover:text-white/60 transition-all">
            <Settings size={15} strokeWidth={1.75} />
          </span>
          Settings
        </Link>
      </nav>

      {/* User card at bottom */}
      <div className="relative z-10">
        <SidebarUserCard />
      </div>
    </aside>
  );
}

/** Top header bar for the content area */
function TopBar({ onMenuClick, pageTitle, breadcrumb, requestCount }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary/[0.08] bg-brand-bg/80 px-6 backdrop-blur-md">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 text-primary/50 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm">
          <Link href="/admin" className="font-medium text-primary/50 hover:text-primary transition-colors">
            Admin
          </Link>
          {breadcrumb && (
            <>
              <ChevronRight size={13} className="text-primary/30" />
              <span className="font-semibold text-primary">{breadcrumb}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <a href='/admin/requestNotificationPanel' className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 text-primary/50 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all">
          <Bell size={16} />
          {/* Unread dot */}

          <span className="absolute bottom-5 left-4.5 h-6 w-6 flex justify-center rounded-full bg-primary text-white" >{requestCount > 99 ? "99+" : requestCount}</span>
        </a>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm cursor-pointer hover:bg-primary/15 transition-colors">
          SG
        </div>
      </div>
    </header>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function AdminLayout({ children }) {
  const [loader, setLoader] = useState(true)


  const [requestCount, setRequestCount] = useState(null)
  console.log(requestCount);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const fetchingAPI = async () => {
    const token = localStorage.getItem("Admintoken")
    try {
      const response = await fetch("http://localhost:5000/api/requestCount", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRequestCount(data.data)
      }



    } catch (error) {
      console.log(error);

    } finally {
      setLoader(false)
    }
  }
  useEffect(() => {
    fetchingAPI()
  }, [])


  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Derive breadcrumb from pathname
  const crumbMap = {
    '/admin': null,
    '/admin/inventory': 'Book Inventory',
    '/admin/logs': 'User Logs',
    '/admin/analytics': 'Analytics',
    '/admin/UserActivity': 'User Activity',
    '/admin/settings': 'Settings',
  };
  const breadcrumb = crumbMap[pathname] ?? null;
  if (loader) {
    return (
      <Stack sx={{ color: 'grey.500' }} className="flex justify-center min-h-screen items-center" spacing={2} direction="row">
        <CircularProgress sx={{ color: "#52512a" }} />
      </Stack>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg font-body">

      {/* ── Desktop sidebar (always visible) ── */}
      <div className="hidden lg:flex lg:flex-shrink-0 relative" >
        <div className="w-64 h-screen">
          <Sidebar requestCount={requestCount} />
        </div>
      </div>

      {/* ── Mobile sidebar backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-spring lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* ── Main content column ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          requestCount={requestCount}
          onMenuClick={() => setMobileOpen(true)}
          breadcrumb={breadcrumb}
        />

        {/* Scrollable page area */}
        <main className="flex-1 overflow-y-auto bg-brand-bg scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
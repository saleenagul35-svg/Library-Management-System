'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookMarked,
  ChevronDown,
  Clock,
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  XCircle,
} from 'lucide-react';

// ─── Sub-routes config ────────────────────────────────────────────────────────
const CIRCULATION_ITEMS = [
  {
    href: '/admin/circulation/pending',
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-400',
    activeBg: 'bg-amber-500/15',
    activeText: 'text-amber-300',
    dot: 'bg-amber-400',
  },
  {
    href: '/admin/circulation/approved',
    label: 'Approved',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    activeBg: 'bg-emerald-500/15',
    activeText: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  {
    href: '/admin/circulation/issued',
    label: 'Issued',
    icon: BookOpen,
    color: 'text-sky-400',
    activeBg: 'bg-sky-500/15',
    activeText: 'text-sky-300',
    dot: 'bg-sky-400',
  },
  {
    href: '/admin/circulation/overdue',
    label: 'Overdue',
    icon: AlertTriangle,
    color: 'text-rose-400',
    activeBg: 'bg-rose-500/15',
    activeText: 'text-rose-300',
    dot: 'bg-rose-400',
  },
  {
    href: '/admin/circulation/returned',
    label: 'Returned',
    icon: RotateCcw,
    color: 'text-violet-400',
    activeBg: 'bg-violet-500/15',
    activeText: 'text-violet-300',
    dot: 'bg-violet-400',
  },
  {
    href: '/admin/circulation/rejected',
    label: 'Rejected',
    icon: XCircle,
    color: 'text-zinc-400',
    activeBg: 'bg-zinc-500/15',
    activeText: 'text-zinc-300',
    dot: 'bg-zinc-500',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CirculationNav({ onClose }) {
  const pathname = usePathname();

  // Auto-expand if user is already on a circulation route
  const isAnyCirculationActive = CIRCULATION_ITEMS.some((item) =>
    pathname.startsWith(item.href)
  );
  const [open, setOpen] = useState(isAnyCirculationActive);

  // Keep open state in sync if route changes externally
  useEffect(() => {
    if (isAnyCirculationActive) setOpen(true);
  }, [pathname]);

  return (
    <div className="mx-3">
      {/* ── Parent trigger button ── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`
          group w-full flex items-center gap-3 rounded-xl px-4 py-3
          text-sm font-medium transition-all duration-200
          ${
            isAnyCirculationActive
              ? 'bg-white/[0.12] text-white shadow-sm'
              : 'text-white/50 hover:bg-white/[0.07] hover:text-white/90'
          }
        `}
        aria-expanded={open}
        aria-controls="circulation-submenu"
      >
        {/* Active left-bar indicator */}
        {isAnyCirculationActive && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
            style={{ background: '#864c25' }}
          />
        )}

        {/* Icon box */}
        <span
          className={`
            flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0
            transition-all duration-200
            ${
              isAnyCirculationActive
                ? 'text-white/90'
                : 'bg-white/[0.06] text-white/40 group-hover:bg-white/[0.10] group-hover:text-white/70'
            }
          `}
          style={
            isAnyCirculationActive
              ? { background: 'rgba(134,76,37,0.35)' }
              : {}
          }
        >
          <BookMarked size={16} strokeWidth={isAnyCirculationActive ? 2 : 1.75} />
        </span>

        <span className="flex-1 text-left">Requests &amp; Circulation</span>

        {/* Chevron rotates on open */}
        <ChevronDown
          size={14}
          className={`
            transition-transform duration-300 text-white/30
            ${open ? 'rotate-180' : 'rotate-0'}
          `}
        />
      </button>

      {/* ── Sub-menu (animated height) ── */}
      <div
        id="circulation-submenu"
        role="region"
        aria-label="Circulation sub-navigation"
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open ? `${CIRCULATION_ITEMS.length * 52}px` : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        {/* Vertical connector line + items */}
        <div className="relative ml-[22px] mt-1 mb-1">
          {/* Left guide line */}
          <span
            className="absolute left-[11px] top-0 bottom-0 w-px"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            aria-hidden="true"
          />

          {CIRCULATION_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  relative flex items-center gap-3 rounded-lg px-3 py-2 mb-0.5
                  text-sm transition-all duration-150
                  ${
                    isActive
                      ? `${item.activeBg} ${item.activeText} font-medium`
                      : 'text-white/40 hover:bg-white/[0.06] hover:text-white/75'
                  }
                `}
              >
                {/* Connector dot on the guide line */}
                <span
                  className={`
                    absolute -left-[11px] flex h-3 w-3 items-center justify-center
                    rounded-full ring-[2px] ring-[rgba(58,60,27,0.98)] transition-all
                    ${isActive ? item.dot : 'bg-white/20'}
                  `}
                  aria-hidden="true"
                />

                {/* Icon */}
                <span
                  className={`
                    flex h-6 w-6 items-center justify-center rounded-md flex-shrink-0
                    transition-colors
                    ${isActive ? item.color : 'text-white/30'}
                  `}
                >
                  <Icon size={13} strokeWidth={isActive ? 2.2 : 1.75} />
                </span>

                <span className="flex-1">{item.label}</span>

                {/* Active tick */}
                {isActive && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${item.dot}`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
"use client"
import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import customFetch from "@/lib/userAPI";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const AV_COLORS = ["bg-[#414421]", "bg-[#6b5c35]", "bg-[#8a4f26]"];
const getAvBg = (index) => AV_COLORS[index % AV_COLORS.length];

const formatDate = (rawDate) => {
  const date = new Date(rawDate);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month} ${year}`;
};

function Avatar({ name, index }) {
  return (
    <div className={`${getAvBg(index)} text-[#fffff3] w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

function Badge({ label }) {
  return (
    <span className="bg-[#e8ead0] text-[#3a3d12] inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-md whitespace-nowrap">
      {label}
    </span>
  );
}





function EmptyState() {
  return (
    <div className="bg-[#fffff3] rounded-xl border border-[#d9d4c2] py-16 flex flex-col items-center text-center px-6">
      <svg className="w-14 h-14 mb-4 opacity-80" viewBox="0 0 52 52" fill="none">
        <rect x="8" y="10" width="24" height="32" rx="2" fill="#d9d4c2" />
        <rect x="14" y="6" width="24" height="32" rx="2" fill="#e8e3d0" />
        <rect x="20" y="14" width="24" height="32" rx="2" fill="#bbae90" />
        <path d="M28 30 l4 4 8-9" stroke="#414421" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-serif text-[15px] text-[#414421] mb-1.5">All caught up</p>
      <p className="text-xs text-[#b0a98f] leading-relaxed">No pending borrow requests.<br />New requests will appear here.</p>
    </div>
  );
}

// ✅ Fixed: equal Member/Book columns, tighter Stock
const GRID = "0.6fr 0.6fr 0.6fr 0.5fr 0.5fr";

function DesktopTable({ requests }) {
  return (
    <div className="hidden md:block bg-[#fffff3] rounded-xl border border-[#d9d4c2] overflow-hidden">
      <div className="grid bg-[#FCF5E1] border-b border-[#d9d4c2] px-5 py-2.5"
        style={{ gridTemplateColumns: GRID }}>
        {["Book", "Author", "ISBN", "Requested", "Status"].map((h, i) => (
          <span key={h} className={`${i === 4 ? "text-center" : "text-left"} text-[10.5px] font-medium text-[#9a9280] uppercase tracking-widest`}>
            {h}
          </span>
        ))}
      </div>
      {requests.map((r, idx) => (
        <DesktopRow key={r.userId.id} r={r} index={idx} isLast={idx === requests.length - 1} />
      ))}
    </div>
  );
}

function DesktopRow({ r, index, isLast }) {
  return (
    <div
      className={`grid items-center px-5 py-3.5 hover:bg-[#faf8ef] transition-colors duration-150 ${!isLast ? "border-b border-[#ede9d8]" : ""}`}
      style={{ gridTemplateColumns: GRID }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar name={r.bookId.Title} index={index} />
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#2e2c1e] truncate">{r.bookId.Title}</p>

        </div>
      </div>
      <div className="min-w-0 pr-4">

        <p className="text-[10.5px] text-[#b0a98f] mt-0.5 truncate">{r.bookId.Author}</p>
      </div>
      <div className="flex items-center">
        <p className="text-[10.5px] text-[#b0a98f] mt-0.5 truncate">{r.bookId.ISBN}</p>
      </div>
      <div>
        <p className="text-[12px] font-medium text-[#2e2c1e]">{formatDate(r.requestDate)}</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Badge label={r.status} />
      </div>
    </div>
  );
}

// ✅ Fixed: date calculation moved inside map
function MobileCards({ requests }) {
  return (
    <div className="md:hidden flex flex-col gap-3">
      {requests.map((r, idx) => (
        <div key={r.userId.id} className="bg-[#fffff3] rounded-xl border border-[#d9d4c2] p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={r.bookId.Title} index={idx} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#2e2c1e]">{r.bookId.Title}</p>
            </div>

          </div>
          <div className="bg-[#FCF5E1] rounded-lg px-3 py-2.5 mb-3">

            <p className="text-[10.5px] text-[#b0a98f] mt-1">{r.bookId.Author}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[10.5px] text-[#b0a98f] mt-1">{r.bookId.ISBN}</p>
            <span className="text-[11px] text-[#9a9280]">{formatDate(r.requestDate)}</span>
            <div className="ml-auto flex items-center gap-2">
              <Badge label={r.status} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UserBorrowRequests() {


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
  const { data: requests = [], isLoading: L1 } = useQuery({
    queryKey: ["UserpendingRequestData"],
    queryFn: () => fetchData("/api/UserpendingRequestData"),
    refetchInterval: 5000,
    staleTime: 5000,
    gcTime: 10 * 60 * 1000
  })
  if (L1) {
    return (
      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">

        <CircularProgress sx={{ color: "#52512a" }} />

      </Stack>
    )
  }

  return (
    <div className="min-h-screen bg-[#FCF5E1] px-4 sm:px-6 py-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-[18px] font-medium text-[#2e2c1e] tracking-tight">
              Borrow Requests
            </h1>
            <p className="text-xs text-[#9a9280] mt-1">Pending admin approval</p>
          </div>
          <span className="text-[11px] font-medium text-[#fffff3] bg-[#414421] px-3.5 py-1.5 rounded-full">
            {requests.length} pending
          </span>
        </div>

        {requests.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <DesktopTable requests={requests} />
            <MobileCards requests={requests} />
          </>
        )}
      </div>
    </div>
  );
}
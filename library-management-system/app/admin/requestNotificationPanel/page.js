"use client"
import { useState, useEffect } from "react";
import { X, AlertCircle, XCircle } from "lucide-react";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';

// ─── Helpers ──────────────────────────────────────────────
const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
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

// ─── Small Components ──────────────────────────────────────
function Avatar({ name, index }) {
  return (
    <div className={`${getAvBg(index)} text-[#fffff3] w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

function Badge({ label }) {
  const lower = String(label).toLowerCase();

  let style = "bg-[#e8ead0] text-[#3a3d12] border border-[#c9c9a0]"; // default
  if (lower === "eligible") {
    style = " bg-secondary/10 text-secondary-700 border border-secondary/20";
  } else if (lower.includes("overdue")) {
    style = "bg-[#fbeaea] text-[#8b2020] border border-[#e8aaaa]";
  } else if (lower.includes("borrowed")) {
    style = "bg-[#f5ede0] text-[#6b3e1e] border border-[#c9aa8a]";
  }

  return (
    <span className={`${style} inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-md whitespace-nowrap`}>
      {label}
    </span>
  );
}

function ApproveBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="bg-[#414421] hover:bg-[#333617] active:scale-95 text-[#fffff3] text-xs font-medium px-4 py-1.5 rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer border-0">
      Approve
    </button>
  );
}

function DeclineBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="bg-transparent hover:bg-[#f5e2ce] active:scale-95 text-[#8a4f26] text-xs font-medium px-3.5 py-1.5 rounded-md border border-[#c9aa8a] transition-all duration-150 whitespace-nowrap cursor-pointer">
      Decline
    </button>
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

// ─── Decline Modal ─────────────────────────────────────────
function DeclineModal({ isOpen, onClose, onConfirm, request }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset jab modal band ho
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setError(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    setLoading(true);
    await onConfirm(request._id, reason);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#fdfcef', border: '0.5px solid #864c2530' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{}}>
          <div className="flex items-center gap-3">
            <div>
              <p className="font-serif text-[18px] font-medium" style={{ color: '#515029' }}>
                Decline Borrow Request
              </p>
              <p className="text-xs" style={{ color: '#515029' }}>
                This action will notify the user
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '', border: 'none', cursor: 'pointer' }}>
            <X size={14} color="#515029" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Info box */}
          <div className="flex gap-2 items-start rounded-xl p-3 mb-4"
            style={{ background: '#fcf5e1', border: '0.5px solid #864c2525' }}>
            <AlertCircle size={15} color="#864c25" className="flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed" style={{ color: '#515029' }}>
              You are declining the request for{' '}
              <strong style={{ color: '#864c25' }}>{request?.bookId?.Title}</strong>{' '}
              by <strong style={{ color: '#864c25' }}>{request?.userId?.name}</strong>.
            </p>
          </div>

          {/* Textarea */}
          <div className="mb-4">
            <label className="flex items-center gap-1 text-xs font-medium mb-2"
              style={{ color: '#515029' }}>
              Reason for Declining
              <span style={{ color: '#864c25' }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError(false);
              }}
              maxLength={500}
              placeholder="e.g. All copies are currently issued to other members..."
              rows={4}
              className="w-full rounded-xl text-sm leading-relaxed outline-none resize-y"
              style={{
                background: '#fff',
                border: error ? '1.5px solid #c0392b' : '1.5px solid #864c2540',
                padding: '0.7rem 1rem',
                color: '#515029',
                minHeight: '110px',
                maxHeight: '280px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#864c25';
                e.target.style.boxShadow = '0 0 0 3px #864c2515';
              }}
              onBlur={e => {
                e.target.style.borderColor = error ? '#c0392b' : '#864c2540';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div className="flex justify-between mt-1">
              {error
                ? <p className="text-xs" style={{ color: '#c0392b' }}>Reason is required.</p>
                : <span />
              }
              <p className="text-xs ml-auto" style={{ color: '#51502960' }}>{reason.length} / 500</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all"
              style={{
                background: loading ? '#b07050' : '#515029',
                color: '#fcf5e1',
                border: 'none',
                minWidth: '120px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}>
              <XCircle size={14} />
              {loading ? 'Declining...' : 'Decline Request'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-all"
              style={{
                background: 'transparent',
                color: '#515029',
                border: '1.5px solid #51502940',
                minWidth: '120px',
                cursor: 'pointer'
              }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Table ─────────────────────────────────────────────────
const GRID = "1.1fr 1.1fr 90px 120px 150px";

function DesktopTable({ requests, handleRejection, handleApproval }) {
  return (
    <div className="hidden md:block bg-[#fffff3] rounded-xl border border-[#d9d4c2] overflow-hidden">
      <div className="grid bg-[#FCF5E1] border-b border-[#d9d4c2] px-5 py-2.5"
        style={{ gridTemplateColumns: GRID }}>
        {["Member", "Book", "Stock", "Requested", "Actions"].map((h, i) => (
          <span key={h} className={`${i === 4 ? "text-center" : "text-left"} text-[10.5px] font-medium text-[#9a9280] uppercase tracking-widest`}>
            {h}
          </span>
        ))}
      </div>
      {requests.map((r, idx) => (
        <DesktopRow key={r._id} r={r} index={idx} isLast={idx === requests.length - 1}
          handleApproval={handleApproval} handleRejection={handleRejection} />
      ))}
    </div>
  );
}

function DesktopRow({ r, index, isLast, handleRejection, handleApproval }) {
  return (
    <div className={`grid items-center px-5 py-3.5 hover:bg-[#faf8ef] transition-colors duration-150 ${!isLast ? "border-b border-[#ede9d8]" : ""}`}
      style={{ gridTemplateColumns: GRID }}>
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar name={r.userId.name} index={index} />
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#2e2c1e] truncate">{r.userId.name}</p>
          <p className="text-[11px] text-[#9a9280] mt-0.5 truncate">REG-{r.userId.id}</p>
        </div>
      </div>
      <div className="min-w-0 pr-4">
        <p className="font-serif text-[13px] text-[#2e2c1e] truncate leading-snug">{r.bookId.Title}</p>
        <p className="text-[10.5px] text-[#b0a98f] mt-0.5 truncate">{r.bookId.ISBN}</p>
      </div>
      <div className="flex items-center">
        <Badge label={r.bookId.Copy} />
      </div>
      <div>
        <p className="text-[12px] font-medium text-[#2e2c1e]">{formatDate(r.requestDate)}</p>
        <div className="mt-1"><Badge label={r.status} /></div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {/* ✅ Decline button ab modal open karta hai, direct API nahi */}
        <DeclineBtn onClick={() => handleRejection(r)} />
        <ApproveBtn onClick={() => handleApproval(r._id)} />
      </div>
    </div>
  );
}

function MobileCards({ requests, handleRejection, handleApproval }) {
  return (
    <div className="md:hidden flex flex-col gap-3">
      {requests.map((r, idx) => (
        <div key={r._id} className="bg-[#fffff3] rounded-xl border border-[#d9d4c2] p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={r.userId.name} index={idx} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#2e2c1e]">{r.userId.name}</p>
              <p className="text-[11px] text-[#9a9280] mt-0.5 truncate">REG-{r.userId.id}</p>
            </div>
            <Badge label={r.status} />
          </div>
          <div className="bg-[#FCF5E1] rounded-lg px-3 py-2.5 mb-3">
            <p className="font-serif text-[13px] text-[#2e2c1e]">{r.bookId.Title}</p>
            <p className="text-[10.5px] text-[#b0a98f] mt-1">{r.bookId.ISBN}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge label={r.bookId.Copy} />
            <span className="text-[11px] text-[#9a9280]">{formatDate(r.requestDate)}</span>
            <div className="ml-auto flex items-center gap-2">
              {/* ✅ Mobile mein bhi modal */}
              <DeclineBtn onClick={() => handleRejection(r)} />
              <ApproveBtn onClick={() => handleApproval(r._id)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function BorrowRequests() {



  // Modal state

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [alert, setAlert] = useState(false)
  const fetchData = async (url) => {
    const token = localStorage.getItem('Admintoken')
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
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
    queryKey: ["adminNotification"],
    queryFn: () => fetchData("http://localhost:5000/api/adminNotification"),
    refetchInterval: 5000,
    staleTime: 5000,
    gcTime: 10 * 60 * 1000
  })
  // ✅ Ye ab pura request object leta hai, modal open karta hai
  const handleRejection = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  // ✅ Modal confirm hone par reason ke saath API call
  const handleConfirmDecline = async (requestId, reason) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const res = await fetch(`http://localhost:5000/api/rejectRequest/${requestId}`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      });
    } catch (error) {
      setAlert("Something went wrong.")
    }
  };

  const handleApproval = async (requestId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const res = await fetch(`http://localhost:5000/api/acceptRequest/${requestId}`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
      }
    } catch (error) {
       setAlert("Something went wrong.")
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [alert])
  if (L1) {
    return (
      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">
        <CircularProgress sx={{ color: "#52512a" }} />
      </Stack>
    );
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
            <DesktopTable requests={requests} handleApproval={handleApproval} handleRejection={handleRejection} />
            <MobileCards requests={requests} handleApproval={handleApproval} handleRejection={handleRejection} />
          </>
        )}
      </div>

      {/* ✅ Modal yahan — component ke bahar, har jagah visible */}
      <DeclineModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleConfirmDecline}
        request={selectedRequest}
      />
      {alert && <Stack spacing={2} className="fixed top-17 right-15 w-100 z-1000">
        <Alert sx={{ backgroundColor: "#54552b", color: "#fdfdef" }} severity="error">{alert}</Alert>
      </Stack>}
    </div>
  );
}
"use client"
import { useState, useEffect } from "react";
import { X, MessageSquareX, AlignLeft } from "lucide-react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
function BookDetailsModal({ record, onClose, }) {
    if (!record) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
        >
            <div className="relative w-full max-w-xl rounded-2xl bg-[#fffff3] shadow-2xl animate-fade-up overflow-hidden max-h-[90vh] flex flex-col">

                {/* top accent strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary-600 flex-shrink-0" />

                {/* close button */}
                <button
                    //   onClick={onClose}
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-primary/30 hover:bg-primary/8 hover:text-primary transition-all z-10">
                    <X size={15} />
                </button>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-6 pb-6 pt-5">

                    {/* Header */}
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-600 flex-shrink-0">
                            <MessageSquareX size={18} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="font-display text-lg font-bold text-primary-950">Rejection Reason</h2>
                        </div>
                    </div>
                    {/* Synopsis Section */}
                    {record && (
                        <div className="mb-4 rounded-xl border border-primary/10 bg-brand-bg/60 p-4">
                            <div className="flex items-center gap-2 mb-2.5">
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary/60">
                                    <AlignLeft size={12} strokeWidth={2} />
                                </div>
                                <p className="text-[11px] uppercase tracking-[0.07em] font-semibold text-primary-800/50">Reason</p>
                            </div>
                            <p className="text-sm h-auto  wrap-break-word text-red-700 leading-relaxed">{record}</p>
                        </div>
                    )}

                    {/* Footer action */}
                    <div className="flex justify-end pt-1">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-primary/15 bg-[#fffff3] px-5 py-2 text-sm font-medium text-primary/70 hover:border-primary/30 hover:text-primary transition-all">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
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

function Badge({ label, setSelectedRecord }) {
    return (
        <div className="px-5 py-4 max-w-[200px]"> {/* Max width dena zaroori hai */}
            <div className="line-clamp-1 cursor-pointer" onClick={() => setSelectedRecord(label)}>
                <span className=" text-red-700 text-[11px]  inline relative group/rejectionReason font-semibold">
                    {label}
                    <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 bg-red-700 group-hover/rejectionReason:w-full transition-all duration-300 ease-out rounded-full" />

                </span>
            </div>
        </div>
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
            <p className="text-xs text-[#b0a98f] leading-relaxed">No rejected requests.<br />Rejected requests will appear here.</p>
        </div>
    );
}

// ✅ Fixed: equal Member/Book columns, tighter Stock
const GRID = "0.6fr 0.6fr 0.6fr 0.5fr 0.5fr";

function DesktopTable({ requests,setSelectedRecord }) {
    return (
        <div className="hidden md:block bg-[#fffff3] rounded-xl border border-[#d9d4c2] overflow-hidden">
            <div className="grid bg-[#FCF5E1] border-b border-[#d9d4c2] px-5 py-2.5"
                style={{ gridTemplateColumns: GRID }}>
                {["Book", "Author", "Requested", "Rejected", "Reason"].map((h, i) => (
                    <span key={h} className={`${i === 4 ? "text-center" : "text-left"} text-[10.5px] font-medium text-[#9a9280] uppercase tracking-widest`}>
                        {h}
                    </span>
                ))}
            </div>
            {requests.map((r, idx) => (
                <DesktopRow key={r.userId.id} r={r} index={idx} isLast={idx === requests.length - 1 } setSelectedRecord={setSelectedRecord}/>
            ))}
        </div>
    );
}

function DesktopRow({ r, index, isLast, setSelectedRecord }) {
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
                <p className="text-[12px] font-medium text-[#2e2c1e]">{formatDate(r.requestDate)}</p>
            </div>
            <div>
                <p className="text-[12px] font-medium text-[#2e2c1e]">{formatDate(r.rejectedDate)}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
                <Badge label={r.rejectionReason} setSelectedRecord={setSelectedRecord} />
            </div>
        </div>
    );
}

// ✅ Fixed: date calculation moved inside map
function MobileCards({ requests, setSelectedRecord }) {
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
                        <p className="text-[10.5px] text-[#b0a98f] mt-1">{formatDate(r.requestDate)}</p>
                        <span className="text-[11px] text-[#9a9280]">{formatDate(r.rejectedDate)}</span>
                        <div className="ml-auto flex items-center gap-2">
                            <Badge label={r.rejectionReason} setSelectedRecord={setSelectedRecord} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function rejectedApprovals() {
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [requests, setRequests] = useState([]);
    const [loader, setLoader] = useState(true)

    const fetchingAPIs = async () => {
        try {
            const token = localStorage.getItem('UserLoginToken') ||  localStorage.getItem("user_Signup_Token");
            const response = await fetch("http://localhost:5000/api/UserRejectedRequestData", {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false)
        }
    };

    useEffect(() => {
        fetchingAPIs();
    }, []);
    if (loader) {
        return (
            <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">

                <CircularProgress sx={{ color: "#52512a" }} />

            </Stack>
        )
    }

    return (
        <>
            {selectedRecord && <BookDetailsModal
                record={selectedRecord}
                setSelectedRecord={setSelectedRecord}
                onClose={() => setSelectedRecord(null)}
            />}
            <div className="min-h-screen bg-[#FCF5E1] px-4 sm:px-6 py-8 font-sans">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <h1 className="font-serif text-[18px] font-medium text-[#2e2c1e] tracking-tight">
                                Rejection Window
                            </h1>
                            <p className="text-xs text-[#9a9280] mt-1">Please review the rejection reason</p>

                        </div>
                        <span className="text-[11px] font-medium bg-red-100 text-red-700 border border-red-200 px-3.5 py-1.5 rounded-full">
                            {requests.length} Rejections
                        </span>
                    </div>

                    {requests.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <DesktopTable requests={requests} setSelectedRecord={setSelectedRecord} />
                            <MobileCards requests={requests} setSelectedRecord={setSelectedRecord} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
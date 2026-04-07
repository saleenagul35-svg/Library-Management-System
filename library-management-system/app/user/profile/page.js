"use client";

import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
// ─── MOCK DATA ─────────────────────────────────────────────────────────────────


export default function ProfilePage() {

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [USER, setUSER] = useState(null)

  
  const fetchInfo = async () => {
    try {
      let token = null
      if (localStorage.getItem("UserLoginToken")) {
        token = localStorage.getItem("UserLoginToken")
      } else if (localStorage.getItem("user_Signup_Token")) {
        token = localStorage.getItem("user_Signup_Token")
      }


      const response = await fetch("http://localhost:5000/api/CUserInfo", {
        method: "Get",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },

      })
      if (response.ok) {
        const data = await response.json()
        const arrayOfData = data.data
        setUSER(arrayOfData)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])
  if (!USER) return  <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row"> <CircularProgress sx={{ color: "#52512a" }} /></Stack>
  
  const date = new Date(USER.memberSince)
  const day = date.getDate()
  const year = date.getFullYear()
  const month = date.toLocaleString("en-US",{month:"long"})
  const formattedDate = `${day} ${month} ${year}`


  const initials = USER.name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase();

  // ─── Plan Badge ───────────────────────────────────────────────────────────────
  function PlanBadge() {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        background: "linear-gradient(135deg, #864c25, #a0622f)",
        color: "#fffff3", fontSize: "11px", fontWeight: "700",
        padding: "4px 12px", borderRadius: "20px",
        letterSpacing: ".4px", boxShadow: "0 2px 10px rgba(134,76,37,.35)",
      }}>
        ✦ {USER.name}
      </span>
    );
  }

  // ─── Info Row ─────────────────────────────────────────────────────────────────
  function InfoRow({ icon, label, value, actionLabel, onAction }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 0",
        borderBottom: "1px solid rgba(200,185,154,.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "rgba(200,185,154,.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "15px", flexShrink: 0,
          }}>{icon}</div>
          <div>
            <p style={{ fontSize: "11px", color: "#b0a080", fontWeight: "500", textTransform: "uppercase", letterSpacing: ".6px", margin: "0 0 3px" }}>{label}</p>
            <p style={{ fontSize: "14px", color: "#515427", fontWeight: "500", margin: 0, fontFamily: "Georgia, serif" }}>{value}</p>
          </div>
        </div>
        {actionLabel && (
          <button
            onClick={onAction}
            style={{
              padding: "7px 16px", borderRadius: "8px",
              border: "1.5px solid rgba(200,185,154,.5)",
              background: "transparent", color: "#7a6f4e",
              cursor: "pointer", fontSize: "12px", fontWeight: "500",
              fontFamily: "inherit", transition: "all .18s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#515427"; e.currentTarget.style.color = "#fffff3"; e.currentTarget.style.borderColor = "#515427"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7a6f4e"; e.currentTarget.style.borderColor = "rgba(200,185,154,.5)"; }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  // ─── Modal Shell ─────────────────────────────────────────────────────────────
  function Modal({ title, onClose, children }) {
    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(18,16,8,.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "#fffff3", borderRadius: "20px",
            padding: "36px 40px", width: "100%", maxWidth: "420px",
            boxShadow: "0 32px 80px rgba(0,0,0,.22)",
            animation: "modalIn .25s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: "#515427", margin: 0 }}>{title}</h3>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", fontSize: "20px", color: "#b0a080", cursor: "pointer", lineHeight: 1 }}
            >×</button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  // ─── Static Input (display-only, no onChange) ─────────────────────────────────
  function Field({ label, type = "text", placeholder }) {
    return (
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "11px", fontWeight: "600", color: "#9b8a6a", textTransform: "uppercase", letterSpacing: ".6px", display: "block", marginBottom: "7px" }}>{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          style={{
            width: "100%", padding: "11px 14px", borderRadius: "10px",
            border: "1.5px solid rgba(200,185,154,.45)",
            background: "#fafaf0", fontSize: "14px", color: "#515427",
            fontFamily: "inherit", outline: "none", boxSizing: "border-box",
            transition: "border-color .18s",
          }}
          onFocus={e => e.target.style.borderColor = "#864c25"}
          onBlur={e => e.target.style.borderColor = "rgba(200,185,154,.45)"}
        />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#fffff3",
        fontFamily: "'DM Sans', sans-serif",
        padding: "48px 24px 80px",
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          {/* ── Page Title ── */}
          <div style={{ marginBottom: "40px", animation: "fadeUp .4s ease" }}>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#b0a080", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "6px" }}>Account</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "38px", fontWeight: "700", color: "#515427", lineHeight: 1.1 }}>My Profile</h1>
          </div>

          {/* ── Identity Card ── */}
          <div style={{
            background: "linear-gradient(145deg, #3d3f1f 0%, #515427 60%, #6b6e35 100%)",
            borderRadius: "22px",
            padding: "32px 36px",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 16px 56px rgba(81,84,39,.28)",
            animation: "fadeUp .4s .05s ease both",
          }}>
            {/* decorative rings */}
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", border: "1px solid rgba(255,255,243,.08)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "120px", height: "120px", borderRadius: "50%", border: "1px solid rgba(255,255,243,.06)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
              {/* Avatar */}
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "rgba(200,169,110,.25)",
                border: "2px solid rgba(200,169,110,.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: "700", color: "#c8a96e" }}>{initials}</span>
              </div>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: "700", color: "#fffff3", margin: "0 0 6px" }}>{USER.name}</h2>
                <PlanBadge />
              </div>
            </div>

            {/* Card details row */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0", paddingTop: "22px",
              borderTop: "1px solid rgba(255,255,243,.12)",
            }}>
            
              {[
                { label: "Member ID", value: "REG-" + USER.id },
                { label: "Member Since", value: formattedDate },
                { label: "Status", value: "Active" },
              ].map((item, i) => (
                <div key={item.label} style={{
                  paddingLeft: i > 0 ? "20px" : 0,
                  borderLeft: i > 0 ? "1px solid rgba(255,255,243,.1)" : "none",
                }}>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,243,.45)", fontWeight: "500", textTransform: "uppercase", letterSpacing: ".7px", marginBottom: "5px" }}>{item.label}</p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,243,.88)", fontWeight: "500" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Personal Details ── */}
          <div style={{
            background: "#fffff3", borderRadius: "18px",
            padding: "10px 28px 4px",
            border: "1px solid rgba(200,185,154,.25)",
            boxShadow: "0 4px 24px rgba(81,84,39,.06)",
            marginBottom: "16px",
            animation: "fadeUp .4s .1s ease both",
          }}>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#b0a080", textTransform: "uppercase", letterSpacing: ".8px", paddingTop: "20px", paddingBottom: "4px" }}>Personal Details</p>

            <InfoRow icon="👤" label="Full Name" value={USER.name} />
            <InfoRow icon="✉️" label="Email Address" value={USER.email} />
            <InfoRow
              icon="📞" label="Phone Number" value={USER.phone}
              actionLabel="Update"
              onAction={() => setShowPhoneModal(true)}
            />
          </div>

          {/* ── Security ── */}
          <div style={{
            background: "#fffff3", borderRadius: "18px",
            padding: "10px 28px 4px",
            border: "1px solid rgba(200,185,154,.25)",
            boxShadow: "0 4px 24px rgba(81,84,39,.06)",
            animation: "fadeUp .4s .15s ease both",
          }}>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#b0a080", textTransform: "uppercase", letterSpacing: ".8px", paddingTop: "20px", paddingBottom: "4px" }}>Security</p>

            <InfoRow
              icon="🔒" label="Password" value="••••••••••"
              actionLabel="Change"
              onAction={() => setShowPasswordModal(true)}
            />
          </div>

          {/* ── Note ── */}
          <p style={{ fontSize: "11px", color: "#c8b99a", textAlign: "center", marginTop: "28px", lineHeight: "1.6" }}>
            To update your name or email, please contact the library desk with a valid ID.
          </p>

        </div>
      </div>

      {/* ── Phone Modal (UI only) ── */}
      {showPhoneModal && (
        <Modal title="Update Phone Number" onClose={() => setShowPhoneModal(false)}>
          <Field label="New Phone Number" type="tel" placeholder="+92 300 0000000" />
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              onClick={() => setShowPhoneModal(false)}
              style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1.5px solid rgba(200,185,154,.45)", background: "transparent", color: "#7a6f4e", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}
            >Cancel</button>
            <button
              style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#515427", color: "#fffff3", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(81,84,39,.28)" }}
            >Save</button>
          </div>
        </Modal>
      )}

      {/* ── Password Modal (UI only) ── */}
      {showPasswordModal && (
        <Modal title="Change Password" onClose={() => setShowPasswordModal(false)}>
          <Field label="Current Password" type="password" placeholder="Enter current password" />
          <Field label="New Password" type="password" placeholder="Min. 8 characters" />
          <Field label="Confirm Password" type="password" placeholder="Repeat new password" />
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              onClick={() => setShowPasswordModal(false)}
              style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1.5px solid rgba(200,185,154,.45)", background: "transparent", color: "#7a6f4e", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}
            >Cancel</button>
            <button
              style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#515427", color: "#fffff3", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(81,84,39,.28)" }}
            >Update</button>
          </div>
        </Modal>
      )}
    </>
  );
}
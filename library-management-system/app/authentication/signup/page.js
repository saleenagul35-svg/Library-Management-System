"use client";
import { useState } from "react";

// ✅ Field component BAHAR — App ke andar nahi!
function Field({ label, type = "text", value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        fontSize: "10px", fontWeight: "700", color: "#9b8a6a",
        textTransform: "uppercase", letterSpacing: ".8px",
        display: "block", marginBottom: "7px",
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 16px", borderRadius: "12px",
          border: `1.5px solid ${focused ? "#864c25" : "rgba(200,185,154,.45)"}`,
          background: "#fafaf0", fontSize: "14px", color: "#515427",
          fontFamily: "inherit", outline: "none", boxSizing: "border-box",
          transition: "border-color .18s",
        }}
      />
    </div>
  );
}

// ✅ Phir SignupPage alag
export default function SignupPage() {
  const [form, setForm] = useState({
   id:Date.now(), name: "", email: "", phone: "", password: "", confirm: "",
  });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      
     
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("user_Signup_Token", data.token)
        window.location.href = "/user"
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#fcf5e1",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{
          width: "100%", maxWidth: "500px", background: "#fffff3",
          borderRadius: "24px", padding: "44px 48px",
          boxShadow: "0 16px 60px rgba(81,84,39,.13)",
          border: "1px solid rgba(200,185,154,.25)",
          animation: "fadeUp .4s ease both",
        }}>

          <div style={{ marginBottom: "36px" }}>
            <p style={{
              fontSize: "10px", fontWeight: "700", color: "#b0a080",
              textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: "8px",
            }}>Library Portal</p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "36px", fontWeight: "700", color: "#515427",
              lineHeight: 1.1, marginBottom: "8px",
            }}>Create Account</h1>
            <p style={{ fontSize: "13px", color: "#9b8a6a", lineHeight: 1.6 }}>
              Fill in your details to get started.
            </p>
          </div>

          <Field label="Full Name" value={form.name} onChange={update("name")} placeholder="e.g. Ayesha Raza" />
          <Field label="Email Address" type="email" value={form.email} onChange={update("email")} placeholder="example@mail.com" />
          <Field label="Phone Number" type="tel" value={form.phone} onChange={update("phone")} placeholder="+92 300 0000000" />
          <Field label="Password" type="password" value={form.password} onChange={update("password")} placeholder="Min. 8 characters" />
          <Field label="Confirm Password" type="password" value={form.confirm} onChange={update("confirm")} placeholder="Repeat your password" />

          <button
            onClick={handleSubmit}
            style={{
              width: "100%", padding: "14px", marginTop: "6px",
              borderRadius: "12px", border: "none",
              background: "linear-gradient(135deg, #515427, #6b6e35)",
              color: "#fffff3", fontSize: "14px", fontWeight: "600",
              fontFamily: "inherit", cursor: "pointer",
              boxShadow: "0 6px 20px rgba(81,84,39,.28)",
              transition: "opacity .18s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Create My Account →
          </button>

          <p style={{
            fontSize: "11px", color: "#c8b99a",
            textAlign: "center", marginTop: "22px", lineHeight: "1.6",
          }}>
            Already a member?{" "}
            <a href="/authentication/user" style={{ color: "#864c25", fontWeight: "600", textDecoration: "none" }}>
              Sign in here
            </a>
          </p>

        </div>
      </div>
    </>
  );
}
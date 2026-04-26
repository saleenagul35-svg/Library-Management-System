"use client";
import { useState, useEffect } from "react";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
const styles = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }`
export default function SignupPage() {
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "",
  });
  const [alert, setAlert] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [focused, setFocused] = useState({
    name: false, email: false, phone: false, password: false, confirm: false,
  });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onFocus = (field) =>
    setFocused((prev) => ({ ...prev, [field]: true }));

  const onBlur = (field) =>
    setFocused((prev) => ({ ...prev, [field]: false }));
  const validation = () => {
    let newErrors = {}
    if (!/^[A-Za-z\s]{3,}$/.test(form.name)) {
      newErrors.name = "Enter a valid name"
    }
    if (!/^03\d{2}-?\d{7}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email"
    }
    if (form.password.trim().length < 8) {
      newErrors.password = "Password must be atleast 8 characters"
    }
    if (!(form.password === form.confirm)) {
      newErrors.confirmation = "Password don't match"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validation()) return
    setSubmitting(true)
    if (validation()) {
      try {

        const response = await fetch("http://localhost:5000/api/signUp", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("user_Signup_Token", data.accessToken);
          window.location.href = "/user";
        }
        if(response.status === 500){
          setAlert("Something went wrong.")
        }
      } catch (error) {
        setAlert("Something went wrong.")
      } finally {
        setSubmitting(false)
      }
    }

  };

  const labelStyle = {
    fontSize: "10px", fontWeight: "700", color: "#9b8a6a",
    textTransform: "uppercase", letterSpacing: ".8px",
    display: "block", marginBottom: "7px",
  };

  const inputStyle = (field) => ({
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    border: `1.5px solid ${focused[field] ? "#864c25" : "rgba(200,185,154,.45)"}`,
    background: "#fafaf0", fontSize: "14px", color: "#515427",
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border-color .18s",
  });

  const wrapStyle = { marginBottom: "18px" };
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [alert])
  return (
    <>

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

          {/* ── Header ── */}
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

          {/* ── Full Name ── */}
          <div style={wrapStyle}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={update("name")}
              onFocus={() => onFocus("name")}
              onBlur={() => onBlur("name")}
              placeholder="e.g. Ayesha Raza"
              autoComplete="name"
              style={inputStyle("name")}
            />
            {errors.name &&
              <p className="text-sm text-red-700">{errors.name}</p>
            }
          </div>

          {/* ── Email ── */}
          <div style={wrapStyle}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              onFocus={() => onFocus("email")}
              onBlur={() => onBlur("email")}
              placeholder="example@mail.com"
              autoComplete="email"
              style={inputStyle("email")}
            />
            {errors.email &&
              <p className="text-sm text-red-700">{errors.email}</p>
            }
          </div>

          {/* ── Phone ── */}
          <div style={wrapStyle}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              onFocus={() => onFocus("phone")}
              onBlur={() => onBlur("phone")}
              placeholder="0300 0000000"
              autoComplete="tel"
              style={inputStyle("phone")}
            />
            {errors.phone &&
              <p className="text-sm text-red-700">{errors.phone}</p>
            }
          </div>

          {/* ── Password ── */}
          <div style={wrapStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={update("password")}
              onFocus={() => onFocus("password")}
              onBlur={() => onBlur("password")}

              placeholder="Min. 8 characters"
              autoComplete="new-password"
              style={inputStyle("password")}
            />
            {errors.password &&
              <p className="text-sm text-red-700">{errors.password}</p>
            }
          </div>

          {/* ── Confirm Password ── */}
          <div style={wrapStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={update("confirm")}
              onFocus={() => onFocus("confirm")}
              onBlur={() => onBlur("confirm")}

              placeholder="Repeat your password"
              autoComplete="new-password"
              style={inputStyle("confirm")}
            />
            {errors.confirmation &&
              <p className="text-sm text-red-700">{errors.confirmation}</p>
            }
          </div>

          {/* ── Submit Button ── */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
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
            {submitting ? `Creating ` : ` Create My Account →`}
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
          {alert && <Stack spacing={2} className="fixed top-5 right-16 w-100 ">
            <Alert sx={{  backgroundColor: "#54552b", color:"#fdfdef" }} severity="error">{alert}</Alert>
          </Stack>}
        </div>
      </div>
    </>
  );
}
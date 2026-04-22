"use client";
import Image from "next/image";

import Link from "next/link"
import library from "../../public/images/library.jpg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-1 { animation: fadeUp .6s .1s cubic-bezier(.16,1,.3,1) both; }
  .fade-2 { animation: fadeUp .6s .25s cubic-bezier(.16,1,.3,1) both; }

  .role-btn {
    transition: all .22s ease;
  }
  .role-btn:hover {
    opacity: .88;
    transform: translateY(-2px);
  }
  .role-btn:active {
    transform: translateY(0px);
  }
`;

export default function RoleSelection() {


  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div style={{ position: "relative", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Background image ── */}
        <Image
          src={library}
          alt="library background"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center", zIndex: 0 }}
        />

        {/* ── Overlay: soft dark vignette, not too heavy ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to bottom, rgba(20,18,8,.35) 0%, rgba(20,18,8,.62) 100%)",
          backdropFilter: "brightness(.88) saturate(1.1)",
        }} />

        {/* ── Center content ── */}
        <div style={{
          position: "relative", zIndex: 2,
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "40px 20px",
        }}>

          {/* Branding */}
          <div className="fade-1" style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center",
              gap: "9px", marginBottom: "10px",
            }}>
              <span style={{ fontSize: "26px" }}>📚</span>
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "30px", fontWeight: "700",
                color: "#fffff3", letterSpacing: ".4px",
              }}>Folio</span>
            </div>
            <p style={{
              fontSize: "11px", color: "rgba(255,255,243,.45)",
              letterSpacing: "2.5px", textTransform: "uppercase",
            }}>Premium Library System</p>
          </div>

          {/* ── Single Card ── */}
          <div className="fade-2" style={{
            background: "rgba(255,255,243,.10)",
            backdropFilter: "blur(20px) saturate(1.4)",
            WebkitBackdropFilter: "blur(20px) saturate(1.4)",
            border: "1px solid rgba(255,255,243,.18)",
            borderRadius: "24px",
            padding: "44px 40px 40px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 24px 80px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,243,.12)",
            textAlign: "center",
          }}>

            {/* Heading */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "30px", fontWeight: "700",
              color: "#fffff3", lineHeight: 1.2,
              marginBottom: "8px",
            }}>
              Welcome Back
            </h1>
            <p style={{
              fontSize: "13px", color: "rgba(255,255,243,.5)",
              fontWeight: "300", marginBottom: "36px", lineHeight: "1.6",
            }}>
              Select your role to sign in
            </p>

            {/* Divider */}
            <div style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(255,255,243,.15), transparent)",
              marginBottom: "28px",
            }} />

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* Admin */}
              <Link
                className="role-btn"
                suppressHydrationWarning={true}

                href="/authentication/admin"
                style={{
                  width: "100%", padding: "14px 20px",
                  borderRadius: "11px", border: "none",
                  background: "#864c25",
                  color: "#fffff3",
                  fontSize: "14px", fontWeight: "600",
                  fontFamily: "inherit", cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(134,76,37,.32)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                }}
              >
                <span>🗝️</span> Continue as Admin
              </Link>

              {/* Member */}
              <Link
                className="role-btn"
                suppressHydrationWarning={true}
                href="/authentication/login"
                style={{
                  width: "100%", padding: "14px 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,243,.25)",
                  background: "rgba(255,255,243,.08)",
                  color: "#fffff3",
                  fontSize: "14px", fontWeight: "500",
                  fontFamily: "inherit", cursor: "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                }}
              >
                <span>📖</span> Continue as Member
              </Link>

            </div>

          </div>

          {/* Footer */}
          <p className="fade-2" style={{
            marginTop: "32px", fontSize: "11px",
            color: "rgba(255,255,243,.22)", letterSpacing: ".4px",
          }}>
            ✦ Folio — All rights reserved
          </p>

        </div>
      </div>
    </>
  );
}
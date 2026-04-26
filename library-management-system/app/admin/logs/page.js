'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar, BookOpen } from 'lucide-react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
// ─── Exact Color Palette ──────────────────────────────────────────────────────
const C = {
  brown: '#7a421f',
  olive: '#525333',
  cream: '#fcf5e1',
  offwhite: '#fefef1',
  dark: '#210f06',
};


const AVATAR_PAIRS = [
  ['#7a421f', '#a0562a'],
  ['#525333', '#6b6d42'],
  ['#5c3214', '#7a421f'],
  ['#3d3f1e', '#525333'],
  ['#8b5e3c', '#b87d52'],
  ['#464728', '#626444'],
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('');
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}



// ─── Student Row ──────────────────────────────────────────────────────────────
function StudentRow({ student, index }) {
  const [hov, setHov] = useState(false);
  const [from, to] = AVATAR_PAIRS[student.id % AVATAR_PAIRS.length];
  const date = new Date(student.memberSince)
  const day = date.getDate()
  const year = date.getFullYear()
  const month = date.toLocaleString("en-US", { month: "long" })
  const formattedDate = `${day} ${month} ${year}`

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="animate-fade-up"
      style={{
        display: 'grid',
        gridTemplateColumns: '2.2fr 2fr 1.4fr 0.7fr',
        gap: '16px',
        alignItems: 'center',
        padding: '13px 20px',
        borderBottom: `1px solid ${C.brown}14`,
        backgroundColor: hov ? `${C.brown}09` : 'transparent',
        transition: 'background 150ms',
        animationDelay: `${150 + index * 45}ms`,
      }}
    >
      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
        <div style={{
          flexShrink: 0, height: 36, width: 36, borderRadius: 10,
          background: `linear-gradient(135deg, ${from}, ${to})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.offwhite, letterSpacing: 0.5 }}>
            {getInitials(student.name)}
          </span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.dark, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {student.name}
          </p>
          <p style={{ margin: 0, fontSize: 10, color: `${C.brown}55` }}>
            REG-{String(student.id).padStart(4, '0')}
          </p>
        </div>
      </div>

      {/* Contact */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Mail size={9} color={`${C.brown}55`} strokeWidth={2} />
          <span style={{ fontSize: 11, color: `${C.dark}95`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {student.email}
          </span>
        </div>
      </div>

      {/* Member Since */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Phone size={9} color={`${C.brown}55`} strokeWidth={2} />
        <span style={{ fontSize: 11, color: `${C.dark}95` }}>{student.phone}</span>
      </div>

      {/* Books */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Calendar size={10} color={`${C.brown}55`} strokeWidth={2} />
        <span style={{ fontSize: 11, color: `${C.dark}95` }}>{formattedDate}</span>

      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudentRegistryPage() {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);  //============================== total Students ===========================//


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
  const { data: totalStudents = [], isLoading: P1 } = useQuery({
    queryKey: ["membersData"],
    queryFn: () => fetchData("http://localhost:5000/api/membersData"),
    refetchInterval: 30000,
    staleTime: 30000,
    gcTime: 10 * 60 * 1000
  })
  const filtered = totalStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  if (P1) {
    return (

      <Stack sx={{ color: 'grey.500' }} className="flex justify-center items-center min-h-screen" spacing={2} direction="row">

        <CircularProgress sx={{ color: "#52512a" }} />

      </Stack>
    )
  }


  return (
    <div style={{ minHeight: '100%', padding: '32px', backgroundColor: C.offwhite }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontSize: 28, fontWeight: 700,
              color: C.dark, margin: 0, lineHeight: 1.25,
            }}>
              Members Registry
            </h1>
            <p style={{ marginTop: 4, fontSize: 13, color: `${C.brown}80`, margin: '4px 0 0' }}>
              All registered library members
            </p>
          </div>

          {/* Total badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            borderRadius: 14, border: `1px solid ${C.brown}28`,
            backgroundColor: C.cream, padding: '10px 16px',
            boxShadow: `0 1px 6px ${C.brown}10`,
          }}>
            <div style={{
              height: 30, width: 30, borderRadius: 8,
              backgroundColor: `${C.brown}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={14} color={C.brown} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: `${C.brown}65` }}>
                Total
              </p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.dark, lineHeight: 1.1 }}>
                {totalStudents.length} Members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="animate-fade-up" style={{ marginBottom: 18, animationDelay: '60ms' }}>
        <div style={{ position: 'relative', maxWidth: 300 }}>
          <Search
            size={13}
            color={`${C.brown}60`}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder="Search by member name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%', boxSizing: 'border-box',
              borderRadius: 11,
              border: `1px solid ${focused ? C.brown + '55' : C.brown + '22'}`,
              backgroundColor: C.cream,
              padding: '9px 14px 9px 34px',
              fontSize: 13, color: C.dark,
              outline: 'none',
              boxShadow: focused ? `0 0 0 3px ${C.brown}14` : 'none',
              transition: 'border-color 200ms, box-shadow 200ms',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="animate-fade-up"
        style={{
          borderRadius: 18,
          border: `1px solid ${C.brown}1a`,
          backgroundColor: C.cream,
          boxShadow: `0 2px 16px ${C.brown}0d`,
          overflow: 'hidden',
          animationDelay: '100ms',
        }}
      >
        {/* Head */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.2fr 2fr 1.4fr 0.7fr',
          gap: '16px',
          padding: '11px 20px',
          borderBottom: `1px solid ${C.brown}18`,
          backgroundColor: `${C.brown}07`,
        }}>
          {['Member', "Email Address", 'Contact Number', 'Member Since'].map((col, i) => (
            <p key={i} style={{
              margin: 0, fontSize: 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.07em',
              color: `${C.brown}75`,
            }}>
              {col}
            </p>
          ))}
        </div>

        {/* Rows */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', fontSize: 13, color: `${C.brown}65` }}>
              No Member found
            </div>
          ) : (
            filtered.map((s, i) => (
              <StudentRow key={s.id} student={s} index={i} />
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 20px',
          borderTop: `1px solid ${C.brown}12`,
          backgroundColor: `${C.brown}05`,
        }}>
          <p style={{ margin: 0, fontSize: 11, color: `${C.brown}70` }}>
            Showing{' '}
            <span style={{ fontWeight: 600, color: `${C.brown}cc` }}>{filtered.length}</span>
            {' '}of{' '}
            <span style={{ fontWeight: 600, color: `${C.brown}cc` }}>{totalStudents.length}</span>
            {' '}members
          </p>
        </div>
      </div>

    </div>
  );
}
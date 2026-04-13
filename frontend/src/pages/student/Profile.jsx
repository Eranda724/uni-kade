import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const UNIVERSITIES = [
  'University of Moratuwa',
  'University of Colombo',
  'University of Kelaniya',
  'University of Peradeniya',
  'University of Jaffna',
  'SLIIT',
  'NSBM Green University',
]

export default function StudentProfile() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: user?.university || '',
    faculty: user?.faculty || '',
    studentId: user?.studentId || '',
    phone: user?.phone || '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inp = {
    width: '100%',
    height: 46,
    border: '1.5px solid #E5E7EB',
    borderRadius: 10,
    padding: '0 14px',
    fontSize: 14,
    fontFamily: 'Poppins',
    outline: 'none',
    marginBottom: 16,
    background: '#F8F9FC',
    color: '#1F2937',
    boxSizing: 'border-box',
  }
  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
    display: 'block',
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>My Profile</h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>Manage your account information.</p>
      </div>

      {/* Avatar card */}
      <div
        style={{
          background: 'linear-gradient(135deg,#1a5c3a,#2d8a57)',
          borderRadius: 18,
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 28,
          color: '#fff',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: '3px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {form.name?.[0]?.toUpperCase() || 'S'}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 3 }}>{form.name || 'Student'}</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{form.email}</div>
          <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
            🎓 {form.university || 'University not set'}
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            🎓 Student
          </span>
        </div>
      </div>

      {/* Form */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #F3F4F6',
          padding: 28,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        {saved && (
          <div style={{
            background: '#f0faf5', border: '1px solid #a7f3d0', borderRadius: 10,
            padding: '10px 16px', fontSize: 13, color: '#065f46', marginBottom: 20,
          }}>
            ✅ Profile saved successfully!
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input style={inp} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input style={{ ...inp, background: '#F3F4F6', color: '#9CA3AF' }} value={form.email} readOnly />
          </div>
          <div>
            <label style={labelStyle}>University</label>
            <select style={{ ...inp, cursor: 'pointer' }} value={form.university} onChange={(e) => set('university', e.target.value)}>
              <option value="">Select...</option>
              {UNIVERSITIES.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Faculty</label>
            <input style={inp} placeholder="e.g. Faculty of Engineering" value={form.faculty} onChange={(e) => set('faculty', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Student ID</label>
            <input style={inp} placeholder="e.g. 21/ENG/001" value={form.studentId} onChange={(e) => set('studentId', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inp} type="tel" placeholder="+94 77 000 0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            height: 46, padding: '0 28px',
            background: '#f5a623', border: 'none', borderRadius: 12,
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Poppins',
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

// ─── Reusable input style ──────────────────────────────────────
const inp = (disabled = false) => ({
  width: '100%',
  height: 46,
  border: `1.5px solid ${disabled ? 'var(--border-light)' : 'var(--border)'}`,
  borderRadius: 10,
  padding: '0 14px',
  fontSize: 14,
  fontFamily: 'Poppins',
  outline: 'none',
  marginBottom: 16,
  background: disabled ? 'var(--border-light)' : 'var(--bg-input)',
  color: disabled ? 'var(--text-light)' : 'var(--text)',
  boxSizing: 'border-box',
  cursor: disabled ? 'not-allowed' : 'text',
})

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 5,
  display: 'block',
}

// ─── Section card wrapper ─────────────────────────────────────
function Card({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        padding: '24px 28px',
        marginBottom: 20,
      }}
    >
      {title && (
        <div style={{ marginBottom: 20 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 2,
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null
  const isErr = type === 'error'
  return (
    <div
      style={{
        background: isErr ? 'var(--danger-bg)' : 'var(--success-bg)',
        border: `1px solid ${isErr ? 'var(--danger-text)' : 'var(--success-text)'}`,
        borderRadius: 10,
        padding: '10px 16px',
        fontSize: 13,
        color: isErr ? 'var(--danger-text)' : 'var(--success-text)',
        marginBottom: 16,
        fontWeight: 600,
      }}
    >
      {isErr ? '❌' : '✅'} {msg}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────
export default function StudentProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [toast, setToast] = useState({ msg: '', type: 'success' })
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'password'
  const [saving, setSaving] = useState(false)

  // ── Profile form ────────────────────────────────────────────
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: user?.university || '',
    faculty: user?.faculty || '',
    studentId: user?.studentId || '',
    phone: user?.phone || '',
  })

  // ── Password form ───────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setPw = (k, v) => setPwForm((f) => ({ ...f, [k]: v }))

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500)
  }

  // ── Save profile ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast('Name is required.', 'error')
      return
    }
    setSaving(true)
    try {
      // TODO: replace with real API call
      // await updateProfile(form)
      await new Promise((r) => setTimeout(r, 800))
      showToast('Profile saved successfully!')
    } catch {
      showToast('Failed to save profile.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Change password ──────────────────────────────────────────
  const handlePasswordChange = async () => {
    if (!pwForm.currentPassword) {
      showToast('Enter your current password.', 'error')
      return
    }
    if (pwForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error')
      return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast('New passwords do not match.', 'error')
      return
    }
    setSaving(true)
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 800))
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      showToast('Password changed successfully!')
    } catch {
      showToast('Failed to change password.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // ── Avatar initials ──────────────────────────────────────────
  const initials = form.name
    ? form.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'S'

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', maxWidth: 700 }}>
      {/* ── Page Header ───────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 4,
          }}
        >
          My Profile
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Manage your account information and security.
        </p>
      </div>

      {/* ── Avatar Banner ─────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--secondary), #2d8a57)',
          borderRadius: 18,
          padding: '24px 28px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          color: '#fff',
        }}
      >
        {/* Avatar circle */}
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
            fontSize: 26,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 3 }}>
            {form.name || 'Student'}
          </div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{form.email}</div>
          <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
            🎓 {form.university || 'University not set'}{' '}
            {form.faculty ? `· ${form.faculty}` : ''}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            alignItems: 'flex-end',
          }}
        >
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

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'Poppins',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 20,
          background: 'var(--bg-input)',
          borderRadius: 12,
          padding: 5,
          width: 'fit-content',
        }}
      >
        {[
          { key: 'profile', label: '👤 Profile Info' },
          { key: 'password', label: '🔐 Change Password' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 20px',
              borderRadius: 9,
              border: 'none',
              background: activeTab === t.key ? 'var(--bg-card)' : 'transparent',
              color: activeTab === t.key ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: activeTab === t.key ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'Poppins',
              boxShadow:
                activeTab === t.key ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Toast ─────────────────────────────────────────────── */}
      <Toast msg={toast.msg} type={toast.type} />

      {/* ── PROFILE TAB ──────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <Card
          title="Personal Information"
          subtitle="Update your name, university and contact details."
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0 20px',
            }}
          >
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                style={inp()}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                style={inp(true)}
                value={form.email}
                readOnly
                title="Email cannot be changed"
              />
            </div>
            <div>
              <label style={labelStyle}>University</label>
              <select
                style={{ ...inp(), cursor: 'pointer' }}
                value={form.university}
                onChange={(e) => set('university', e.target.value)}
              >
                <option value="">Select university...</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Faculty</label>
              <input
                style={inp()}
                placeholder="e.g. Faculty of Engineering"
                value={form.faculty}
                onChange={(e) => set('faculty', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Student ID</label>
              <input
                style={inp()}
                placeholder="e.g. 21/ENG/001"
                value={form.studentId}
                onChange={(e) => set('studentId', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                style={inp()}
                type="tel"
                placeholder="+94 77 000 0000"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              height: 46,
              padding: '0 28px',
              background: saving ? 'var(--border)' : 'var(--primary)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'Poppins',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </Card>
      )}

      {/* ── PASSWORD TAB ─────────────────────────────────────── */}
      {activeTab === 'password' && (
        <Card
          title="Change Password"
          subtitle="Use a strong password with at least 6 characters."
        >
          {/* Password field helper */}
          {[
            {
              key: 'currentPassword',
              label: 'Current Password',
              placeholder: 'Enter current password',
              showKey: 'current',
            },
            {
              key: 'newPassword',
              label: 'New Password',
              placeholder: 'Enter new password',
              showKey: 'new',
            },
            {
              key: 'confirmPassword',
              label: 'Confirm New Password',
              placeholder: 'Repeat new password',
              showKey: 'confirm',
            },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 4 }}>
              <label style={labelStyle}>{f.label}</label>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <input
                  type={showPw[f.showKey] ? 'text' : 'password'}
                  placeholder={f.placeholder}
                  value={pwForm[f.key]}
                  onChange={(e) => setPw(f.key, e.target.value)}
                  style={{ ...inp(), paddingRight: 44, marginBottom: 0 }}
                />
                <span
                  onClick={() =>
                    setShowPw((p) => ({ ...p, [f.showKey]: !p[f.showKey] }))
                  }
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                >
                  {showPw[f.showKey] ? '🙈' : '👁'}
                </span>
              </div>
            </div>
          ))}

          {/* Password strength hint */}
          {pwForm.newPassword.length > 0 && (
            <div
              style={{
                marginBottom: 16,
                fontSize: 12,
                color: pwForm.newPassword.length >= 8 ? 'var(--success-text)' : 'var(--warning-text)',
              }}
            >
              {pwForm.newPassword.length >= 8
                ? '✅ Strong password'
                : `⚠️ ${8 - pwForm.newPassword.length} more characters needed`}
            </div>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={saving}
            style={{
              height: 46,
              padding: '0 28px',
              background: saving ? 'var(--border)' : 'var(--primary)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'Poppins',
            }}
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </Card>
      )}
    </div>
  )
}

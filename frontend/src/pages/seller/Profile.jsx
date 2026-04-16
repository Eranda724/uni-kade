import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// ─── Constants ────────────────────────────────────────────────
const UNIVERSITIES = [
  'University of Moratuwa',
  'University of Colombo',
  'University of Kelaniya',
  'University of Peradeniya',
  'University of Jaffna',
  'SLIIT',
  'NSBM Green University',
]
const CATEGORIES = ['Food', 'Stationery', 'Printing', 'Lab Equipment', 'Other']
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12
  const ampm = i < 12 ? 'AM' : 'PM'
  return `${String(h).padStart(2, '0')}:00 ${ampm}`
})

// ─── Shared styles ────────────────────────────────────────────
const inpStyle = (disabled = false) => ({
  width: '100%',
  height: 46,
  border: `1.5px solid ${disabled ? 'var(--border-light)' : 'var(--border)'}`,
  borderRadius: 10,
  padding: '0 14px',
  fontSize: 14,
  fontFamily: 'Poppins',
  outline: 'none',
  marginBottom: 16,
  background: disabled ? 'var(--bg-input)' : 'var(--bg-input)',
  color: disabled ? 'var(--text-light)' : 'var(--text)',
  boxSizing: 'border-box',
  cursor: disabled ? 'not-allowed' : 'text',
})
const labelSt = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 5,
  display: 'block',
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

// ─── Section Card ─────────────────────────────────────────────
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
        <div
          style={{
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <h3
            style={{
              fontSize: 15,
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

// ─── Main Component ───────────────────────────────────────────
export default function SellerProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const logoRef = useRef()

  const [activeTab, setActiveTab] = useState('shop') // 'shop' | 'password'
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'success' })

  // ── Shop form ────────────────────────────────────────────────
  const [form, setForm] = useState({
    shopName: user?.shopName || 'My Shop',
    description: 'Fresh and delicious campus food, made with love.',
    phone: user?.phone || '+94 77 000 0000',
    university: user?.university || '',
    category: user?.category || 'Food',
    facultyArea: 'Main Canteen Block',
    openTime: '07:00 AM',
    closeTime: '05:00 PM',
    logo: null,
    logoPreview: null,
  })

  // ── Password form ────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState({
    current: false,
    newPw: false,
    confirm: false,
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setPw = (k, v) => setPwForm((f) => ({ ...f, [k]: v }))

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500)
  }

  // ── Logo upload ──────────────────────────────────────────────
  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => set('logoPreview', reader.result)
    reader.readAsDataURL(file)
    set('logo', file)
  }

  // ── Save shop ────────────────────────────────────────────────
  const handleSaveShop = async () => {
    if (!form.shopName.trim()) {
      showToast('Shop name is required.', 'error')
      return
    }
    if (!form.university) {
      showToast('Please select your university.', 'error')
      return
    }
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 800)) // TODO: PUT /api/sellers/:id
      showToast('Shop profile saved successfully!')
    } catch {
      showToast('Failed to save profile.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Change password ──────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!pwForm.current) {
      showToast('Enter your current password.', 'error')
      return
    }
    if (pwForm.newPw.length < 6) {
      showToast('New password needs 6+ characters.', 'error')
      return
    }
    if (pwForm.newPw !== pwForm.confirm) {
      showToast('New passwords do not match.', 'error')
      return
    }
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 800)) // TODO: PUT /api/auth/password
      setPwForm({ current: '', newPw: '', confirm: '' })
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

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* ── Page header ──────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 4,
          }}
        >
          Shop Profile
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Update your shop details and account security.
        </p>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}
      >
        {/* ── LEFT: Logo card + Stats ──────────────────────── */}
        <div>
          {/* Logo card */}
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 16,
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              padding: 24,
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            {/* Logo circle */}
            <div
              onClick={() => logoRef.current.click()}
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: form.logoPreview
                  ? 'none'
                  : 'linear-gradient(135deg, var(--secondary), #2d8a57)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 14px',
                border: '4px solid var(--success-bg)',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
              }}
              title="Click to change logo"
            >
              {form.logoPreview ? (
                <img
                  src={form.logoPreview}
                  alt="logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                '🍴'
              )}
              {/* Hover overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  borderRadius: '50%',
                  fontSize: 20,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                📷
              </div>
            </div>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLogo}
            />

            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: 'var(--text)',
                marginBottom: 3,
              }}
            >
              {form.shopName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              {form.category} · {form.university || 'University not set'}
            </div>

            <button
              onClick={() => logoRef.current.click()}
              style={{
                width: '100%',
                height: 38,
                background: 'var(--bg-input)',
                border: '1.5px solid var(--border)',
                borderRadius: 10,
                color: 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins',
              }}
            >
              📷 Change Logo
            </button>
          </div>

          {/* Shop stats */}
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 14,
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              padding: '18px 20px',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: 'var(--text)',
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              Shop Stats
            </div>
            {[
              { label: 'Total Orders', value: '482' },
              { label: 'Total Revenue', value: 'Rs. 94,200' },
              { label: 'Avg. Rating', value: '4.8 ⭐' },
              { label: 'Active Since', value: 'Jan 2025' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '9px 0',
                  borderBottom: '1px solid var(--border-light)',
                  fontSize: 13,
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>
                  {s.value}
                </span>
              </div>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                marginTop: 18,
                width: '100%',
                height: 40,
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-text)',
                borderRadius: 10,
                color: 'var(--danger-text)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Poppins',
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* ── RIGHT: Tabs + Forms ──────────────────────────── */}
        <div>
          {/* Tabs */}
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
              { key: 'shop', label: '🏪 Shop Info' },
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

          {/* Toast */}
          <Toast msg={toast.msg} type={toast.type} />

          {/* ── SHOP INFO TAB ─── */}
          {activeTab === 'shop' && (
            <Card
              title="Shop Information"
              subtitle="Visible to students in the app."
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0 20px',
                }}
              >
                <div>
                  <label style={labelSt}>Shop Name *</label>
                  <input
                    style={inpStyle()}
                    value={form.shopName}
                    onChange={(e) => set('shopName', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelSt}>Phone</label>
                  <input
                    style={inpStyle()}
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelSt}>University *</label>
                  <select
                    style={{ ...inpStyle(), cursor: 'pointer' }}
                    value={form.university}
                    onChange={(e) => set('university', e.target.value)}
                  >
                    <option value="">Select...</option>
                    {UNIVERSITIES.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Category</label>
                  <select
                    style={{ ...inpStyle(), cursor: 'pointer' }}
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelSt}>Campus Area / Location</label>
                  <input
                    style={inpStyle()}
                    value={form.facultyArea}
                    onChange={(e) => set('facultyArea', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelSt}>Opening Time</label>
                  <select
                    style={{ ...inpStyle(), cursor: 'pointer' }}
                    value={form.openTime}
                    onChange={(e) => set('openTime', e.target.value)}
                  >
                    {HOURS.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Closing Time</label>
                  <select
                    style={{ ...inpStyle(), cursor: 'pointer' }}
                    value={form.closeTime}
                    onChange={(e) => set('closeTime', e.target.value)}
                  >
                    {HOURS.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelSt}>Shop Description</label>
                  <textarea
                    style={{
                      ...inpStyle(),
                      height: 80,
                      padding: '12px 14px',
                      resize: 'none',
                    }}
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleSaveShop}
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

          {/* ── PASSWORD TAB ─── */}
          {activeTab === 'password' && (
            <Card
              title="Change Password"
              subtitle="Keep your account secure with a strong password."
            >
              {[
                {
                  key: 'current',
                  label: 'Current Password',
                  ph: 'Enter current password',
                },
                {
                  key: 'newPw',
                  label: 'New Password',
                  ph: 'Enter new password',
                },
                {
                  key: 'confirm',
                  label: 'Confirm New Password',
                  ph: 'Repeat new password',
                },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: 4 }}>
                  <label style={labelSt}>{f.label}</label>
                  <div style={{ position: 'relative', marginBottom: 16 }}>
                    <input
                      type={showPw[f.key] ? 'text' : 'password'}
                      placeholder={f.ph}
                      value={pwForm[f.key]}
                      onChange={(e) => setPw(f.key, e.target.value)}
                      style={{
                        ...inpStyle(),
                        paddingRight: 44,
                        marginBottom: 0,
                      }}
                    />
                    <span
                      onClick={() =>
                        setShowPw((p) => ({ ...p, [f.key]: !p[f.key] }))
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
                      {showPw[f.key] ? '🙈' : '👁'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Strength indicator */}
              {pwForm.newPw.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background:
                            pwForm.newPw.length >= i * 2
                              ? 'var(--success-text)'
                              : 'var(--border)',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: pwForm.newPw.length >= 8 ? 'var(--success-text)' : 'var(--warning-text)',
                    }}
                  >
                    {pwForm.newPw.length >= 8
                      ? '✅ Strong password'
                      : `⚠️ ${8 - pwForm.newPw.length} more characters needed`}
                  </div>
                </div>
              )}

              <button
                onClick={handleChangePassword}
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
      </div>
    </div>
  )
}

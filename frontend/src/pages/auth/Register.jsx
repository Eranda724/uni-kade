import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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

const CATEGORIES = ['Food', 'Stationery', 'Printing', 'Lab Equipment', 'Other']

const SELLER_STEPS = [
  { n: 1, title: 'Personal Info', desc: 'Your name, email, password' },
  { n: 2, title: 'Shop Info', desc: 'Shop name, category, location' },
  { n: 3, title: 'Review & Submit', desc: 'Check details & submit' },
]

const STUDENT_STEPS = [
  { n: 1, title: 'Personal Info', desc: 'Your name, email, password' },
  { n: 2, title: 'University Info', desc: 'Your university & faculty' },
]

// ── Shared inline style helpers ─────────────────────────
const inp = {
  width: '100%',
  height: 48,
  border: '1.5px solid #E5E7EB',
  borderRadius: 12,
  padding: '0 16px',
  fontSize: 14,
  fontFamily: 'Poppins',
  outline: 'none',
  marginBottom: 14,
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

const badgeStyle = {
  background: '#fff3e0',
  color: '#e65c00',
  fontSize: 10,
  fontWeight: 700,
  padding: '3px 10px',
  borderRadius: 6,
  textTransform: 'uppercase',
  letterSpacing: 1,
  display: 'inline-block',
  marginBottom: 12,
}

const errBox = {
  background: '#fee2e2',
  color: '#dc2626',
  padding: '10px 14px',
  borderRadius: 10,
  fontSize: 14,
  marginBottom: 16,
}

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState(null) // null = role picker, 'seller' | 'student'
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    // shared
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    university: '',
    // seller only
    shopName: '',
    shopDescription: '',
    facultyArea: '',
    category: '',
    // student only
    faculty: '',
    studentId: '',
  })

  const set = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }))
    setError('')
  }

  // ── Validations ─────────────────────────────────────────
  const validateStep1 = () => {
    if (!form.name.trim()) return 'Please enter your name'
    if (!form.email.trim()) return 'Please enter your email'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return null
  }

  const validateSellerStep2 = () => {
    if (!form.shopName.trim()) return 'Please enter your shop name'
    if (!form.university) return 'Please select your university'
    if (!form.facultyArea.trim()) return 'Please enter your campus area'
    if (!form.category) return 'Please select a category'
    return null
  }

  const validateStudentStep2 = () => {
    if (!form.university) return 'Please select your university'
    if (!form.faculty.trim()) return 'Please enter your faculty'
    return null
  }

  const nextStep = () => {
    let err = null
    if (step === 1) err = validateStep1()
    if (step === 2 && role === 'seller') err = validateSellerStep2()
    if (step === 2 && role === 'student') err = validateStudentStep2()
    if (err) { setError(err); return }

    if (role === 'student' && step === 2) {
      handleSubmit()
    } else {
      setStep((p) => p + 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const body =
        role === 'seller'
          ? {
              role,
              name: form.name,
              email: form.email,
              password: form.password,
              phone: form.phone,
              shopName: form.shopName,
              shopDescription: form.shopDescription,
              university: form.university,
              facultyArea: form.facultyArea,
              category: form.category,
            }
          : {
              role,
              name: form.name,
              email: form.email,
              password: form.password,
              phone: form.phone,
              university: form.university,
              faculty: form.faculty,
              studentId: form.studentId,
            }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      login(data) // auto-login and navigate based on backend response
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const STEPS = role === 'student' ? STUDENT_STEPS : SELLER_STEPS
  const totalSteps = STEPS.length

  // ── ROLE PICKER (Step 0) ───────────────────────────────
  if (!role) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif',
          background: 'linear-gradient(135deg,#fff9f0,#f0faf5)',
          padding: 24,
        }}
      >
        <div style={{ width: '100%', maxWidth: 540 }}>
          {/* Logo */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#1a5c3a,#2d8a57)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                margin: '0 auto 16px',
                border: '3px solid rgba(245,166,35,0.4)',
              }}
            >
              🍴
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a5c3a', marginBottom: 4 }}>
              UNI<span style={{ color: '#f5a623' }}>-KADE</span>
            </h1>
            <p style={{ fontSize: 14, color: '#6B7280' }}>
              Create your account — who are you?
            </p>
          </div>

          {/* Role cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
            {[
              {
                key: 'seller',
                icon: '🛒',
                title: "I'm a Seller",
                desc: 'Campus shop, canteen, or service owner. List your products and receive orders.',
                accent: '#1a5c3a',
                lightBg: '#e8f5e9',
              },
              {
                key: 'student',
                icon: '🎓',
                title: "I'm a Student",
                desc: 'University student looking to order food, stationery and supplies on campus.',
                accent: '#f5a623',
                lightBg: '#fff3e0',
              },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                style={{
                  background: '#fff',
                  border: '2px solid #E5E7EB',
                  borderRadius: 18,
                  padding: '32px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontFamily: 'Poppins',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = r.accent
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.1)`
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: r.lightBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    margin: '0 auto 16px',
                  }}
                >
                  {r.icon}
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#1F2937', marginBottom: 8 }}>
                  {r.title}
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55 }}>
                  {r.desc}
                </div>
                <div
                  style={{
                    marginTop: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: r.lightBg,
                    color: r.accent,
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Get Started →
                </div>
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#f5a623', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // ── SUCCESS SCREENS ────────────────────────────────────
  const isSuccess = (role === 'seller' && step === 4) || (role === 'student' && step === 3)

  if (isSuccess) {
    const isSeller = role === 'seller'
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif',
          background: 'linear-gradient(135deg,#fff9f0,#f0faf5)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 32 }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>{isSeller ? '🎉' : '✅'}</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1F2937', marginBottom: 12 }}>
            {isSeller ? 'Registration Submitted!' : 'Account Created!'}
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, marginBottom: 28 }}>
            {isSeller ? (
              <>
                Thank you <strong style={{ color: '#1F2937' }}>{form.name}</strong>!<br />
                Your shop <strong style={{ color: '#f5a623' }}>{form.shopName}</strong> is under review.<br />
                We'll email you at <strong style={{ color: '#1F2937' }}>{form.email}</strong> once approved.
              </>
            ) : (
              <>
                Welcome, <strong style={{ color: '#1F2937' }}>{form.name}</strong>!<br />
                Your student account is ready.<br />
                Start exploring campus shops now 🛒
              </>
            )}
          </p>
          {isSeller ? (
            <div
              style={{
                background: '#f0faf5',
                border: '1px solid #a7f3d0',
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 28,
              }}
            >
              <p style={{ fontSize: 13, color: '#065f46', lineHeight: 1.6, margin: 0 }}>
                ✅ Admin approval usually takes less than 24 hours.
              </p>
            </div>
          ) : null}
          <button
            onClick={() => navigate(isSeller ? '/login' : '/student/home')}
            style={{
              background: '#f5a623',
              color: '#fff',
              border: 'none',
              padding: '14px 40px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Poppins',
            }}
          >
            {isSeller ? 'Go to Login →' : 'Browse Shops →'}
          </button>
        </div>
      </div>
    )
  }

  // ── MAIN FORM LAYOUT ───────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div
        style={{
          width: 360,
          background: 'linear-gradient(155deg,#1a5c3a,#2d8a57 60%,#f5a623)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          color: 'white',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '3px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            marginBottom: 16,
          }}
        >
          {role === 'seller' ? '🛒' : '🎓'}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
          {role === 'seller' ? 'Seller Account' : 'Student Account'}
        </h1>
        <p style={{ fontSize: 12, opacity: 0.8, textAlign: 'center', lineHeight: 1.6, marginBottom: 32 }}>
          {role === 'seller'
            ? 'Set up your campus shop and start selling'
            : 'Join and order from campus shops'}
        </p>

        {/* Step indicators */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 12,
                background:
                  step === s.n
                    ? 'rgba(255,255,255,0.25)'
                    : step > s.n
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.07)',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  background:
                    step > s.n ? '#22c55e' : step === s.n ? '#f5a623' : 'rgba(255,255,255,0.2)',
                }}
              >
                {step > s.n ? '✓' : s.n}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{s.title}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to role selection */}
        <button
          onClick={() => { setRole(null); setStep(1); setError('') }}
          style={{
            marginTop: 32,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            color: 'rgba(255,255,255,0.75)',
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Poppins',
          }}
        >
          ← Change Role
        </button>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
          background: '#fff',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 460 }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: s.n <= step ? '#f5a623' : '#E5E7EB',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          {/* ── STEP 1: Personal Info (both roles) ─── */}
          {step === 1 && (
            <>
              <span style={badgeStyle}>
                Step 1 of {totalSteps}
              </span>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
                Hello! Create Account
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#f5a623', fontWeight: 600 }}>
                  Sign in
                </Link>
              </p>

              {error && <div style={errBox}>{error}</div>}

              <label style={labelStyle}>Your Name</label>
              <input
                style={inp}
                placeholder="Full name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />

              <label style={labelStyle}>Email Address</label>
              <input
                style={inp}
                placeholder="you@example.com"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />

              <label style={labelStyle}>Password</label>
              <input
                style={inp}
                placeholder="Min. 6 characters"
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
              />

              <label style={labelStyle}>Confirm Password</label>
              <input
                style={inp}
                placeholder="Repeat password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
              />

              <button
                onClick={nextStep}
                style={{
                  width: '100%',
                  height: 48,
                  background: '#f5a623',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Poppins',
                }}
              >
                Continue →
              </button>
            </>
          )}

          {/* ── STEP 2 (SELLER): Shop Info ─── */}
          {step === 2 && role === 'seller' && (
            <>
              <span style={badgeStyle}>Step 2 of {totalSteps}</span>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
                Your Shop Info
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
                Tell us about your campus shop or canteen
              </p>

              {error && <div style={errBox}>{error}</div>}

              <label style={labelStyle}>Shop Name</label>
              <input
                style={inp}
                placeholder="e.g. Mama's Kitchen"
                value={form.shopName}
                onChange={(e) => set('shopName', e.target.value)}
              />

              <label style={labelStyle}>Phone Number</label>
              <input
                style={inp}
                placeholder="+94 77 000 0000"
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />

              <label style={labelStyle}>University</label>
              <select
                style={{ ...inp, cursor: 'pointer' }}
                value={form.university}
                onChange={(e) => set('university', e.target.value)}
              >
                <option value="">Select university</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>

              <label style={labelStyle}>Campus Area / Location</label>
              <input
                style={inp}
                placeholder="e.g. Main Canteen Block, Block B"
                value={form.facultyArea}
                onChange={(e) => set('facultyArea', e.target.value)}
              />

              <label style={labelStyle}>Category</label>
              <select
                style={{ ...inp, cursor: 'pointer' }}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <label style={labelStyle}>Shop Description (optional)</label>
              <textarea
                style={{ ...inp, height: 72, padding: '12px 16px', resize: 'none' }}
                placeholder="Tell students what you sell..."
                value={form.shopDescription}
                onChange={(e) => set('shopDescription', e.target.value)}
              />

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    height: 48,
                    background: '#fff',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 12,
                    color: '#1F2937',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  style={{
                    flex: 2,
                    height: 48,
                    background: '#f5a623',
                    border: 'none',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                  }}
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2 (STUDENT): University Info ─── */}
          {step === 2 && role === 'student' && (
            <>
              <span style={badgeStyle}>Step 2 of {totalSteps}</span>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
                University Info
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
                Help us connect you with shops at your campus
              </p>

              {error && <div style={errBox}>{error}</div>}

              <label style={labelStyle}>University</label>
              <select
                style={{ ...inp, cursor: 'pointer' }}
                value={form.university}
                onChange={(e) => set('university', e.target.value)}
              >
                <option value="">Select university</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>

              <label style={labelStyle}>Faculty / Department</label>
              <input
                style={inp}
                placeholder="e.g. Faculty of Engineering"
                value={form.faculty}
                onChange={(e) => set('faculty', e.target.value)}
              />

              <label style={labelStyle}>Phone Number (optional)</label>
              <input
                style={inp}
                placeholder="+94 77 000 0000"
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />

              <label style={labelStyle}>Student ID (optional)</label>
              <input
                style={inp}
                placeholder="e.g. 21/ENG/001"
                value={form.studentId}
                onChange={(e) => set('studentId', e.target.value)}
              />

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    height: 48,
                    background: '#fff',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 12,
                    color: '#1F2937',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={loading}
                  style={{
                    flex: 2,
                    height: 48,
                    background: loading ? '#ccc' : '#f5a623',
                    border: 'none',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Poppins',
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account →'}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3 (SELLER): Review & Submit ─── */}
          {step === 3 && role === 'seller' && (
            <>
              <span style={badgeStyle}>Step 3 of {totalSteps}</span>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
                Review & Submit
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
                Check your details before submitting
              </p>

              {error && <div style={errBox}>{error}</div>}

              {[
                ['Name', form.name],
                ['Email', form.email],
                ['Shop Name', form.shopName],
                ['University', form.university],
                ['Campus Area', form.facultyArea],
                ['Category', form.category],
                ['Phone', form.phone || '—'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '11px 0',
                    borderBottom: '1px solid #F3F4F6',
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: '#6B7280', fontWeight: 500 }}>{k}</span>
                  <span
                    style={{
                      color: '#1F2937',
                      fontWeight: 600,
                      textAlign: 'right',
                      maxWidth: '60%',
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}

              <div
                style={{
                  background: '#f0faf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: 12,
                  padding: '14px 16px',
                  marginTop: 20,
                  marginBottom: 24,
                }}
              >
                <p style={{ fontSize: 13, color: '#065f46', lineHeight: 1.6, margin: 0 }}>
                  ✅ After submitting, your account will be reviewed by an admin. You'll receive an email once approved — usually within 24 hours.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    height: 48,
                    background: '#fff',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 12,
                    color: '#1F2937',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    flex: 2,
                    height: 48,
                    background: loading ? '#ccc' : '#f5a623',
                    border: 'none',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Poppins',
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

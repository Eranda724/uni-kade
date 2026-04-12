import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// Step indicators for left panel
const STEPS = [
  { n: 1, title: 'Personal Info', desc: 'Your name, email, password' },
  { n: 2, title: 'Shop Info', desc: 'Shop name, category, location' },
  { n: 3, title: 'Done!', desc: 'Wait for admin approval' },
]

// Universities list — later load from API
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

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // All form data
  const [form, setForm] = useState({
    // Step 1
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2
    shopName: '',
    shopDescription: '',
    university: '',
    facultyArea: '',
    category: '',
    phone: '',
    // Step 3 — image
    logo: null,
    logoPreview: null,
  })

  const set = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }))
    setError('')
  }

  // ── STEP VALIDATION ──────────────────────────────────────────
  const validateStep1 = () => {
    if (!form.name.trim()) return 'Please enter your name'
    if (!form.email.trim()) return 'Please enter your email'
    if (form.password.length < 6)
      return 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return null
  }

  const validateStep2 = () => {
    if (!form.shopName.trim()) return 'Please enter your shop name'
    if (!form.university) return 'Please select your university'
    if (!form.facultyArea.trim()) return 'Please enter your campus area'
    if (!form.category) return 'Please select a category'
    return null
  }

  const nextStep = () => {
    let err = null
    if (step === 1) err = validateStep1()
    if (step === 2) err = validateStep2()
    if (err) {
      setError(err)
      return
    }
    setStep((prev) => prev + 1)
  }

  // ── FINAL SUBMIT ────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          shopName: form.shopName,
          shopDescription: form.shopDescription,
          university: form.university,
          facultyArea: form.facultyArea,
          category: form.category,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setStep(4) // success screen
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // ── SHARED STYLES ────────────────────────────────────────────
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
  }
  const label = {
    fontSize: 11,
    fontWeight: 700,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
    display: 'block',
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div
        style={{
          width: 380,
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
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '3px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            marginBottom: 20,
          }}
        >
          🍴
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
          UNI-KADE
        </h1>
        <p
          style={{
            fontSize: 13,
            opacity: 0.85,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Join us and start
          <br />
          selling on campus today
        </p>

        {/* Step progress on left */}
        <div
          style={{
            marginTop: 36,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 12,
                background:
                  step === s.n
                    ? 'rgba(255,255,255,0.25)'
                    : 'rgba(255,255,255,0.08)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  background:
                    step > s.n
                      ? '#22c55e'
                      : step === s.n
                        ? '#f5a623'
                        : 'rgba(255,255,255,0.2)',
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
          {step <= 3 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: i <= step ? '#f5a623' : '#E5E7EB',
                  }}
                />
              ))}
            </div>
          )}

          {/* ── STEP 1: Personal Info ─── */}
          {step === 1 && (
            <>
              <span
                style={{
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
                }}
              >
                Step 1 of 3
              </span>

              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#1F2937',
                  marginBottom: 4,
                }}
              >
                Hello! Create Account
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#f5a623', fontWeight: 600 }}>
                  Sign in
                </Link>
              </p>

              {error && (
                <div
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: '10px 14px',
                    borderRadius: 10,
                    fontSize: 14,
                    marginBottom: 16,
                  }}
                >
                  {error}
                </div>
              )}

              <label style={label}>Your Name</label>
              <input
                style={inp}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />

              <label style={label}>Username or Email</label>
              <input
                style={inp}
                placeholder="Username or Email"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />

              <label style={label}>Password</label>
              <input
                style={inp}
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
              />

              <label style={label}>Confirm Password</label>
              <input
                style={inp}
                placeholder="Confirm Password"
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
                  marginBottom: 16,
                }}
              >
                Continue →
              </button>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                <span style={{ fontSize: 12, color: '#6B7280' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
              </div>

              {/* Social buttons */}
              {[
                {
                  icon: '🔵',
                  label: 'Connect with Facebook',
                  bg: '#1877f2',
                  letter: 'f',
                },
                {
                  icon: '🔴',
                  label: 'Connect with Google',
                  bg: '#ea4335',
                  letter: 'G',
                },
              ].map((b) => (
                <button
                  key={b.label}
                  style={{
                    width: '100%',
                    height: 44,
                    background: '#fff',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                    marginBottom: 10,
                    color: '#1F2937',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: b.bg,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {b.letter}
                  </div>
                  {b.label}
                </button>
              ))}
            </>
          )}

          {/* ── STEP 2: Shop Info ─── */}
          {step === 2 && (
            <>
              <span
                style={{
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
                }}
              >
                Step 2 of 3
              </span>

              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#1F2937',
                  marginBottom: 4,
                }}
              >
                Your Shop Info
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
                Tell us about your campus shop or canteen
              </p>

              {error && (
                <div
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: '10px 14px',
                    borderRadius: 10,
                    fontSize: 14,
                    marginBottom: 16,
                  }}
                >
                  {error}
                </div>
              )}

              <label style={label}>Shop Name</label>
              <input
                style={inp}
                placeholder="e.g. Mama's Kitchen"
                value={form.shopName}
                onChange={(e) => set('shopName', e.target.value)}
              />

              <label style={label}>Phone Number</label>
              <input
                style={inp}
                placeholder="+94 77 000 0000"
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />

              <label style={label}>University</label>
              <select
                style={{ ...inp, cursor: 'pointer' }}
                value={form.university}
                onChange={(e) => set('university', e.target.value)}
              >
                <option value="">Select your university</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>

              <label style={label}>Campus Area / Location</label>
              <input
                style={inp}
                placeholder="e.g. Main Canteen Block, Block B"
                value={form.facultyArea}
                onChange={(e) => set('facultyArea', e.target.value)}
              />

              <label style={label}>Category</label>
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

              <label style={label}>Shop Description (optional)</label>
              <textarea
                style={{
                  ...inp,
                  height: 80,
                  padding: '12px 16px',
                  resize: 'none',
                }}
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

          {/* ── STEP 3: Review & Submit ─── */}
          {step === 3 && (
            <>
              <span
                style={{
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
                }}
              >
                Step 3 of 3
              </span>

              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#1F2937',
                  marginBottom: 4,
                }}
              >
                Review & Submit
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
                Check your details before submitting
              </p>

              {error && (
                <div
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: '10px 14px',
                    borderRadius: 10,
                    fontSize: 14,
                    marginBottom: 16,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Summary box */}
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

              {/* Info box */}
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
                <p style={{ fontSize: 13, color: '#065f46', lineHeight: 1.6 }}>
                  ✅ After submitting, your account will be reviewed by admin.
                  You'll receive an email once approved. This usually takes less
                  than 24 hours.
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

          {/* ── STEP 4: Success ─── */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#1F2937',
                  marginBottom: 12,
                }}
              >
                Registration Submitted!
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: '#6B7280',
                  lineHeight: 1.7,
                  marginBottom: 32,
                }}
              >
                Thank you{' '}
                <strong style={{ color: '#1F2937' }}>{form.name}</strong>!<br />
                Your shop{' '}
                <strong style={{ color: '#f5a623' }}>{form.shopName}</strong> is
                under review.
                <br />
                We'll email you at{' '}
                <strong style={{ color: '#1F2937' }}>{form.email}</strong> once
                approved.
              </p>
              <button
                onClick={() => navigate('/login')}
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
                Go to Login →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

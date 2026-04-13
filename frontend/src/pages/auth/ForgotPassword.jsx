import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Please enter your email address'); return }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
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
          🔐
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>UNI-KADE</h1>
        <p style={{ fontSize: 13, opacity: 0.85, textAlign: 'center', lineHeight: 1.6 }}>
          Reset your password and<br />get back to your account
        </p>

        <div
          style={{
            marginTop: 36,
            width: '100%',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.9, margin: 0 }}>
            💡 <strong>How it works:</strong><br />
            Enter your email address and we'll send you a link to reset your password. The link expires in 30 minutes.
          </p>
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
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          {sent ? (
            /* ── SUCCESS STATE ── */
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 72, marginBottom: 20 }}>📬</div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginBottom: 12 }}>
                Check Your Email
              </h2>
              <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, marginBottom: 32 }}>
                We've sent a password reset link to<br />
                <strong style={{ color: '#1F2937' }}>{email}</strong>.<br />
                It expires in 30 minutes.
              </p>
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
                  Didn't receive the email? Check your spam folder or try again in a few minutes.
                </p>
              </div>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  background: '#f5a623',
                  color: '#fff',
                  padding: '13px 32px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                ← Back to Login
              </Link>
            </div>
          ) : (
            /* ── FORM STATE ── */
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
                Account Recovery
              </span>

              <h2
                style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}
              >
                Forgot Password?
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
                Enter the email you registered with and we'll send you a reset link.
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

              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 5,
                  display: 'block',
                }}
              >
                Email Address
              </label>
              <input
                style={inp}
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  height: 48,
                  background: loading ? '#ccc' : '#f5a623',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Poppins',
                  marginBottom: 20,
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280' }}>
                Remember your password?{' '}
                <Link to="/login" style={{ color: '#f5a623', fontWeight: 600 }}>
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

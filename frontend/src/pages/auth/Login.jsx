import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'admin') navigate('/admin/dashboard')
      else navigate('/seller/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* LEFT — Branding */}
      <div
        style={{
          width: '420px',
          background: 'linear-gradient(155deg, #1a5c3a, #2d8a57 60%, #F5A623)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          color: 'white',
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '3px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            marginBottom: 24,
          }}
        >
          🍴
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          UNI-KADE
        </h1>
        <p
          style={{
            opacity: 0.85,
            textAlign: 'center',
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          Your university campus
          <br />
          food & supplies hub
        </p>
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            width: '100%',
          }}
        >
          {[
            'Manage your canteen orders',
            'Real-time order notifications',
            'Track your daily revenue',
            'Manage product listings',
          ].map((f) => (
            <div
              key={f}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#F5A623',
                  flexShrink: 0,
                }}
              />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          background: '#fff',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <span
            style={{
              background: '#fff3e0',
              color: '#e65c00',
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 6,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Seller Portal
          </span>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginTop: 16,
              marginBottom: 4,
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              Create new account
            </Link>
          </p>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '12px 16px',
                borderRadius: 10,
                fontSize: 14,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Username or Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                height: 48,
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0 16px',
                fontSize: 14,
                marginTop: 6,
                marginBottom: 16,
                outline: 'none',
                fontFamily: 'Poppins',
              }}
            />

            {/* Password */}
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Password
            </label>
            <div
              style={{ position: 'relative', marginTop: 6, marginBottom: 8 }}
            >
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  height: 48,
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '0 44px 0 16px',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'Poppins',
                }}
              />
              <span
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                {showPass ? '🙈' : '👁'}
              </span>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <Link
                to="/forgot-password"
                style={{
                  color: 'var(--primary)',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: 50,
                background: loading ? '#ccc' : 'var(--primary)',
                border: 'none',
                borderRadius: 'var(--radius)',
                color: 'white',
                fontSize: 16,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '20px 0',
              }}
            >
              <div
                style={{ flex: 1, height: 1, background: 'var(--border)' }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                OR
              </span>
              <div
                style={{ flex: 1, height: 1, background: 'var(--border)' }}
              />
            </div>

            <button
              type="button"
              style={{
                width: '100%',
                height: 48,
                background: '#fff',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#ea4335',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                G
              </div>
              Connect with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

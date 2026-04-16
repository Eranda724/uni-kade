import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../common/ThemeToggle'

const NAV = [
  { to: '/student/home', icon: '🏠', label: 'Home' },
  { to: '/student/orders', icon: '📦', label: 'My Orders' },
  { to: '/student/profile', icon: '👤', label: 'Profile' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: 'var(--bg)', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      {/* ── TOP NAVBAR ─────────────────────────────── */}
      <nav
        style={{
          background: 'var(--nav-bg)',
          borderBottom: '1px solid var(--border)',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: 32,
          transition: 'all 0.3s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--secondary)',
            marginRight: 16,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--secondary), #2d8a57)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            🍴
          </div>
          UNI<span style={{ color: 'var(--primary)' }}>-KADE</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--secondary)' : 'var(--text-muted)',
                background: isActive ? 'var(--success-bg)' : 'transparent',
                transition: 'all 0.2s',
              })}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* User area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{user?.name || 'Student'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.university || ''}</div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--secondary), #2d8a57)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 800,
              color: '#fff',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
          
          <ThemeToggle />

          <button
            onClick={logout}
            style={{
              height: 38,
              padding: '0 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s',
              fontFamily: 'Poppins',
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── PAGE CONTENT ─────────────────────────────── */}
      <main style={{ padding: '36px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

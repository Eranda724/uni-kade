import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/student/home', icon: '🏠', label: 'Home' },
  { to: '/student/orders', icon: '📦', label: 'My Orders' },
  { to: '/student/profile', icon: '👤', label: 'Profile' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: '#F8F9FC', minHeight: '100vh' }}>
      {/* ── TOP NAVBAR ─────────────────────────────── */}
      <nav
        style={{
          background: '#fff',
          borderBottom: '1px solid #E5E7EB',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: 32,
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
            color: '#1a5c3a',
            marginRight: 16,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#1a5c3a,#2d8a57)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            🍴
          </div>
          UNI<span style={{ color: '#f5a623' }}>-KADE</span>
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
                color: isActive ? '#1a5c3a' : '#6B7280',
                background: isActive ? '#e8f5e9' : 'transparent',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* User area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>{user?.name || 'Student'}</div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>{user?.university || ''}</div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#1a5c3a,#2d8a57)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 800,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <button
            onClick={logout}
            style={{
              height: 34,
              padding: '0 14px',
              background: '#F8F9FC',
              border: '1.5px solid #E5E7EB',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              color: '#6B7280',
              fontFamily: 'Poppins',
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── PAGE CONTENT ─────────────────────────────── */}
      <main style={{ padding: '36px 48px' }}>
        <Outlet />
      </main>
    </div>
  )
}

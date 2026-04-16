import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../common/ThemeToggle'

const NAV = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/sellers', icon: '🏪', label: 'Sellers' },
  { to: '/admin/orders', icon: '📦', label: 'All Orders' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', background: 'var(--bg)', transition: 'all 0.3s ease' }}>
      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside
        style={{
          width: 240,
          background: '#0f3d28',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '28px 24px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 18,
              fontWeight: 800,
              color: '#fff',
            }}
          >
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
                border: '2px solid rgba(245,166,35,0.5)',
              }}
            >
              🍴
            </div>
            UNI<span style={{ color: 'var(--primary)' }}>-KADE</span>
          </div>
          <div
            style={{
              marginTop: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(245,166,35,0.15)',
              border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            ⚡ Admin Panel
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(245,166,35,0.1)' : 'transparent',
                transition: 'all 0.15s',
                borderLeft: isActive ? `3px solid var(--primary)` : '3px solid transparent',
              })}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Admin user + Logout */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800,
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Admin'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                Administrator
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <ThemeToggle />
            <button
              onClick={logout}
              style={{
                flex: 1,
                height: 40,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                color: 'rgba(255,255,255,0.8)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Poppins',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.07)'}
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <main style={{ flex: 1, background: 'var(--bg)', overflowY: 'auto', padding: '32px 48px', transition: 'background-color 0.3s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

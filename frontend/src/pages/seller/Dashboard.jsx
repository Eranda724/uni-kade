import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// ─── Mock Data ────────────────────────────────────────────────
const MOCK_STATS = [
  {
    label: "Today's Revenue",
    value: 'Rs. 3,840',
    sub: '+12% from yesterday',
    icon: '💰',
    accent: '#16a34a',
    bg: '#e8f5e9',
  },
  {
    label: 'Orders Today',
    value: '24',
    sub: '6 pending now',
    icon: '📦',
    accent: '#e65c00',
    bg: '#fff3e0',
  },
  {
    label: 'Total Products',
    value: '18',
    sub: '3 out of stock',
    icon: '🛍️',
    accent: '#2563eb',
    bg: '#eff6ff',
  },
  {
    label: 'Avg. Rating',
    value: '4.8 ⭐',
    sub: 'Based on 120 reviews',
    icon: '⭐',
    accent: '#7c3aed',
    bg: '#f5f3ff',
  },
]

const MOCK_RECENT = [
  {
    id: '#ORD-001',
    student: 'Kasun Perera',
    items: 'Rice & Curry × 2',
    total: 380,
    status: 'Pending',
    time: '2 min ago',
  },
  {
    id: '#ORD-002',
    student: 'Nimali Silva',
    items: 'Kottu × 1, Juice × 1',
    total: 290,
    status: 'Preparing',
    time: '8 min ago',
  },
  {
    id: '#ORD-003',
    student: 'Ashan Fernando',
    items: 'Short Eats × 4',
    total: 160,
    status: 'Ready',
    time: '15 min ago',
  },
  {
    id: '#ORD-004',
    student: 'Dinusha Ranasinghe',
    items: 'Fried Rice × 1',
    total: 220,
    status: 'Completed',
    time: '32 min ago',
  },
]

// Last 7 days mock revenue
const WEEK_DATA = [
  { day: 'Mon', rev: 2100 },
  { day: 'Tue', rev: 3400 },
  { day: 'Wed', rev: 2800 },
  { day: 'Thu', rev: 4200 },
  { day: 'Fri', rev: 3840 },
  { day: 'Sat', rev: 5100 },
  { day: 'Sun', rev: 1900 },
]

const STATUS_STYLE = {
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Preparing: { bg: 'var(--border-light)', color: 'var(--secondary)' },
  Ready: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Completed: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  Cancelled: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

// ─── Greeting based on time ───────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Mini bar chart ───────────────────────────────────────────
function WeekChart({ data }) {
  const max = Math.max(...data.map((d) => d.rev))
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        height: 80,
        padding: '0 4px',
      }}
    >
      {data.map((d, i) => {
        const isToday = i === 4 // Friday = "today" in mock
        const pct = (d.rev / max) * 100
        return (
          <div
            key={d.day}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <div
              title={`Rs. ${d.rev.toLocaleString()}`}
              style={{
                width: '100%',
                borderRadius: '4px 4px 0 0',
                height: `${pct}%`,
                background: isToday ? 'var(--primary)' : 'var(--success-bg)',
                minHeight: 4,
                transition: 'height 0.4s',
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: isToday ? 'var(--primary)' : 'var(--text-light)',
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {d.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────
export default function SellerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [toggling, setToggling] = useState(false)
  const pendingCount = MOCK_RECENT.filter((o) => o.status === 'Pending').length

  // Simulate toggle API call
  const handleToggle = async () => {
    setToggling(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsOpen((v) => !v)
    setToggling(false)
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* ── Header row ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 28,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 4,
            }}
          >
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Seller'} 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Here's what's happening at your shop today.
          </p>
        </div>

        {/* ── Open / Close toggle ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '12px 18px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 2 }}>
              Shop Status
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: isOpen ? 'var(--success-text)' : 'var(--danger-text)',
              }}
            >
              {toggling
                ? 'Updating...'
                : isOpen
                  ? '● Open for orders'
                  : '○ Closed'}
            </div>
          </div>
          {/* Toggle switch */}
          <div
            onClick={!toggling ? handleToggle : undefined}
            style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              background: isOpen ? 'var(--success-bg)' : 'var(--border)',
              position: 'relative',
              cursor: toggling ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 3,
                left: isOpen ? 24 : 4,
                transition: 'left 0.3s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Pending orders alert ─────────────────────────────── */}
      {pendingCount > 0 && (
        <div
          onClick={() => navigate('/seller/orders')}
          style={{
            background: 'var(--warning-bg)',
            border: '1.5px solid var(--primary)',
            borderRadius: 12,
            padding: '12px 18px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--warning-text)' }}>
              You have {pendingCount} pending order{pendingCount > 1 ? 's' : ''}{' '}
              waiting for confirmation!
            </span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>
            View Orders →
          </span>
        </div>
      )}

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 18,
          marginBottom: 28,
        }}
      >
        {MOCK_STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 16,
              padding: '20px 18px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                {s.icon}
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: 'var(--text)',
                marginBottom: 2,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 11, color: 'var(--success-text)', fontWeight: 600 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom grid: Recent Orders + Weekly chart ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Recent orders table */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
              Recent Orders
            </h2>
            <span
              onClick={() => navigate('/seller/orders')}
              style={{
                fontSize: 13,
                color: 'var(--primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View All →
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)' }}>
                {['Order', 'Student', 'Items', 'Total', 'Status', 'Time'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '10px 18px',
                        fontSize: 10,
                        fontWeight: 700,
                        color: 'var(--text-light)',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT.map((o, i) => (
                <tr
                  key={o.id}
                  style={{
                    borderTop: '1px solid var(--border-light)',
                    background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-hover)',
                  }}
                >
                  <td
                    style={{
                      padding: '13px 18px',
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--text)',
                    }}
                  >
                    {o.id}
                  </td>
                  <td
                    style={{
                      padding: '13px 18px',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {o.student}
                  </td>
                  <td
                    style={{
                      padding: '13px 18px',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      maxWidth: 150,
                    }}
                  >
                    {o.items}
                  </td>
                  <td
                    style={{
                      padding: '13px 18px',
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--secondary)',
                    }}
                  >
                    Rs. {o.total}
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        ...STATUS_STYLE[o.status],
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '13px 18px',
                      fontSize: 11,
                      color: 'var(--text-light)',
                    }}
                  >
                    {o.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Weekly chart card */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            padding: 22,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 4,
            }}
          >
            Weekly Revenue
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--secondary)',
              marginBottom: 4,
            }}
          >
            Rs. 23,340
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--success-text)',
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            ↑ +8% vs last week
          </div>
          <WeekChart data={WEEK_DATA} />
          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: 'var(--text-light)',
              textAlign: 'center',
            }}
          >
            Today highlighted in orange
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../services/api'

const STATUS_STYLE = {
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Preparing: { bg: 'var(--border-light)', color: 'var(--secondary)' },
  Ready: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Delivered: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  Completed: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  Cancelled: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diffMins = Math.floor((now - d) / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  return `${Math.floor(diffMins / 60)}h ago`
}

function WeekChart({ data }) {
  const max = Math.max(...data.map((d) => d.rev), 1)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const todayIdx = new Date().getDay()
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, padding: '0 4px' }}>
      {data.map((d, i) => {
        const isToday = i === todayIdx
        const pct = (d.rev / max) * 100
        return (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              title={`Rs. ${d.rev.toLocaleString()}`}
              style={{
                width: '100%', borderRadius: '4px 4px 0 0',
                height: `${pct}%`, minHeight: 4, transition: 'height 0.4s',
                background: isToday ? 'var(--primary)' : 'var(--success-bg)',
              }}
            />
            <span style={{ fontSize: 10, color: isToday ? 'var(--primary)' : 'var(--text-light)', fontWeight: isToday ? 700 : 400 }}>
              {days[i]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function SellerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(user?.isOpen !== false)
  const [toggling, setToggling] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState([])
  const [stats, setStats] = useState({ todayRevenue: 0, todayOrders: 0, totalProducts: 0, pending: 0 })
  const [weekData, setWeekData] = useState(Array.from({ length: 7 }, (_, i) => ({ day: i, rev: 0 })))

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [ordersRes, productsRes] = await Promise.all([
          API.get('/orders'),
          API.get('/products'),
        ])
        const orders = ordersRes.data
        const products = productsRes.data

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const todayOrders = orders.filter(o => new Date(o.createdAt) >= today)
        const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
        const pending = orders.filter(o => o.status === 'Pending').length

        // Weekly revenue (last 7 days indexed by day of week)
        const week = Array.from({ length: 7 }, (_, i) => ({ day: i, rev: 0 }))
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
        sevenDaysAgo.setHours(0, 0, 0, 0)
        orders.forEach(o => {
          const d = new Date(o.createdAt)
          if (d >= sevenDaysAgo) {
            week[d.getDay()].rev += o.total
          }
        })

        setStats({ todayRevenue, todayOrders: todayOrders.length, totalProducts: products.length, pending })
        setRecentOrders(orders.slice(0, 5))
        setWeekData(week)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleToggle = async () => {
    setToggling(true)
    try {
      await API.patch('/users/profile', { isOpen: !isOpen })
      setIsOpen(v => !v)
    } catch (err) {
      console.error('Toggle error:', err)
    } finally {
      setToggling(false)
    }
  }

  const STATS_CARDS = [
    { label: "Today's Revenue", value: `Rs. ${stats.todayRevenue.toLocaleString()}`, icon: '💰', accent: '#16a34a', bg: '#e8f5e9' },
    { label: 'Orders Today', value: stats.todayOrders, sub: `${stats.pending} pending`, icon: '📦', accent: '#e65c00', bg: '#fff3e0' },
    { label: 'Total Products', value: stats.totalProducts, icon: '🛍️', accent: '#2563eb', bg: '#eff6ff' },
    { label: 'Pending Orders', value: stats.pending, icon: '🔔', accent: '#7c3aed', bg: '#f5f3ff' },
  ]

  const weeklyTotal = weekData.reduce((s, d) => s + d.rev, 0)

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* ── Header row ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Seller'} 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Here's what's happening at your shop today.
          </p>
        </div>

        {/* Shop open/close toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '12px 18px', boxShadow: 'var(--shadow-sm)',
        }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 2 }}>Shop Status</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: isOpen ? 'var(--success-text)' : 'var(--danger-text)' }}>
              {toggling ? 'Updating...' : isOpen ? '● Open for orders' : '○ Closed'}
            </div>
          </div>
          <div
            onClick={!toggling ? handleToggle : undefined}
            style={{
              width: 48, height: 26, borderRadius: 13,
              background: isOpen ? 'var(--success-bg)' : 'var(--border)',
              position: 'relative', cursor: toggling ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s', flexShrink: 0,
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3, left: isOpen ? 24 : 4,
              transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
        </div>
      </div>

      {/* ── Pending alert ─────────────────────────────────── */}
      {stats.pending > 0 && (
        <div
          onClick={() => navigate('/seller/orders')}
          style={{
            background: 'var(--warning-bg)', border: '1.5px solid var(--primary)',
            borderRadius: 12, padding: '12px 18px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--warning-text)' }}>
              You have {stats.pending} pending order{stats.pending > 1 ? 's' : ''} waiting!
            </span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>View Orders →</span>
        </div>
      )}

      {/* ── Stat cards ──────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>⏳ Loading dashboard...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 18, marginBottom: 28 }}>
            {STATS_CARDS.map((s) => (
              <div key={s.label} style={{
                background: 'var(--bg-card)', borderRadius: 16, padding: '20px 18px',
                border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: s.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, marginBottom: 14,
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
                {s.sub && <div style={{ fontSize: 11, color: s.accent, fontWeight: 600 }}>{s.sub}</div>}
              </div>
            ))}
          </div>

          {/* ── Recent Orders + Weekly chart ─────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Recent Orders</h2>
                <span onClick={() => navigate('/seller/orders')} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
                  View All →
                </span>
              </div>
              {recentOrders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No orders yet</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)' }}>
                      {['Order', 'Student', 'Items', 'Total', 'Status', 'Time'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 18px', fontSize: 10, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o, i) => (
                      <tr key={o._id} style={{ borderTop: '1px solid var(--border-light)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-hover)' }}>
                        <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                          #{o._id.slice(-5).toUpperCase()}
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: 13, color: 'var(--text-secondary)' }}>
                          {o.student?.name || 'Student'}
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: 12, color: 'var(--text-muted)', maxWidth: 150 }}>
                          {o.items.map(it => `${it.name} × ${it.qty}`).join(', ')}
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 700, color: 'var(--secondary)' }}>
                          Rs. {o.total}
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, ...STATUS_STYLE[o.status] }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: 11, color: 'var(--text-light)' }}>
                          {formatTime(o.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Weekly chart */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', padding: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Weekly Revenue</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--secondary)', marginBottom: 4 }}>
                Rs. {weeklyTotal.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 20 }}>Last 7 days</div>
              <WeekChart data={weekData} />
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-light)', textAlign: 'center' }}>
                Today highlighted in orange
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

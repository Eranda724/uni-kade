import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../services/api'

const STATUS_STYLE = {
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Preparing: { bg: 'var(--info-bg)', color: 'var(--info-text)' },
  Ready: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Delivered: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  Completed: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  Cancelled: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000)
  if (diff < 1) return 'Just now'
  if (diff < 60) return `${diff} min ago`
  return `${Math.floor(diff / 60)}h ago`
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [pendingSellers, setPendingSellers] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [statsRes, sellersRes, ordersRes] = await Promise.all([
        API.get('/users/admin/stats'),
        API.get('/users?role=seller&status=pending'),
        API.get('/orders'),
      ])
      setStats(statsRes.data)
      setPendingSellers(sellersRes.data)
      setRecentOrders(ordersRes.data.slice(0, 4))
    } catch (err) {
      console.error('Admin dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSellerStatus = async (id, status) => {
    try {
      await API.patch(`/users/${id}/status`, { status })
      setPendingSellers(prev => prev.filter(s => s._id !== id))
      if (stats) {
        setStats(prev => ({
          ...prev,
          pendingSellers: (prev.pendingSellers || 1) - 1,
          totalSellers: status === 'approved' ? (prev.totalSellers || 0) + 1 : prev.totalSellers,
        }))
      }
    } catch (err) {
      console.error('Status update error:', err)
    }
  }

  const STATS_CARDS = stats ? [
    { label: 'Total Sellers', value: stats.totalSellers ?? '—', sub: `${stats.pendingSellers ?? 0} pending approval`, icon: '🏪', accent: 'var(--success-text)', bg: 'var(--success-bg)' },
    { label: 'Total Students', value: stats.totalStudents ?? '—', sub: 'Registered users', icon: '🎓', accent: 'var(--info-text)', bg: 'var(--info-bg)' },
    { label: 'Orders Today', value: stats.ordersToday ?? '—', sub: 'Across all shops', icon: '📦', accent: 'var(--primary)', bg: 'var(--warning-bg)' },
    { label: "Today's Revenue", value: `Rs. ${(stats.revenue ?? 0).toLocaleString()}`, sub: 'Today total', icon: '💰', accent: 'var(--secondary)', bg: 'var(--bg-hover)' },
  ] : []

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
          Admin Dashboard ⚡
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Platform overview and pending actions.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>⏳ Loading dashboard...</div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 36 }}>
            {STATS_CARDS.map((s) => (
              <div key={s.label} style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '22px 20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: s.accent }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Pending Approvals */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>🕐 Pending Approvals</h2>
                <span style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', padding: '3px 10px', borderRadius: 7, fontSize: 12, fontWeight: 700 }}>
                  {pendingSellers.length} waiting
                </span>
              </div>

              {pendingSellers.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  All caught up! No pending approvals.
                </div>
              ) : (
                pendingSellers.map((s, i) => (
                  <div key={s._id} style={{ padding: '16px 22px', borderBottom: i < pendingSellers.length - 1 ? '1px solid var(--border-light)' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary), #2d8a57)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                      {(s.name || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{s.shopName || 'Unnamed Shop'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.name} · {s.university || 'Unknown University'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 1 }}>{timeAgo(s.createdAt)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleSellerStatus(s._id, 'approved')}
                        style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: 'var(--success-bg)', color: 'var(--success-text)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins' }}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleSellerStatus(s._id, 'rejected')}
                        style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: 'var(--danger-bg)', color: 'var(--danger-text)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins' }}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recent Orders */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>📦 Recent Orders</h2>
                <span onClick={() => navigate('/admin/orders')} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
                  View All →
                </span>
              </div>

              {recentOrders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No orders yet</div>
              ) : (
                recentOrders.map((order, i) => (
                  <div key={order._id} style={{ padding: '14px 22px', borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border-light)' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>#{order._id.slice(-6).toUpperCase()}</span>
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, ...STATUS_STYLE[order.status] }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {order.student?.name || 'Student'} · {order.seller?.shopName || 'Shop'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--secondary)' }}>Rs. {order.total}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{timeAgo(order.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

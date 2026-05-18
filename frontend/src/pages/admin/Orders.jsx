import { useState, useEffect } from 'react'
import API from '../../services/api'

const STATUS_STYLE = {
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Preparing: { bg: 'var(--info-bg)', color: 'var(--info-text)' },
  Ready: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Delivered: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  Completed: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  Cancelled: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

const STATUSES = ['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Completed', 'Cancelled']

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000)
  if (diff < 1) return 'Just now'
  if (diff < 60) return `${diff} min ago`
  return `${Math.floor(diff / 60)}h ago`
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await API.get('/orders')
        setOrders(res.data)
      } catch (err) {
        console.error('Admin orders fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const displayed = orders.filter((o) => {
    const studentName = o.student?.name || ''
    const shopName = o.seller?.shopName || ''
    const shortId = o._id.slice(-6).toLowerCase()
    return (
      (filter === 'All' || o.status === filter) &&
      (studentName.toLowerCase().includes(search.toLowerCase()) ||
        shopName.toLowerCase().includes(search.toLowerCase()) ||
        shortId.includes(search.toLowerCase()))
    )
  })

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>All Orders</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {orders.length} total orders · Rs. {totalRevenue.toLocaleString()} revenue
          </p>
        </div>
        <div style={{ background: 'var(--success-bg)', borderRadius: 12, padding: '10px 18px', fontSize: 14, fontWeight: 700, color: 'var(--secondary)' }}>
          💰 Rs. {totalRevenue.toLocaleString()} total
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '7px 16px', borderRadius: 9,
                border: filter === s ? 'none' : '1.5px solid var(--border)',
                background: filter === s ? 'var(--primary)' : 'var(--bg-card)',
                color: filter === s ? '#fff' : 'var(--text-muted)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins',
              }}
            >
              {s}
              <span style={{
                marginLeft: 6,
                background: filter === s ? 'rgba(255,255,255,0.3)' : 'var(--bg-hover)',
                color: filter === s ? '#fff' : 'var(--text-muted)',
                padding: '1px 7px', borderRadius: 5, fontSize: 11, fontWeight: 700,
              }}>
                {s === 'All' ? orders.length : orders.filter(o => o.status === s).length}
              </span>
            </button>
          ))}
        </div>
        <input
          style={{
            height: 40, border: '1.5px solid var(--border)', borderRadius: 10,
            padding: '0 14px', fontSize: 13, fontFamily: 'Poppins', outline: 'none',
            background: 'var(--bg-card)', color: 'var(--text)', width: 240,
          }}
          placeholder="🔍  Search by order ID, student, shop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>⏳ Loading orders...</div>
      ) : (
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)' }}>
                {['Order ID', 'Student', 'Shop', 'Items', 'Total', 'Status', 'Time'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 18px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((o, i) => (
                <tr key={o._id} style={{ borderTop: '1px solid var(--border-light)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-hover)' }}>
                  <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>
                    #{o._id.slice(-6).toUpperCase()}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--text-secondary)' }}>
                    {o.student?.name || 'Student'}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>
                    {o.seller?.shopName || '—'}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 12, color: 'var(--text-muted)', maxWidth: 200 }}>
                    {o.items.map(it => `${it.name} × ${it.qty}`).join(', ')}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                    Rs. {o.total}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 7, fontSize: 12, fontWeight: 700, ...STATUS_STYLE[o.status] }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 12, color: 'var(--text-light)' }}>
                    {timeAgo(o.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)', fontSize: 14 }}>
              No orders found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

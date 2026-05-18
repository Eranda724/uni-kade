import { useState, useEffect } from 'react'
import API from '../../services/api'

// Map API status to display labels
const STATUS_MAP = {
  approved: 'Active',
  pending: 'Pending',
  rejected: 'Suspended',
}

const STATUS_STYLE = {
  Active: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Suspended: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

const FILTER_TABS = ['All', 'Active', 'Pending', 'Suspended']

function formatJoined(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export default function AdminSellers() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true)
        const res = await API.get('/users?role=seller')
        setSellers(res.data)
      } catch (err) {
        console.error('Sellers fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSellers()
  }, [])

  // Map API status to display label for filtering
  const withDisplay = sellers.map(s => ({
    ...s,
    displayStatus: STATUS_MAP[s.status] || 'Pending',
  }))

  const updateStatus = async (id, apiStatus) => {
    try {
      const res = await API.patch(`/users/${id}/status`, { status: apiStatus })
      setSellers(prev => prev.map(s => s._id === id ? { ...s, status: res.data.user.status } : s))
    } catch (err) {
      console.error('Status update error:', err)
    }
  }

  const displayed = withDisplay.filter(
    (s) =>
      (filter === 'All' || s.displayStatus === filter) &&
      ((s.shopName || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.name || '').toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Sellers</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {withDisplay.filter(s => s.displayStatus === 'Active').length} active ·{' '}
            {withDisplay.filter(s => s.displayStatus === 'Pending').length} pending ·{' '}
            {withDisplay.filter(s => s.displayStatus === 'Suspended').length} suspended
          </p>
        </div>
      </div>

      {/* Filters + search */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '7px 16px', borderRadius: 9,
                border: filter === t ? 'none' : '1.5px solid var(--border)',
                background: filter === t ? 'var(--primary)' : 'var(--bg-card)',
                color: filter === t ? '#fff' : 'var(--text-muted)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins',
              }}
            >
              {t}
              <span style={{
                marginLeft: 6,
                background: filter === t ? 'rgba(255,255,255,0.3)' : 'var(--bg-hover)',
                color: filter === t ? '#fff' : 'var(--text-muted)',
                padding: '1px 7px', borderRadius: 5, fontSize: 11, fontWeight: 700,
              }}>
                {t === 'All' ? sellers.length : withDisplay.filter(s => s.displayStatus === t).length}
              </span>
            </button>
          ))}
        </div>
        <input
          style={{
            height: 40, border: '1.5px solid var(--border)', borderRadius: 10,
            padding: '0 14px', fontSize: 13, fontFamily: 'Poppins', outline: 'none',
            background: 'var(--bg-card)', color: 'var(--text)', width: 230,
          }}
          placeholder="🔍  Search sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>⏳ Loading sellers...</div>
      ) : (
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)' }}>
                {['Seller', 'Shop', 'University', 'Category', 'Joined', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((s, i) => (
                <tr key={s._id} style={{ borderTop: '1px solid var(--border-light)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-hover)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary), #2d8a57)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                        {(s.name || '?')[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                    {s.shopName || '—'}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{s.university || '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-secondary)' }}>{s.category || '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{formatJoined(s.createdAt)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 7, fontSize: 12, fontWeight: 700, ...STATUS_STYLE[s.displayStatus] }}>
                      {s.displayStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {s.status === 'pending' && (
                        <button onClick={() => updateStatus(s._id, 'approved')} style={{ padding: '5px 11px', borderRadius: 7, border: 'none', background: 'var(--success-bg)', color: 'var(--success-text)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins', whiteSpace: 'nowrap' }}>
                          ✓ Approve
                        </button>
                      )}
                      {s.status === 'approved' && (
                        <button onClick={() => updateStatus(s._id, 'rejected')} style={{ padding: '5px 11px', borderRadius: 7, border: 'none', background: 'var(--danger-bg)', color: 'var(--danger-text)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins' }}>
                          Suspend
                        </button>
                      )}
                      {s.status === 'rejected' && (
                        <button onClick={() => updateStatus(s._id, 'approved')} style={{ padding: '5px 11px', borderRadius: 7, border: 'none', background: 'var(--success-bg)', color: 'var(--success-text)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins' }}>
                          Restore
                        </button>
                      )}
                      {s.status === 'pending' && (
                        <button onClick={() => updateStatus(s._id, 'rejected')} style={{ padding: '5px 11px', borderRadius: 7, border: 'none', background: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins' }}>
                          ✕ Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)', fontSize: 14 }}>
              No sellers found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

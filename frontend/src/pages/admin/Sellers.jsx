import { useState } from 'react'

const INIT_SELLERS = [
  { id: 1, name: 'Kasun Perera', shop: "Mama's Kitchen", university: 'University of Moratuwa', category: 'Food', orders: 142, status: 'Active', joined: 'Jan 2025' },
  { id: 2, name: 'Nimali Silva', shop: 'Campus Prints', university: 'SLIIT', category: 'Printing', orders: 98, status: 'Active', joined: 'Feb 2025' },
  { id: 3, name: 'Ashan Fernando', shop: 'NoteHub', university: 'University of Kelaniya', category: 'Stationery', orders: 203, status: 'Active', joined: 'Nov 2024' },
  { id: 4, name: 'Dinusha Ranasinghe', shop: 'Quick Bites', university: 'University of Moratuwa', category: 'Food', orders: 115, status: 'Pending', joined: 'Apr 2025' },
  { id: 5, name: 'Tharanga Wijesinghe', shop: 'Lab Mart', university: 'University of Peradeniya', category: 'Lab Equipment', orders: 67, status: 'Suspended', joined: 'Dec 2024' },
  { id: 6, name: 'Chathurika Jayawardena', shop: 'Print Zone', university: 'NSBM Green University', category: 'Printing', orders: 0, status: 'Pending', joined: 'Apr 2025' },
]

const STATUS_STYLE = {
  Active: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Suspended: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

const FILTER_TABS = ['All', 'Active', 'Pending', 'Suspended']

export default function AdminSellers() {
  const [sellers, setSellers] = useState(INIT_SELLERS)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const updateStatus = (id, newStatus) =>
    setSellers((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)))

  const displayed = sellers.filter(
    (s) =>
      (filter === 'All' || s.status === filter) &&
      (s.shop.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ padding: 32, fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Sellers</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {sellers.filter((s) => s.status === 'Active').length} active ·{' '}
            {sellers.filter((s) => s.status === 'Pending').length} pending ·{' '}
            {sellers.filter((s) => s.status === 'Suspended').length} suspended
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
                padding: '7px 16px',
                borderRadius: 9,
                border: filter === t ? 'none' : '1.5px solid var(--border)',
                background: filter === t ? 'var(--primary)' : 'var(--bg-card)',
                color: filter === t ? '#fff' : 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins',
              }}
            >
              {t}
              <span
                style={{
                  marginLeft: 6,
                  background: filter === t ? 'rgba(255,255,255,0.3)' : 'var(--bg-hover)',
                  color: filter === t ? '#fff' : 'var(--text-muted)',
                  padding: '1px 7px',
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {t === 'All' ? sellers.length : sellers.filter((s) => s.status === t).length}
              </span>
            </button>
          ))}
        </div>
        <input
          style={{
            height: 40,
            border: '1.5px solid var(--border)',
            borderRadius: 10,
            padding: '0 14px',
            fontSize: 13,
            fontFamily: 'Poppins',
            outline: 'none',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            width: 230,
          }}
          placeholder="🔍  Search sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 16,
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-input)' }}>
              {['Seller', 'Shop', 'University', 'Category', 'Orders', 'Joined', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 20px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((s, i) => (
              <tr
                key={s.id}
                style={{ borderTop: '1px solid var(--border-light)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-hover)' }}
              >
                {/* Seller */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--secondary), #2d8a57)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      {s.name[0]}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  {s.shop}
                </td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{s.university}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-secondary)' }}>{s.category}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>
                  {s.orders}
                </td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>{s.joined}</td>
                {/* Status */}
                <td style={{ padding: '14px 20px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      ...STATUS_STYLE[s.status],
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                {/* Actions */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {s.status === 'Pending' && (
                      <button
                        onClick={() => updateStatus(s.id, 'Active')}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          border: 'none',
                          background: 'var(--success-bg)',
                          color: 'var(--success-text)',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'Poppins',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ✓ Approve
                      </button>
                    )}
                    {s.status === 'Active' && (
                      <button
                        onClick={() => updateStatus(s.id, 'Suspended')}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          border: 'none',
                          background: 'var(--danger-bg)',
                          color: 'var(--danger-text)',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'Poppins',
                        }}
                      >
                        Suspend
                      </button>
                    )}
                    {s.status === 'Suspended' && (
                      <button
                        onClick={() => updateStatus(s.id, 'Active')}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          border: 'none',
                          background: 'var(--success-bg)',
                          color: 'var(--success-text)',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'Poppins',
                        }}
                      >
                        Restore
                      </button>
                    )}
                    {s.status === 'Pending' && (
                      <button
                        onClick={() => setSellers((prev) => prev.filter((x) => x.id !== s.id))}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          border: 'none',
                          background: 'var(--bg-hover)',
                          color: 'var(--text-muted)',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'Poppins',
                        }}
                      >
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
    </div>
  )
}

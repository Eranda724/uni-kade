import { useState } from 'react'

const MOCK_ORDERS = [
  { id: '#ORD-312', student: 'Thisara Nanayakkara', shop: "Mama's Kitchen", university: 'UoM', items: 'Rice & Curry × 2', total: 380, status: 'Preparing', time: '5 min ago' },
  { id: '#ORD-311', student: 'Ravindu Madushan', shop: 'Quick Bites', university: 'SLIIT', items: 'Kottu × 1', total: 250, status: 'Delivered', time: '11 min ago' },
  { id: '#ORD-310', student: 'Sanduni Perera', shop: 'Campus Prints', university: 'UoM', items: 'Color Print × 8', total: 200, status: 'Ready', time: '18 min ago' },
  { id: '#ORD-309', student: 'Charith Kumara', shop: 'NoteHub', university: 'UoK', items: 'A4 Paper × 1, Pen × 5', total: 535, status: 'Delivered', time: '22 min ago' },
  { id: '#ORD-308', student: 'Ishani Wijewardena', shop: 'Lab Mart', university: 'UoP', items: 'Lab Gloves × 2', total: 180, status: 'Pending', time: '28 min ago' },
  { id: '#ORD-307', student: 'Pasan Gunathilake', shop: "Mama's Kitchen", university: 'UoM', items: 'Short Eats × 4', total: 160, status: 'Delivered', time: '35 min ago' },
]

const STATUS_STYLE = {
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Preparing: { bg: 'var(--info-bg)', color: 'var(--info-text)' },
  Ready: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Delivered: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
}

const STATUSES = ['All', 'Pending', 'Preparing', 'Ready', 'Delivered']

export default function AdminOrders() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const displayed = MOCK_ORDERS.filter(
    (o) =>
      (filter === 'All' || o.status === filter) &&
      (o.student.toLowerCase().includes(search.toLowerCase()) ||
        o.shop.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase()))
  )

  const todayTotal = MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0)

  return (
    <div style={{ padding: 32, fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
            All Orders
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {MOCK_ORDERS.length} orders today · Total Rs. {todayTotal.toLocaleString()}
          </p>
        </div>
        <div
          style={{
            background: 'var(--success-bg)',
            borderRadius: 12,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--secondary)',
          }}
        >
          💰 Rs. {todayTotal.toLocaleString()} today
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
                padding: '7px 16px',
                borderRadius: 9,
                border: filter === s ? 'none' : '1.5px solid var(--border)',
                background: filter === s ? 'var(--primary)' : 'var(--bg-card)',
                color: filter === s ? '#fff' : 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins',
              }}
            >
              {s}
              <span
                style={{
                  marginLeft: 6,
                  background: filter === s ? 'rgba(255,255,255,0.3)' : 'var(--bg-hover)',
                  color: filter === s ? '#fff' : 'var(--text-muted)',
                  padding: '1px 7px',
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {s === 'All' ? MOCK_ORDERS.length : MOCK_ORDERS.filter((o) => o.status === s).length}
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
            width: 240,
          }}
          placeholder="🔍  Search by order, student, shop..."
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
              {['Order ID', 'Student', 'Shop', 'University', 'Items', 'Total', 'Status', 'Time'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 18px',
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
            {displayed.map((o, i) => (
              <tr
                key={o.id}
                style={{ borderTop: '1px solid var(--border-light)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-hover)' }}
              >
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>
                  {o.id}
                </td>
                <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--text-secondary)' }}>{o.student}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>
                  {o.shop}
                </td>
                <td style={{ padding: '14px 18px', fontSize: 12, color: 'var(--text-muted)' }}>{o.university}</td>
                <td style={{ padding: '14px 18px', fontSize: 12, color: 'var(--text-muted)' }}>{o.items}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  Rs. {o.total}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      ...STATUS_STYLE[o.status],
                    }}
                  >
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', fontSize: 12, color: 'var(--text-light)' }}>{o.time}</td>
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
    </div>
  )
}

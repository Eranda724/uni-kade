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
  Pending: { bg: '#fff3e0', color: '#e65c00' },
  Preparing: { bg: '#eff6ff', color: '#2563eb' },
  Ready: { bg: '#e8f5e9', color: '#16a34a' },
  Delivered: { bg: '#F3F4F6', color: '#6B7280' },
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
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
            All Orders
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280' }}>
            {MOCK_ORDERS.length} orders today · Total Rs. {todayTotal.toLocaleString()}
          </p>
        </div>
        <div
          style={{
            background: '#e8f5e9',
            borderRadius: 12,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 700,
            color: '#1a5c3a',
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
                border: filter === s ? 'none' : '1.5px solid #E5E7EB',
                background: filter === s ? '#f5a623' : '#fff',
                color: filter === s ? '#fff' : '#6B7280',
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
                  background: filter === s ? 'rgba(255,255,255,0.3)' : '#F3F4F6',
                  color: filter === s ? '#fff' : '#6B7280',
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
            border: '1.5px solid #E5E7EB',
            borderRadius: 10,
            padding: '0 14px',
            fontSize: 13,
            fontFamily: 'Poppins',
            outline: 'none',
            background: '#fff',
            color: '#1F2937',
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
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #F3F4F6',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FC' }}>
              {['Order ID', 'Student', 'Shop', 'University', 'Items', 'Total', 'Status', 'Time'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 18px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#6B7280',
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
                style={{ borderTop: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}
              >
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 800, color: '#1F2937' }}>
                  {o.id}
                </td>
                <td style={{ padding: '14px 18px', fontSize: 13, color: '#374151' }}>{o.student}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 600, color: '#1a5c3a' }}>
                  {o.shop}
                </td>
                <td style={{ padding: '14px 18px', fontSize: 12, color: '#6B7280' }}>{o.university}</td>
                <td style={{ padding: '14px 18px', fontSize: 12, color: '#6B7280' }}>{o.items}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 700, color: '#1F2937' }}>
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
                <td style={{ padding: '14px 18px', fontSize: 12, color: '#9CA3AF' }}>{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayed.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF', fontSize: 14 }}>
            No orders found
          </div>
        )}
      </div>
    </div>
  )
}

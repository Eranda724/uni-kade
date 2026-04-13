import { useState } from 'react'

const STATUSES = ['Pending', 'Preparing', 'Ready', 'Delivered']

const STATUS_STYLE = {
  Pending: { bg: '#fff3e0', color: '#e65c00' },
  Preparing: { bg: '#eff6ff', color: '#2563eb' },
  Ready: { bg: '#e8f5e9', color: '#16a34a' },
  Delivered: { bg: '#F3F4F6', color: '#6B7280' },
}

const INIT_ORDERS = [
  { id: '#ORD-001', student: 'Kasun Perera', phone: '077-111-2222', items: [{ name: 'Rice & Curry', qty: 2, price: 190 }], time: '10:02 AM', status: 'Pending', note: 'Less spicy please' },
  { id: '#ORD-002', student: 'Nimali Silva', phone: '071-333-4444', items: [{ name: 'Kottu', qty: 1, price: 250 }, { name: 'Fresh Juice', qty: 1, price: 60 }], time: '10:08 AM', status: 'Preparing', note: '' },
  { id: '#ORD-003', student: 'Ashan Fernando', phone: '076-555-6666', items: [{ name: 'Short Eats', qty: 4, price: 40 }], time: '10:14 AM', status: 'Ready', note: 'Extra sauce!' },
  { id: '#ORD-004', student: 'Dinusha Ranasinghe', phone: '070-777-8888', items: [{ name: 'Fried Rice', qty: 1, price: 220 }], time: '9:45 AM', status: 'Delivered', note: '' },
]

export default function SellerOrders() {
  const [orders, setOrders] = useState(INIT_ORDERS)
  const [filter, setFilter] = useState('All')

  const updateStatus = (id, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
  }

  const nextStatus = (current) => {
    const idx = STATUSES.indexOf(current)
    return idx < STATUSES.length - 1 ? STATUSES[idx + 1] : null
  }

  const displayed = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>Orders</h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>
          Manage incoming orders and update their status in real-time.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '7px 16px',
              borderRadius: 9,
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Poppins',
              background:
                filter === s
                  ? '#f5a623'
                  : '#fff',
              color: filter === s ? '#fff' : '#6B7280',
              border: filter === s ? 'none' : '1.5px solid #E5E7EB',
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
              {s === 'All' ? orders.length : orders.filter((o) => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Order cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {displayed.map((order) => {
          const total = order.items.reduce((sum, it) => sum + it.price * it.qty, 0)
          const next = nextStatus(order.status)
          return (
            <div
              key={order.id}
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              {/* Order ID & time */}
              <div style={{ minWidth: 100 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#1F2937' }}>{order.id}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{order.time}</div>
              </div>

              {/* Student */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>{order.student}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{order.phone}</div>
              </div>

              {/* Items */}
              <div style={{ flex: 2 }}>
                {order.items.map((it) => (
                  <div key={it.name} style={{ fontSize: 13, color: '#374151' }}>
                    {it.name} × {it.qty} — <span style={{ color: '#1a5c3a', fontWeight: 600 }}>Rs. {it.price * it.qty}</span>
                  </div>
                ))}
                {order.note && (
                  <div style={{ fontSize: 12, color: '#f5a623', marginTop: 4 }}>
                    📝 {order.note}
                  </div>
                )}
              </div>

              {/* Total */}
              <div style={{ minWidth: 90, textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1a5c3a' }}>Rs. {total}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
              </div>

              {/* Status badge */}
              <div style={{ minWidth: 90, textAlign: 'center' }}>
                <span
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    ...STATUS_STYLE[order.status],
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* Action button */}
              <div>
                {next ? (
                  <button
                    onClick={() => updateStatus(order.id, next)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: 'none',
                      background: '#f5a623',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Poppins',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Mark {next} →
                  </button>
                ) : (
                  <span style={{ fontSize: 18 }}>✅</span>
                )}
              </div>
            </div>
          )
        })}

        {displayed.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              color: '#9CA3AF',
              fontSize: 15,
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #F3F4F6',
            }}
          >
            No {filter === 'All' ? '' : filter.toLowerCase()} orders right now 🎉
          </div>
        )}
      </div>
    </div>
  )
}

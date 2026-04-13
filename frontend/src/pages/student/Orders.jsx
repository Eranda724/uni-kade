import { useState } from 'react'

// ─── Mock Data ────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: '#ORD-101',
    shop: "Mama's Kitchen",
    shopIcon: '🍱',
    items: [{ name: 'Rice & Curry', qty: 2, price: 190 }],
    date: 'Today, 10:15 AM',
    status: 'Preparing',
    total: 380,
    paymentMethod: 'Cash on Pickup',
  },
  {
    id: '#ORD-098',
    shop: 'NoteHub',
    shopIcon: '📚',
    items: [
      { name: 'A4 Paper (500)', qty: 1, price: 450 },
      { name: 'Ballpoint Pen x5', qty: 1, price: 85 },
    ],
    date: 'Yesterday, 2:30 PM',
    status: 'Completed',
    total: 535,
    paymentMethod: 'Cash on Pickup',
  },
  {
    id: '#ORD-091',
    shop: 'Campus Prints',
    shopIcon: '🖨️',
    items: [{ name: 'Color Print A4', qty: 8, price: 25 }],
    date: 'Apr 10, 11:00 AM',
    status: 'Completed',
    total: 200,
    paymentMethod: 'Cash on Pickup',
  },
  {
    id: '#ORD-085',
    shop: 'Quick Bites',
    shopIcon: '🥗',
    items: [
      { name: 'Kottu Roti', qty: 1, price: 250 },
      { name: 'Fresh Juice', qty: 1, price: 60 },
    ],
    date: 'Apr 8, 12:45 PM',
    status: 'Cancelled',
    total: 310,
    paymentMethod: 'Cash on Pickup',
  },
  {
    id: '#ORD-080',
    shop: "Mama's Kitchen",
    shopIcon: '🍱',
    items: [{ name: 'Fried Rice', qty: 1, price: 220 }],
    date: 'Apr 6, 1:00 PM',
    status: 'Pending',
    total: 220,
    paymentMethod: 'Cash on Pickup',
  },
]

// ─── Status config ─────────────────────────────────────────────
const STATUS = {
  Pending: {
    bg: '#fff3e0',
    color: '#e65c00',
    dot: '#f5a623',
    msg: 'Waiting for seller to confirm your order.',
  },
  Confirmed: {
    bg: '#eff6ff',
    color: '#2563eb',
    dot: '#3b82f6',
    msg: 'Seller confirmed! Your order is being prepared soon.',
  },
  Preparing: {
    bg: '#eff6ff',
    color: '#2563eb',
    dot: '#3b82f6',
    msg: 'Your order is being prepared. Please wait for the pickup call.',
  },
  Ready: {
    bg: '#e8f5e9',
    color: '#16a34a',
    dot: '#22c55e',
    msg: '✅ Your order is ready! Go pick it up now.',
  },
  Completed: { bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF', msg: null },
  Cancelled: {
    bg: '#fee2e2',
    color: '#dc2626',
    dot: '#ef4444',
    msg: 'This order was cancelled.',
  },
}

const TABS = ['All', 'Active', 'Completed', 'Cancelled']

// ─── Helpers ──────────────────────────────────────────────────
const isActive = (s) =>
  ['Pending', 'Confirmed', 'Preparing', 'Ready'].includes(s)

// ─── Component ────────────────────────────────────────────────
export default function StudentOrders() {
  const [tab, setTab] = useState('All')
  const [expanded, setExpanded] = useState(null) // order id currently expanded

  // ── Filter by tab ──────────────────────────────────────────
  const visible = MOCK_ORDERS.filter((o) => {
    if (tab === 'Active') return isActive(o.status)
    if (tab === 'Completed') return o.status === 'Completed'
    if (tab === 'Cancelled') return o.status === 'Cancelled'
    return true
  })

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id))

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: '#1F2937',
            marginBottom: 4,
          }}
        >
          My Orders
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>
          Track your current and past orders.
        </p>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 24,
          background: '#F8F9FC',
          borderRadius: 12,
          padding: 6,
          width: 'fit-content',
        }}
      >
        {TABS.map((t) => {
          const count = MOCK_ORDERS.filter((o) => {
            if (t === 'Active') return isActive(o.status)
            if (t === 'Completed') return o.status === 'Completed'
            if (t === 'Cancelled') return o.status === 'Cancelled'
            return true
          }).length
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '7px 18px',
                borderRadius: 8,
                border: 'none',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#1F2937' : '#6B7280',
                fontWeight: tab === t ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'Poppins',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t}
              {t !== 'All' && (
                <span
                  style={{
                    marginLeft: 6,
                    background: tab === t ? '#f5a623' : '#E5E7EB',
                    color: tab === t ? '#fff' : '#6B7280',
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Empty state ──────────────────────────────────────── */}
      {visible.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#F8F9FC',
            borderRadius: 20,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#1F2937',
              marginBottom: 6,
            }}
          >
            No orders here
          </p>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>
            {tab === 'Active'
              ? 'You have no active orders right now.'
              : `No ${tab.toLowerCase()} orders found.`}
          </p>
        </div>
      )}

      {/* ── Order Cards ──────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {visible.map((order) => {
          const st = STATUS[order.status]
          const isOpen = expanded === order.id
          return (
            <div
              key={order.id}
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* ── Card Header (always visible) ── */}
              <div
                onClick={() => toggle(order.id)}
                style={{ padding: '18px 22px', cursor: 'pointer' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    {/* Shop icon */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#e8f5e9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {order.shopIcon}
                    </div>

                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 3,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: '#1F2937',
                          }}
                        >
                          {order.id}
                        </span>
                        {/* Status dot + badge */}
                        <span
                          style={{
                            ...st,
                            padding: '2px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: st.dot,
                              display: 'inline-block',
                              marginRight: 5,
                            }}
                          />
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                        🏪 {order.shop} · {order.date}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 16 }}
                  >
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: '#1a5c3a',
                      }}
                    >
                      Rs. {order.total}
                    </span>
                    <span
                      style={{
                        fontSize: 18,
                        color: '#9CA3AF',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s',
                        display: 'block',
                      }}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* Status message bar (active orders only) */}
                {st.msg && (
                  <div
                    style={{
                      marginTop: 12,
                      background: st.bg,
                      borderRadius: 10,
                      padding: '9px 14px',
                      fontSize: 13,
                      color: st.color,
                      fontWeight: 600,
                    }}
                  >
                    {st.msg}
                  </div>
                )}
              </div>

              {/* ── Expanded detail ── */}
              {isOpen && (
                <div
                  style={{
                    borderTop: '1px solid #F3F4F6',
                    padding: '16px 22px',
                    background: '#FAFAFA',
                  }}
                >
                  {/* Items */}
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 10,
                    }}
                  >
                    Order Items
                  </p>
                  {order.items.map((it) => (
                    <div
                      key={it.name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 14,
                        color: '#374151',
                        padding: '6px 0',
                        borderBottom: '1px solid #F3F4F6',
                      }}
                    >
                      <span>
                        {it.name}{' '}
                        <span style={{ color: '#9CA3AF' }}>× {it.qty}</span>
                      </span>
                      <span style={{ fontWeight: 700, color: '#1F2937' }}>
                        Rs. {it.price * it.qty}
                      </span>
                    </div>
                  ))}

                  {/* Totals row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 10,
                      paddingTop: 10,
                      borderTop: '1.5px dashed #E5E7EB',
                      fontSize: 15,
                      fontWeight: 800,
                      color: '#1F2937',
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: '#1a5c3a' }}>Rs. {order.total}</span>
                  </div>

                  {/* Payment method */}
                  <div
                    style={{
                      marginTop: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      color: '#6B7280',
                    }}
                  >
                    <span>💵</span>
                    <span>
                      Payment:{' '}
                      <strong style={{ color: '#1F2937' }}>
                        {order.paymentMethod}
                      </strong>
                    </span>
                  </div>

                  {/* Action: reorder if completed */}
                  {order.status === 'Completed' && (
                    <button
                      style={{
                        marginTop: 16,
                        height: 40,
                        padding: '0 20px',
                        background: '#f5a623',
                        border: 'none',
                        borderRadius: 10,
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'Poppins',
                      }}
                    >
                      🔁 Reorder
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

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
    bg: 'var(--warning-bg)',
    color: 'var(--warning-text)',
    dot: 'var(--warning-text)',
    msg: 'Waiting for seller to confirm your order.',
  },
  Confirmed: {
    bg: 'var(--success-bg)',
    color: 'var(--success-text)',
    dot: 'var(--success-text)',
    msg: 'Seller confirmed! Your order is being prepared soon.',
  },
  Preparing: {
    bg: 'var(--success-bg)',
    color: 'var(--success-text)',
    dot: 'var(--success-text)',
    msg: 'Your order is being prepared. Please wait for the pickup call.',
  },
  Ready: {
    bg: 'var(--success-bg)',
    color: 'var(--success-text)',
    dot: 'var(--success-text)',
    msg: '✅ Your order is ready! Go pick it up now.',
  },
  Completed: { bg: 'var(--border-light)', color: 'var(--text-muted)', dot: 'var(--text-light)', msg: null },
  Cancelled: {
    bg: 'var(--danger-bg)',
    color: 'var(--danger-text)',
    dot: 'var(--danger-text)',
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
            color: 'var(--text)',
            marginBottom: 4,
          }}
        >
          My Orders
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Track your current and past orders.
        </p>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 24,
          background: 'var(--bg-input)',
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
                background: tab === t ? 'var(--bg-card)' : 'transparent',
                color: tab === t ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: tab === t ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'Poppins',
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t}
              {t !== 'All' && (
                <span
                  style={{
                    marginLeft: 6,
                    background: tab === t ? 'var(--primary)' : 'var(--border)',
                    color: tab === t ? '#fff' : 'var(--text-muted)',
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
            background: 'var(--bg-card)',
            borderRadius: 20,
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 6,
            }}
          >
            No orders here
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>
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
                background: 'var(--bg-card)',
                borderRadius: 16,
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
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
                        background: 'var(--success-bg)',
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
                            color: 'var(--text)',
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
                      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
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
                        color: 'var(--secondary)',
                      }}
                    >
                      Rs. {order.total}
                    </span>
                    <span
                      style={{
                        fontSize: 18,
                        color: 'var(--text-light)',
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
                    borderTop: '1px solid var(--border)',
                    padding: '16px 22px',
                    background: 'var(--bg-hover)',
                  }}
                >
                  {/* Items */}
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--text-light)',
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
                        color: 'var(--text-secondary)',
                        padding: '6px 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <span>
                        {it.name}{' '}
                        <span style={{ color: 'var(--text-light)' }}>× {it.qty}</span>
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--text)' }}>
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
                      borderTop: '1.5px dashed var(--border)',
                      fontSize: 15,
                      fontWeight: 800,
                      color: 'var(--text)',
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: 'var(--secondary)' }}>Rs. {order.total}</span>
                  </div>

                  {/* Payment method */}
                  <div
                    style={{
                      marginTop: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>💵</span>
                    <span>
                      Payment:{' '}
                      <strong style={{ color: 'var(--text)' }}>
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
                        background: 'var(--primary)',
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

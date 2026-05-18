import { useState } from 'react'

// ─── Mock Data ────────────────────────────────────────────────
const INIT_ORDERS = [
  {
    id: '#ORD-001',
    student: 'Kasun Perera',
    phone: '077-111-2222',
    items: [{ name: 'Rice & Curry', qty: 2, price: 190 }],
    time: '10:02 AM',
    status: 'Pending',
    note: 'Less spicy please',
  },
  {
    id: '#ORD-002',
    student: 'Nimali Silva',
    phone: '071-333-4444',
    items: [
      { name: 'Kottu', qty: 1, price: 250 },
      { name: 'Fresh Juice', qty: 1, price: 60 },
    ],
    time: '10:08 AM',
    status: 'Preparing',
    note: '',
  },
  {
    id: '#ORD-003',
    student: 'Ashan Fernando',
    phone: '076-555-6666',
    items: [{ name: 'Short Eats', qty: 4, price: 40 }],
    time: '10:14 AM',
    status: 'Ready',
    note: 'Extra sauce!',
  },
  {
    id: '#ORD-004',
    student: 'Dinusha Ranasinghe',
    phone: '070-777-8888',
    items: [{ name: 'Fried Rice', qty: 1, price: 220 }],
    time: '9:45 AM',
    status: 'Completed',
    note: '',
  },
  {
    id: '#ORD-005',
    student: 'Chamara Bandara',
    phone: '078-999-0000',
    items: [
      { name: 'Noodles', qty: 1, price: 180 },
      { name: 'Water', qty: 2, price: 30 },
    ],
    time: '9:30 AM',
    status: 'Cancelled',
    note: '',
  },
]

// ─── Status config ─────────────────────────────────────────────
const STATUS_STYLE = {
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Preparing: { bg: 'var(--info-bg)', color: 'var(--info-text)' },
  Ready: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Completed: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  Cancelled: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

// Status flow: what button label shows and what status it moves to
const NEXT_ACTION = {
  Pending: { label: '✅ Confirm', next: 'Preparing' },
  Preparing: { label: '🍳 Mark Ready', next: 'Ready' },
  Ready: { label: '🏁 Completed', next: 'Completed' },
}

const TABS = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled']

// ─── Reject Modal ─────────────────────────────────────────────
function RejectModal({ order, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        fontFamily: 'Poppins',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 18,
          padding: 28,
          width: '100%',
          maxWidth: 400,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 8,
          }}
        >
          Cancel Order {order.id}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          Please provide a reason. The student will be notified.
        </p>
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            marginBottom: 6,
          }}
        >
          Reason
        </label>
        <textarea
          style={{
            width: '100%',
            height: 90,
            border: '1.5px solid var(--border)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 14,
            fontFamily: 'Poppins',
            outline: 'none',
            resize: 'none',
            background: 'var(--bg-input)',
            color: 'var(--text)',
            boxSizing: 'border-box',
            marginBottom: 20,
          }}
          placeholder="e.g. Item is out of stock..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 44,
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Poppins',
            }}
          >
            Keep Order
          </button>
          <button
            onClick={() => onConfirm(order.id, reason || 'Cancelled by seller')}
            style={{
              flex: 1,
              height: 44,
              background: 'var(--danger-text)',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Poppins',
            }}
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Order Detail Expand ──────────────────────────────────────
function OrderDetail({ order, total }) {
  return (
    <div
      style={{
        borderTop: '1px solid var(--border-light)',
        background: 'var(--bg-hover)',
        padding: '16px 24px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Items breakdown */}
        <div>
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
            Items
          </p>
          {order.items.map((it) => (
            <div
              key={it.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                color: 'var(--text-secondary)',
                padding: '6px 0',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <span>
                {it.name} <span style={{ color: 'var(--text-light)' }}>× {it.qty}</span>
              </span>
              <span style={{ fontWeight: 600 }}>Rs. {it.price * it.qty}</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
              paddingTop: 8,
              borderTop: '1.5px dashed var(--border)',
              fontSize: 14,
              fontWeight: 800,
              color: 'var(--secondary)',
            }}
          >
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
        </div>

        {/* Customer info + note */}
        <div>
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
            Customer Info
          </p>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
            👤 <strong>{order.student}</strong>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            📞 {order.phone}
          </div>
          {order.note ? (
            <div
              style={{
                background: 'var(--warning-bg)',
                borderRadius: 9,
                padding: '10px 12px',
                fontSize: 13,
                color: 'var(--warning-text)',
              }}
            >
              📝 <strong>Note:</strong> {order.note}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>
              No special note
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export default function SellerOrders() {
  const [orders, setOrders] = useState(INIT_ORDERS)
  const [tab, setTab] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)

  // ── Status update ──────────────────────────────────────────
  const moveNext = (id) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const action = NEXT_ACTION[o.status]
        return action ? { ...o, status: action.next } : o
      }),
    )
  }

  const cancelOrder = (id, reason) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: 'Cancelled', cancelReason: reason } : o,
      ),
    )
    setRejectTarget(null)
  }

  // ── Filter ─────────────────────────────────────────────────
  const visible =
    tab === 'All' ? orders : orders.filter((o) => o.status === tab)

  const countOf = (s) =>
    s === 'All' ? orders.length : orders.filter((o) => o.status === s).length

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
          Orders
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Manage incoming orders and update status in real-time.
        </p>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        {TABS.map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            style={{
              padding: '7px 16px',
              borderRadius: 9,
              border: 'none',
              background: tab === s ? 'var(--primary)' : 'var(--bg-card)',
              color: tab === s ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'Poppins',
              border: tab === s ? 'none' : '1.5px solid var(--border)',
            }}
          >
            {s}
            <span
              style={{
                marginLeft: 6,
                background: tab === s ? 'rgba(255,255,255,0.3)' : 'var(--bg-hover)',
                color: tab === s ? '#fff' : 'var(--text-muted)',
                padding: '1px 7px',
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {countOf(s)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Empty state ──────────────────────────────────────── */}
      {visible.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-light)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 6,
            }}
          >
            All clear!
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>
            No {tab === 'All' ? '' : tab.toLowerCase()} orders right now.
          </p>
        </div>
      )}

      {/* ── Orders Table ─────────────────────────────────────── */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', fontSize: 13 }}>Order</th>
              <th style={{ padding: '12px 16px', fontSize: 13 }}>Student</th>
              <th style={{ padding: '12px 16px', fontSize: 13 }}>Items</th>
              <th style={{ padding: '12px 16px', fontSize: 13, textAlign: 'right' }}>Total</th>
              <th style={{ padding: '12px 16px', fontSize: 13 }}>Time</th>
              <th style={{ padding: '12px 16px', fontSize: 13 }}>Status</th>
              <th style={{ padding: '12px 16px', fontSize: 13, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((order) => {
              const total = order.items.reduce((s, it) => s + it.price * it.qty, 0)
              const action = NEXT_ACTION[order.status]
              const isOpen = expanded === order.id
              const canReject = ['Pending', 'Preparing'].includes(order.status)

              return (
                <>
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid var(--border-light)' }}
                  >
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text)' }}>{order.id}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{order.time}</div>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{order.student}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.phone}</div>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {order.items.map((it) => (
                          <div key={it.name}>
                            {it.name} × {it.qty} <span style={{ fontWeight: 700, marginLeft: 6 }}>Rs. {it.price * it.qty}</span>
                          </div>
                        ))}
                        {order.note && <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 6 }}>📝 {order.note}</div>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right', fontWeight: 800 }}>
                      Rs. {total}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>{order.time}</td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 8, fontWeight: 700, fontSize: 12, ...STATUS_STYLE[order.status] }}>{order.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        {action && (
                          <button onClick={() => moveNext(order.id)} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{action.label}</button>
                        )}
                        {canReject && (
                          <button onClick={() => setRejectTarget(order)} style={{ padding: '8px 10px', borderRadius: 8, border: '1.5px solid var(--danger-text)', background: 'var(--bg-card)', color: 'var(--danger-text)', fontWeight: 700, cursor: 'pointer' }}>✕</button>
                        )}
                        {order.status === 'Completed' && <span style={{ fontSize: 18 }}>✅</span>}
                        <button onClick={() => setExpanded(isOpen ? null : order.id)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', cursor: 'pointer' }}>{isOpen ? '▴' : '▾'}</button>
                      </div>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr>
                      <td colSpan={7} style={{ padding: 0 }}>
                        <OrderDetail order={order} total={total} />
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Reject Modal ─────────────────────────────────────── */}
      {rejectTarget && (
        <RejectModal
          order={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={cancelOrder}
        />
      )}
    </div>
  )
}

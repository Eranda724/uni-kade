const STATS = [
  { label: 'Total Sellers', value: '48', sub: '3 pending approval', icon: '🏪', accent: 'var(--success-text)', bg: 'var(--success-bg)' },
  { label: 'Total Students', value: '1,240', sub: '+18 this week', icon: '🎓', accent: 'var(--info-text)', bg: 'var(--info-bg)' },
  { label: 'Orders Today', value: '312', sub: 'Across all shops', icon: '📦', accent: 'var(--primary)', bg: 'var(--warning-bg)' },
  { label: 'Platform Revenue', value: 'Rs. 82,400', sub: 'This month', icon: '💰', accent: 'var(--secondary)', bg: 'var(--bg-hover)' },
]

const PENDING_SELLERS = [
  { id: 1, name: 'Kasun Perera', shop: "Deli Corner", university: 'University of Moratuwa', category: 'Food', applied: '2 hours ago' },
  { id: 2, name: 'Nimali Silva', shop: 'Print Zone', university: 'SLIIT', category: 'Printing', applied: '5 hours ago' },
  { id: 3, name: 'Ashan Fernando', shop: "Book Barn", university: 'University of Kelaniya', category: 'Stationery', applied: '1 day ago' },
]

const RECENT_ORDERS = [
  { id: '#ORD-312', student: 'Thisara N.', shop: "Mama's Kitchen", total: 'Rs. 380', status: 'Preparing', time: '5 min ago' },
  { id: '#ORD-311', student: 'Ravindu M.', shop: 'Quick Bites', total: 'Rs. 250', status: 'Delivered', time: '11 min ago' },
  { id: '#ORD-310', student: 'Sanduni P.', shop: 'Campus Prints', total: 'Rs. 200', status: 'Ready', time: '18 min ago' },
  { id: '#ORD-309', student: 'Charith K.', shop: 'NoteHub', total: 'Rs. 535', status: 'Delivered', time: '22 min ago' },
]

const STATUS_STYLE = {
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Preparing: { bg: 'var(--info-bg)', color: 'var(--info-text)' },
  Ready: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Delivered: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
}

export default function AdminDashboard() {
  return (
    <div style={{ padding: 32, fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
          Admin Dashboard ⚡
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Platform overview and pending actions.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 36 }}>
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 16,
              padding: '22px 20px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                marginBottom: 14,
              }}
            >
              {s.icon}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 3 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.accent }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Pending Approvals */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
              🕐 Pending Approvals
            </h2>
            <span
              style={{
                background: 'var(--warning-bg)',
                color: 'var(--warning-text)',
                padding: '3px 10px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {PENDING_SELLERS.length} waiting
            </span>
          </div>
          {PENDING_SELLERS.map((s, i) => (
            <div
              key={s.id}
              style={{
                padding: '16px 22px',
                borderBottom: i < PENDING_SELLERS.length - 1 ? '1px solid var(--border-light)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--secondary), #2d8a57)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {s.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{s.shop}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {s.name} · {s.university}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 1 }}>{s.applied}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'var(--success-bg)',
                    color: 'var(--success-text)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                  }}
                >
                  ✓ Approve
                </button>
                <button
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'var(--danger-bg)',
                    color: 'var(--danger-text)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                  }}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>📦 Recent Orders</h2>
            <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
              View All →
            </span>
          </div>
          {RECENT_ORDERS.map((order, i) => (
            <div
              key={order.id}
              style={{
                padding: '14px 22px',
                borderBottom: i < RECENT_ORDERS.length - 1 ? '1px solid var(--border-light)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{order.id}</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      ...STATUS_STYLE[order.status],
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {order.student} · {order.shop}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--secondary)' }}>{order.total}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{order.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

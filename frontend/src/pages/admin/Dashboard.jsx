const STATS = [
  { label: 'Total Sellers', value: '48', sub: '3 pending approval', icon: '🏪', accent: '#1a5c3a', bg: '#e8f5e9' },
  { label: 'Total Students', value: '1,240', sub: '+18 this week', icon: '🎓', accent: '#3b82f6', bg: '#eff6ff' },
  { label: 'Orders Today', value: '312', sub: 'Across all shops', icon: '📦', accent: '#f5a623', bg: '#fff3e0' },
  { label: 'Platform Revenue', value: 'Rs. 82,400', sub: 'This month', icon: '💰', accent: '#8b5cf6', bg: '#f5f3ff' },
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
  Pending: { bg: '#fff3e0', color: '#e65c00' },
  Preparing: { bg: '#eff6ff', color: '#2563eb' },
  Ready: { bg: '#e8f5e9', color: '#16a34a' },
  Delivered: { bg: '#F3F4F6', color: '#6B7280' },
}

export default function AdminDashboard() {
  return (
    <div style={{ padding: 32, fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
          Admin Dashboard ⚡
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>
          Platform overview and pending actions.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 36 }}>
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '22px 20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              border: '1px solid #F3F4F6',
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
            <div style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginBottom: 3 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.accent }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Pending Approvals */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #F3F4F6',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>
              🕐 Pending Approvals
            </h2>
            <span
              style={{
                background: '#fff3e0',
                color: '#e65c00',
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
                borderBottom: i < PENDING_SELLERS.length - 1 ? '1px solid #F3F4F6' : 'none',
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
                  background: 'linear-gradient(135deg,#1a5c3a,#2d8a57)',
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
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>{s.shop}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>
                  {s.name} · {s.university}
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{s.applied}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#e8f5e9',
                    color: '#16a34a',
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
                    background: '#fee2e2',
                    color: '#dc2626',
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
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #F3F4F6',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>📦 Recent Orders</h2>
            <span style={{ fontSize: 13, color: '#f5a623', fontWeight: 600, cursor: 'pointer' }}>
              View All →
            </span>
          </div>
          {RECENT_ORDERS.map((order, i) => (
            <div
              key={order.id}
              style={{
                padding: '14px 22px',
                borderBottom: i < RECENT_ORDERS.length - 1 ? '1px solid #F3F4F6' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>{order.id}</span>
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
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                  {order.student} · {order.shop}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a5c3a' }}>{order.total}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{order.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

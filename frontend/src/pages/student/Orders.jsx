const MOCK_ORDERS = [
  {
    id: '#ORD-101',
    shop: "Mama's Kitchen",
    items: [{ name: 'Rice & Curry', qty: 2, price: 190 }],
    date: 'Today, 10:15 AM',
    status: 'Preparing',
    total: 380,
  },
  {
    id: '#ORD-098',
    shop: 'NoteHub',
    items: [{ name: 'A4 Paper (500)', qty: 1, price: 450 }, { name: 'Ballpoint Pen x5', qty: 1, price: 85 }],
    date: 'Yesterday, 2:30 PM',
    status: 'Delivered',
    total: 535,
  },
  {
    id: '#ORD-091',
    shop: 'Campus Prints',
    items: [{ name: 'Color Print A4', qty: 8, price: 25 }],
    date: 'Apr 10, 11:00 AM',
    status: 'Delivered',
    total: 200,
  },
  {
    id: '#ORD-085',
    shop: 'Quick Bites',
    items: [{ name: 'Kottu Roti', qty: 1, price: 250 }, { name: 'Fresh Juice', qty: 1, price: 60 }],
    date: 'Apr 8, 12:45 PM',
    status: 'Delivered',
    total: 310,
  },
]

const STATUS_STYLE = {
  Pending: { bg: '#fff3e0', color: '#e65c00' },
  Preparing: { bg: '#eff6ff', color: '#2563eb' },
  Ready: { bg: '#e8f5e9', color: '#16a34a' },
  Delivered: { bg: '#F3F4F6', color: '#6B7280' },
}

export default function StudentOrders() {
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
          My Orders
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>Track your current and past orders.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MOCK_ORDERS.map((order) => (
          <div
            key={order.id}
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #F3F4F6',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              padding: '20px 24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#1F2937' }}>{order.id}</span>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      ...STATUS_STYLE[order.status],
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
                  🏪 {order.shop} &middot; {order.date}
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1a5c3a' }}>
                Rs. {order.total}
              </div>
            </div>

            <div
              style={{
                background: '#F8F9FC',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              {order.items.map((it) => (
                <div
                  key={it.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color: '#374151',
                    padding: '4px 0',
                  }}
                >
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <span style={{ fontWeight: 600, color: '#1F2937' }}>Rs. {it.price * it.qty}</span>
                </div>
              ))}
            </div>

            {order.status !== 'Delivered' && (
              <div
                style={{
                  marginTop: 14,
                  background: '#eff6ff',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  color: '#2563eb',
                  fontWeight: 600,
                }}
              >
                ⏳ Your order is being {order.status === 'Preparing' ? 'prepared' : 'processed'}. Please wait for pickup notification.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

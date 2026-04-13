import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const MOCK_STATS = [
  { label: "Today's Revenue", value: 'Rs. 3,840', sub: '+12% from yesterday', icon: '💰', accent: '#1a5c3a', bg: '#e8f5e9' },
  { label: 'Orders Today', value: '24', sub: '6 pending now', icon: '📦', accent: '#f5a623', bg: '#fff3e0' },
  { label: 'Total Products', value: '18', sub: '3 out of stock', icon: '🛍️', accent: '#3b82f6', bg: '#eff6ff' },
  { label: 'Rating', value: '4.8 ⭐', sub: 'Based on 120 reviews', icon: '⭐', accent: '#8b5cf6', bg: '#f5f3ff' },
]

const MOCK_ORDERS = [
  { id: '#ORD-001', student: 'Kasun Perera', items: 'Rice & Curry × 2', total: 'Rs. 380', status: 'Pending', time: '2 min ago' },
  { id: '#ORD-002', student: 'Nimali Silva', items: 'Kottu × 1, Juice × 1', total: 'Rs. 290', status: 'Preparing', time: '8 min ago' },
  { id: '#ORD-003', student: 'Ashan Fernando', items: 'Short Eats × 4', total: 'Rs. 160', status: 'Ready', time: '15 min ago' },
  { id: '#ORD-004', student: 'Dinusha Ranasinghe', items: 'Fried Rice × 1', total: 'Rs. 220', status: 'Delivered', time: '32 min ago' },
]

const STATUS_COLORS = {
  Pending: { bg: '#fff3e0', color: '#e65c00' },
  Preparing: { bg: '#eff6ff', color: '#2563eb' },
  Ready: { bg: '#e8f5e9', color: '#16a34a' },
  Delivered: { bg: '#F3F4F6', color: '#6B7280' },
}

export default function SellerDashboard() {
  const { user } = useAuth()

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
          Good morning, {user?.name?.split(' ')[0] || 'Seller'} 👋
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>
          Here's what's happening at your shop today.
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginBottom: 36,
        }}
      >
        {MOCK_STATS.map((s) => (
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
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
                }}
              >
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: s.accent, fontWeight: 600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders table */}
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
            padding: '20px 24px',
            borderBottom: '1px solid #F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>Recent Orders</h2>
          <span style={{ fontSize: 13, color: '#f5a623', fontWeight: 600, cursor: 'pointer' }}>
            View All →
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FC' }}>
              {['Order', 'Student', 'Items', 'Total', 'Status', 'Time'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 24px',
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
            {MOCK_ORDERS.map((order, i) => (
              <tr
                key={order.id}
                style={{
                  borderTop: '1px solid #F3F4F6',
                  background: i % 2 === 0 ? '#fff' : '#fafafa',
                }}
              >
                <td style={{ padding: '14px 24px', fontSize: 13, fontWeight: 700, color: '#1F2937' }}>
                  {order.id}
                </td>
                <td style={{ padding: '14px 24px', fontSize: 13, color: '#374151' }}>
                  {order.student}
                </td>
                <td style={{ padding: '14px 24px', fontSize: 13, color: '#6B7280' }}>
                  {order.items}
                </td>
                <td style={{ padding: '14px 24px', fontSize: 13, fontWeight: 700, color: '#1a5c3a' }}>
                  {order.total}
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      ...STATUS_COLORS[order.status],
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '14px 24px', fontSize: 12, color: '#9CA3AF' }}>
                  {order.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

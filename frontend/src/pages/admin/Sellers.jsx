import { useState } from 'react'

const INIT_SELLERS = [
  { id: 1, name: 'Kasun Perera', shop: "Mama's Kitchen", university: 'University of Moratuwa', category: 'Food', orders: 142, status: 'Active', joined: 'Jan 2025' },
  { id: 2, name: 'Nimali Silva', shop: 'Campus Prints', university: 'SLIIT', category: 'Printing', orders: 98, status: 'Active', joined: 'Feb 2025' },
  { id: 3, name: 'Ashan Fernando', shop: 'NoteHub', university: 'University of Kelaniya', category: 'Stationery', orders: 203, status: 'Active', joined: 'Nov 2024' },
  { id: 4, name: 'Dinusha Ranasinghe', shop: 'Quick Bites', university: 'University of Moratuwa', category: 'Food', orders: 115, status: 'Pending', joined: 'Apr 2025' },
  { id: 5, name: 'Tharanga Wijesinghe', shop: 'Lab Mart', university: 'University of Peradeniya', category: 'Lab Equipment', orders: 67, status: 'Suspended', joined: 'Dec 2024' },
  { id: 6, name: 'Chathurika Jayawardena', shop: 'Print Zone', university: 'NSBM Green University', category: 'Printing', orders: 0, status: 'Pending', joined: 'Apr 2025' },
]

const STATUS_STYLE = {
  Active: { bg: '#e8f5e9', color: '#16a34a' },
  Pending: { bg: '#fff3e0', color: '#e65c00' },
  Suspended: { bg: '#fee2e2', color: '#dc2626' },
}

const FILTER_TABS = ['All', 'Active', 'Pending', 'Suspended']

export default function AdminSellers() {
  const [sellers, setSellers] = useState(INIT_SELLERS)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const updateStatus = (id, newStatus) =>
    setSellers((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)))

  const displayed = sellers.filter(
    (s) =>
      (filter === 'All' || s.status === filter) &&
      (s.shop.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ padding: 32, fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>Sellers</h1>
          <p style={{ fontSize: 14, color: '#6B7280' }}>
            {sellers.filter((s) => s.status === 'Active').length} active ·{' '}
            {sellers.filter((s) => s.status === 'Pending').length} pending ·{' '}
            {sellers.filter((s) => s.status === 'Suspended').length} suspended
          </p>
        </div>
      </div>

      {/* Filters + search */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '7px 16px',
                borderRadius: 9,
                border: filter === t ? 'none' : '1.5px solid #E5E7EB',
                background: filter === t ? '#f5a623' : '#fff',
                color: filter === t ? '#fff' : '#6B7280',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins',
              }}
            >
              {t}
              <span
                style={{
                  marginLeft: 6,
                  background: filter === t ? 'rgba(255,255,255,0.3)' : '#F3F4F6',
                  color: filter === t ? '#fff' : '#6B7280',
                  padding: '1px 7px',
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {t === 'All' ? sellers.length : sellers.filter((s) => s.status === t).length}
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
            width: 230,
          }}
          placeholder="🔍  Search sellers..."
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
              {['Seller', 'Shop', 'University', 'Category', 'Orders', 'Joined', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 20px',
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
            {displayed.map((s, i) => (
              <tr
                key={s.id}
                style={{ borderTop: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}
              >
                {/* Seller */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg,#1a5c3a,#2d8a57)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      {s.name[0]}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#1F2937' }}>
                  {s.shop}
                </td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#6B7280' }}>{s.university}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#374151' }}>{s.category}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#1a5c3a' }}>
                  {s.orders}
                </td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#6B7280' }}>{s.joined}</td>
                {/* Status */}
                <td style={{ padding: '14px 20px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      ...STATUS_STYLE[s.status],
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                {/* Actions */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {s.status === 'Pending' && (
                      <button
                        onClick={() => updateStatus(s.id, 'Active')}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          border: 'none',
                          background: '#e8f5e9',
                          color: '#16a34a',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'Poppins',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ✓ Approve
                      </button>
                    )}
                    {s.status === 'Active' && (
                      <button
                        onClick={() => updateStatus(s.id, 'Suspended')}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          border: 'none',
                          background: '#fee2e2',
                          color: '#dc2626',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'Poppins',
                        }}
                      >
                        Suspend
                      </button>
                    )}
                    {s.status === 'Suspended' && (
                      <button
                        onClick={() => updateStatus(s.id, 'Active')}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          border: 'none',
                          background: '#e8f5e9',
                          color: '#16a34a',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'Poppins',
                        }}
                      >
                        Restore
                      </button>
                    )}
                    {s.status === 'Pending' && (
                      <button
                        onClick={() => setSellers((prev) => prev.filter((x) => x.id !== s.id))}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 7,
                          border: 'none',
                          background: '#F3F4F6',
                          color: '#6B7280',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'Poppins',
                        }}
                      >
                        ✕ Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayed.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF', fontSize: 14 }}>
            No sellers found
          </div>
        )}
      </div>
    </div>
  )
}

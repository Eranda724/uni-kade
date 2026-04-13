import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MOCK_SHOPS = [
  { id: 1, name: "Mama's Kitchen", category: 'Food', university: 'University of Moratuwa', rating: 4.8, products: 12, icon: '🍱' },
  { id: 2, name: 'Campus Prints', category: 'Printing', university: 'University of Moratuwa', rating: 4.6, products: 8, icon: '🖨️' },
  { id: 3, name: 'NoteHub', category: 'Stationery', university: 'University of Moratuwa', rating: 4.5, products: 24, icon: '📚' },
  { id: 4, name: 'Quick Bites', category: 'Food', university: 'University of Moratuwa', rating: 4.7, products: 9, icon: '🥗' },
  { id: 5, name: 'Lab Mart', category: 'Lab Equipment', university: 'University of Moratuwa', rating: 4.3, products: 31, icon: '🔬' },
]

const MOCK_FEATURED = [
  { id: 1, name: 'Rice & Curry', shop: "Mama's Kitchen", price: 190, icon: '🍛' },
  { id: 2, name: 'A4 Paper (500 sheets)', shop: 'NoteHub', price: 450, icon: '📄' },
  { id: 3, name: 'Color Print (A4)', shop: 'Campus Prints', price: 25, icon: '🖨️' },
  { id: 4, name: 'Kottu Roti', shop: 'Quick Bites', price: 250, icon: '🥘' },
]

const CATEGORIES = ['All', 'Food', 'Stationery', 'Printing', 'Lab Equipment']

export default function StudentHome() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')

  const filtered = MOCK_SHOPS.filter(
    (s) =>
      (catFilter === 'All' || s.category === catFilter) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Welcome banner */}
      <div
        style={{
          background: 'linear-gradient(135deg,#1a5c3a,#2d8a57)',
          borderRadius: 20,
          padding: '28px 32px',
          marginBottom: 32,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>
            🎓 {user?.university || 'Your Campus'}
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            Hey {user?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85 }}>
            Browse shops and order from your campus canteen.
          </p>
        </div>
        <div style={{ fontSize: 64 }}>🍱</div>
      </div>

      {/* Search + Category filter */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={{
            height: 44,
            border: '1.5px solid #E5E7EB',
            borderRadius: 12,
            padding: '0 16px',
            fontSize: 14,
            fontFamily: 'Poppins',
            outline: 'none',
            background: '#fff',
            color: '#1F2937',
            width: 260,
          }}
          placeholder="🔍  Search shops or items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              style={{
                padding: '7px 14px',
                borderRadius: 9,
                border: catFilter === c ? 'none' : '1.5px solid #E5E7EB',
                background: catFilter === c ? '#f5a623' : '#fff',
                color: catFilter === c ? '#fff' : '#6B7280',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Items */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', marginBottom: 16 }}>
          ✨ Popular Right Now
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {MOCK_FEATURED.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: '20px 18px',
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', marginBottom: 3 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>{item.shop}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#1a5c3a' }}>Rs. {item.price}</span>
                <button
                  style={{
                    background: '#f5a623',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    padding: '5px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                  }}
                >
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shops */}
      <section>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', marginBottom: 16 }}>
          🏪 Campus Shops
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map((shop) => (
            <div
              key={shop.id}
              style={{
                background: '#fff',
                borderRadius: 18,
                padding: '24px 20px',
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: '#e8f5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    flexShrink: 0,
                  }}
                >
                  {shop.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1F2937' }}>{shop.name}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{shop.category}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>{shop.products} products</span>
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
                  ⭐ {shop.rating}
                </span>
              </div>
              <button
                style={{
                  marginTop: 14,
                  width: '100%',
                  height: 38,
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
                View Shop →
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF', fontSize: 15 }}>
            No shops found 🔍
          </div>
        )}
      </section>
    </div>
  )
}

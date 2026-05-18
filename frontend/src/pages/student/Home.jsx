import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/useCart.jsx'
import API from '../../services/api'

const CATEGORIES = ['All', 'Food', 'Stationery', 'Printing', 'Lab Equipment', 'Other']

// ─── Helpers ──────────────────────────────────────────────────
const S = {
  card: {
    background: 'var(--bg-card)',
    borderRadius: 18,
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: (bg, color) => ({
    background: bg,
    color,
    padding: '3px 10px',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 700,
  }),
}

function lift(e) {
  e.currentTarget.style.transform = 'translateY(-4px)'
  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
}
function drop(e) {
  e.currentTarget.style.transform = 'translateY(0)'
  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
}

// ─── Category icon map ────────────────────────────────────────
function shopIcon(category) {
  const map = {
    Food: '🍱',
    Printing: '🖨️',
    Stationery: '📚',
    'Lab Equipment': '🔬',
    Drinks: '🥤',
    Other: '🏪',
  }
  return map[category] || '🏪'
}

// ─── Component ────────────────────────────────────────────────
export default function StudentHome() {
  const { user } = useAuth()
  const { cartCount, addItem } = useCart()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [shops, setShops] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const shopsRes = await API.get('/users/shops')
        setShops(shopsRes.data)

        // Load featured products: get first 4 active products across all shops
        if (shopsRes.data.length > 0) {
          const firstShopId = shopsRes.data[0]._id
          try {
            const prodRes = await API.get(`/products/shop/${firstShopId}`)
            setFeaturedProducts(prodRes.data.slice(0, 4).map(p => ({
              ...p,
              shopId: firstShopId,
              shop: shopsRes.data[0].shopName || shopsRes.data[0].name,
            })))
          } catch {
            // Featured products unavailable — just show empty
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shops')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = shops.filter(
    (s) =>
      (catFilter === 'All' || s.category === catFilter) &&
      (s.shopName || s.name || '').toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading shops...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <p style={{ color: 'var(--danger-text)', fontSize: 14 }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 16, background: 'var(--primary)', border: 'none', borderRadius: 10,
            color: '#fff', padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* ── Welcome Banner ──────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--secondary), #2d8a57)',
          borderRadius: 20,
          padding: '28px 32px',
          marginBottom: 28,
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
            {shops.length} shop{shops.length !== 1 ? 's' : ''} available on your campus.
          </p>
        </div>

        {/* Cart bubble */}
        <div
          onClick={() => navigate('/student/cart')}
          style={{
            position: 'relative',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 16,
            padding: '14px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 32 }}>🛒</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>
            {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'Cart'}
          </span>
          {cartCount > 0 && (
            <div
              style={{
                position: 'absolute', top: -6, right: -6,
                width: 22, height: 22, borderRadius: '50%',
                background: 'var(--primary)', color: '#fff',
                fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {cartCount}
            </div>
          )}
        </div>
      </div>

      {/* ── Search + Filter ─────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>
            🔍
          </span>
          <input
            style={{
              height: 44, border: '1.5px solid var(--border)', borderRadius: 12,
              padding: '0 16px 0 40px', fontSize: 14, fontFamily: 'Poppins',
              outline: 'none', background: 'var(--bg-card)', color: 'var(--text)', width: 260,
            }}
            placeholder="Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              style={{
                padding: '7px 16px', borderRadius: 9,
                border: catFilter === c ? 'none' : '1.5px solid var(--border)',
                background: catFilter === c ? 'var(--primary)' : 'var(--bg-card)',
                color: catFilter === c ? '#fff' : 'var(--text-muted)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Featured Items ───────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>✨ Popular Right Now</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {featuredProducts.map((item) => (
              <div
                key={item._id}
                style={{ ...S.card, padding: '20px 18px' }}
                onMouseEnter={lift}
                onMouseLeave={drop}
              >
                <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 10 }}>📦</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{item.shop}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--secondary)' }}>
                    Rs. {item.price}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    style={{
                      background: 'var(--primary)', border: 'none', borderRadius: 8,
                      color: '#fff', padding: '5px 12px', fontSize: 12,
                      fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins',
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Campus Shops ────────────────────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
            🏪 Campus Shops
            <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-light)' }}>
              ({filtered.length})
            </span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>No shops found</p>
            <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 20 }}>
              Try a different search or category filter.
            </p>
            <button
              onClick={() => { setSearch(''); setCatFilter('All') }}
              style={{
                background: 'var(--primary)', border: 'none', borderRadius: 10,
                color: '#fff', padding: '10px 24px', fontSize: 14,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins',
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {filtered.map((shop) => {
              const name = shop.shopName || shop.name || 'Unknown Shop'
              const isOpen = shop.isOpen !== false
              return (
                <div
                  key={shop._id}
                  style={{ ...S.card, padding: '24px 20px' }}
                  onMouseEnter={lift}
                  onMouseLeave={drop}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: 'var(--success-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 26, flexShrink: 0,
                    }}>
                      {shopIcon(shop.category)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 15, fontWeight: 800, color: 'var(--text)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{shop.category}</div>
                    </div>
                    <span style={S.badge(
                      isOpen ? 'var(--success-bg)' : 'var(--border-light)',
                      isOpen ? 'var(--success-text)' : 'var(--text-light)',
                    )}>
                      {isOpen ? '● Open' : '○ Closed'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {shop.productCount ?? 0} products
                    </span>
                    {shop.university && (
                      <span style={{ fontSize: 11, color: 'var(--text-light)' }}>🎓 {shop.university}</span>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/student/shop/${shop._id}`)}
                    disabled={!isOpen}
                    style={{
                      width: '100%', height: 38,
                      background: isOpen ? 'var(--primary)' : 'var(--border)',
                      border: 'none', borderRadius: 10,
                      color: isOpen ? '#fff' : 'var(--text-light)',
                      fontSize: 13, fontWeight: 700,
                      cursor: isOpen ? 'pointer' : 'not-allowed',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {isOpen ? 'View Shop →' : 'Currently Closed'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../services/api'

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

export default function ShopProducts() {
  const { shopId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([]) // { id, name, price, qty }

  // Derived
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id)
      if (found)
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        )
      return [...prev, { ...item, qty: 1 }]
    })
  }

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      try {
        setLoading(true)
        // Fetch shop info (we don't have a direct API for shop, so we'll get it from the first product's seller or we can fetch user)
        // For simplicity, we'll fetch the seller info to get shop details
        const userResponse = await API.get(`/users/${shopId}`)
        const shopUser = userResponse.data

        // Fetch products for the shop
        const productsResponse = await API.get(`/products/shop/${shopId}`)
        const shopProducts = productsResponse.data

        setShop({
          id: shopUser._id,
          name: shopUser.shopName || shopUser.name,
          category: shopUser.category,
          university: shopUser.university,
          rating: 4.5, // We don't have rating in user, maybe we can compute from reviews? For now, mock.
          isOpen: shopUser.status === 'approved', // Assuming status field from user
          icon: '🏪', // We don't have icon, we can map category to icon or use a default
          products: shopProducts.length,
        })
        setProducts(shopProducts)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shop data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (shopId) {
      fetchShopAndProducts()
    }
  }, [shopId])

  if (loading) return <div>Loading shop...</div>
  if (error) return <div>Error: {error}</div>
  if (!shop) return <div>Shop not found</div>

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Back to Home */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate('/student/home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            border: '1.5px solid var(--border)',
            borderRadius: 10,
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Poppins',
          }}
        >
          ← Back to Shops
        </button>
      </div>

      {/* Shop Header */}
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
            🎓 {shop.university || 'Your Campus'}
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            {shop.name}
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85 }}>
            {shop.category} · {shop.products} products
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
            {cartCount > 0
              ? `${cartCount} item${cartCount > 1 ? 's' : ''}`
              : 'Cart'}
          </span>
          {cartCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cartCount}
            </div>
          )}
        </div>
      </div>

      {/* Shop Status Badge */}
      <div style={{ marginBottom: 24 }}>
        <span
          style={S.badge(
            shop.isOpen ? 'var(--success-bg)' : 'var(--border-light)',
            shop.isOpen ? 'var(--success-text)' : 'var(--text-light)',
          )}
        >
          {shop.isOpen ? '● Open' : '○ Closed'}
        </span>
        {!shop.isOpen && (
          <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--text-light)' }}>
            This shop is currently not accepting orders.
          </span>
        )}
      </div>

      {/* Products Grid */}
      <section>
        {products.length === 0 ? (
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
              No products available
            </p>
            {shop.isOpen ? (
              <p style={{ fontSize: 14, color: 'var(--text-light)' }}>
                The shop is open but has no products listed yet.
              </p>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-light)' }}>
                The shop is currently closed.
              </p>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                style={{ ...S.card, padding: '24px 20px' }}
                onMouseEnter={lift}
                onMouseLeave={drop}
              >
                {/* Product Image Placeholder */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    background: 'var(--bg-hover)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                    color: 'var(--text-muted)',
                    fontSize: 30,
                  }}
                >
                  {/* In a real app, we would show the product image here */}
                  📦
                </div>

                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: 'var(--text)',
                    marginBottom: 3,
                  }}
                >
                  {product.name}
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  {product.description || 'No description available'}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    In stock
                  </span>
                  <span
                    style={S.badge('var(--warning-bg)', 'var(--warning-text)')}
                  >
                    Rs. {product.price}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  disabled={!shop.isOpen}
                  style={{
                    width: '100%',
                    height: 38,
                    background: shop.isOpen ? 'var(--primary)' : 'var(--border)',
                    border: 'none',
                    borderRadius: 10,
                    color: shop.isOpen ? '#fff' : 'var(--text-light)',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: shop.isOpen ? 'pointer' : 'not-allowed',
                    fontFamily: 'Poppins',
                  }}
                >
                  {shop.isOpen ? 'Add to Cart' : 'Shop Closed'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
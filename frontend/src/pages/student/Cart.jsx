import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/useCart.jsx'
import API from '../../services/api'

const S = {
  card: {
    background: 'var(--bg-card)',
    borderRadius: 18,
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  badge: (bg, color) => ({
    background: bg, color, padding: '3px 10px',
    borderRadius: 7, fontSize: 12, fontWeight: 700, display: 'inline-block',
  }),
}

function resolveShopName(item) {
  return item.shop || item.shopName || 'Unknown Shop'
}

export default function Cart() {
  const { cart, removeItem, setQty, addItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)

  // Group items by seller (shopId)
  const groups = cart.reduce((acc, item) => {
    const shopLabel = resolveShopName(item)
    if (!acc[shopLabel]) {
      acc[shopLabel] = { shopLabel, items: [] }
    }
    acc[shopLabel].items.push(item)
    return acc
  }, {})

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const total = subtotal

  const handlePay = async () => {
    if (cart.length === 0) return
    setError(null)
    setPlacing(true)

    try {
      // Group cart by seller — create one order per seller
      const bySeller = cart.reduce((acc, item) => {
        const sellerId = item.shopId || item.seller
        if (!acc[sellerId]) acc[sellerId] = []
        acc[sellerId].push(item)
        return acc
      }, {})

      for (const [sellerId, items] of Object.entries(bySeller)) {
        const orderTotal = items.reduce((s, i) => s + i.price * i.qty, 0)
        await API.post('/orders', {
          seller: sellerId,
          items: items.map((i) => ({
            product: i._id,
            name: i.name,
            qty: i.qty,
            price: i.price,
          })),
          total: orderTotal,
          note: '',
        })
      }

      clearCart()
      navigate('/student/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  // ── Empty state ────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
            Your cart is empty
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>
            Browse shops and add items to your cart to get started.
          </p>
          <button
            onClick={() => navigate('/student/home')}
            style={{
              background: 'var(--primary)', border: 'none', borderRadius: 12,
              color: '#fff', padding: '12px 32px', fontSize: 14,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins',
            }}
          >
            Browse Shops
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', border: '1.5px solid var(--border)',
              borderRadius: 10, background: 'var(--bg-card)', color: 'var(--text)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Poppins', marginBottom: 12,
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
            My Cart
            <span style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: 14, marginLeft: 10 }}>
              ({cart.reduce((s, i) => s + i.qty, 0)} item{cart.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''})
            </span>
          </h1>
        </div>
        <button
          onClick={clearCart}
          style={{
            padding: '8px 18px', border: '1.5px solid var(--danger-bg)',
            borderRadius: 10, background: 'var(--danger-bg)',
            color: 'var(--danger-text)', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Poppins',
          }}
        >
          Clear All
        </button>
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-bg)', border: '1px solid var(--danger-text)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          fontSize: 13, color: 'var(--danger-text)', fontWeight: 600,
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* ── Cart Items ──────────────────────────────────────────── */}
        <div style={{ flex: '1 1 480px' }}>
          {Object.values(groups).map((group) => (
            <div key={group.shopLabel} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 24 }}>🏪</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
                  {group.shopLabel}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.items.map((item) => (
                  <div
                    key={item.id || item._id}
                    style={{
                      ...S.card, display: 'flex', alignItems: 'center',
                      padding: '16px 20px', gap: 16,
                    }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: 12,
                      background: 'var(--bg-hover)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, flexShrink: 0,
                    }}>
                      📦
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 15, fontWeight: 700, color: 'var(--text)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                        Rs. {item.price} each
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => setQty(item.id || item._id, item.qty - 1)}
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          border: '1.5px solid var(--border)', background: 'var(--bg-card)',
                          color: 'var(--text-secondary)', fontSize: 18, fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontFamily: 'Poppins', lineHeight: 1,
                        }}
                      >
                        −
                      </button>
                      <span style={{
                        fontSize: 15, fontWeight: 700, color: 'var(--text)',
                        minWidth: 24, textAlign: 'center',
                      }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          border: '1.5px solid var(--border)', background: 'var(--primary)',
                          color: '#fff', fontSize: 16, fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontFamily: 'Poppins', lineHeight: 1,
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Sub-total */}
                    <div style={{
                      fontSize: 15, fontWeight: 800, color: 'var(--text)',
                      minWidth: 72, textAlign: 'right', flexShrink: 0,
                    }}>
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id || item._id)}
                      title="Remove item"
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: 'none',
                        background: 'var(--danger-bg)', color: 'var(--danger-text)',
                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Order Summary ───────────────────────────────────────── */}
        <div style={{ flex: '0 1 340px' }}>
          <div style={{ ...S.card, padding: '28px 24px', position: 'sticky', top: 88 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} item{cart.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''})</span>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border)', marginTop: 4 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, color: 'var(--text)', fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary-dark)' }}>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16, lineHeight: 1.5 }}>
              Payment: Cash on Pickup at the shop.
            </div>

            <button
              onClick={handlePay}
              disabled={placing}
              style={{
                width: '100%', height: 48,
                background: placing ? 'var(--border)' : 'linear-gradient(135deg, var(--secondary), #2d8a57)',
                border: 'none', borderRadius: 12, color: '#fff',
                fontSize: 15, fontWeight: 800, cursor: placing ? 'not-allowed' : 'pointer',
                fontFamily: 'Poppins', transition: 'opacity 0.2s',
              }}
            >
              {placing ? 'Placing Order...' : `Place Order — Rs. ${total.toLocaleString()}`}
            </button>

            <p style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', marginTop: 14 }}>
              Est. preparation: 10–30 min per shop
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

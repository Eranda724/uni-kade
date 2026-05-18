import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../services/api'

// ─── Constants ────────────────────────────────────────────────
const CATEGORIES = [
  'Food',
  'Drinks',
  'Snacks',
  'Stationery',
  'Lab Equipment',
  'Other',
]
const BLANK = {
  name: '',
  category: 'Food',
  price: '',
  description: '',
  prepTime: '',
  image: null,
  imagePreview: null,
}

// ─── Reusable styles ──────────────────────────────────────────
const inpStyle = {
  width: '100%',
  height: 44,
  border: '1.5px solid var(--border)',
  borderRadius: 10,
  padding: '0 14px',
  fontSize: 14,
  fontFamily: 'Poppins',
  outline: 'none',
  marginBottom: 12,
  background: 'var(--bg-input)',
  color: 'var(--text)',
  boxSizing: 'border-box',
}
const labelSt = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 5,
  display: 'block',
}

// ─── Delete Confirm Modal ─────────────────────────────────────
function DeleteModal({ product, onClose, onConfirm }) {
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
          maxWidth: 380,
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 8,
          }}
        >
          Delete "{product.name}"?
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
          This action cannot be undone. The product will be removed from your
          menu.
        </p>
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
            Cancel
          </button>
          <button
            onClick={() => onConfirm(product._id)}
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
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Add / Edit Product Modal ─────────────────────────────────
function ProductModal({ mode, initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => set('imagePreview', reader.result)
    reader.readAsDataURL(file)
    set('image', file)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Product name is required'); return }
    if (!form.price) { setError('Price is required'); return }
    if (Number(form.price) <= 0) { setError('Price must be greater than 0'); return }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        description: form.description,
      }
      let saved
      if (mode === 'add') {
        const res = await API.post('/products', payload)
        saved = res.data
      } else {
        const res = await API.patch(`/products/${initial._id}`, payload)
        saved = res.data
      }
      onSave(saved)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        fontFamily: 'Poppins',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 20,
          padding: 28,
          width: '100%',
          maxWidth: 480,
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
            {mode === 'add' ? '+ Add Product' : '✏️ Edit Product'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-hover)',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: 'pointer',
              fontSize: 16,
              color: 'var(--text-muted)',
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              marginBottom: 14,
              fontWeight: 600,
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* Image upload */}
        <label style={labelSt}>Product Image</label>
        <div
          onClick={() => fileRef.current.click()}
          style={{
            height: 110,
            border: '2px dashed var(--border)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: 14,
            background: form.imagePreview ? 'none' : 'var(--bg-input)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {form.imagePreview ? (
            <img
              src={form.imagePreview}
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-light)' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
              <div style={{ fontSize: 13 }}>Click to upload image</div>
              <div style={{ fontSize: 11 }}>JPG, PNG — max 5MB</div>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImage}
        />

        {/* Name */}
        <label style={labelSt}>Product Name *</label>
        <input
          style={inpStyle}
          placeholder="e.g. Rice & Curry"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
        />

        {/* Category + Price row */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        >
          <div>
            <label style={labelSt}>Category *</label>
            <select
              style={{ ...inpStyle, cursor: 'pointer' }}
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelSt}>Price (Rs.) *</label>
            <input
              style={inpStyle}
              type="number"
              placeholder="e.g. 200"
              min="1"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
            />
          </div>
        </div>

        {/* Prep time (food only) */}
        {['Food', 'Drinks', 'Snacks'].includes(form.category) && (
          <>
            <label style={labelSt}>Preparation Time (minutes)</label>
            <input
              style={inpStyle}
              type="number"
              placeholder="e.g. 10"
              min="0"
              value={form.prepTime}
              onChange={(e) => set('prepTime', e.target.value)}
            />
          </>
        )}

        {/* Description */}
        <label style={labelSt}>Description (optional)</label>
        <textarea
          style={{
            ...inpStyle,
            height: 70,
            padding: '10px 14px',
            resize: 'none',
          }}
          placeholder="Brief description..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 44,
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text-muted)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Poppins',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              flex: 2,
              height: 44,
              background: saving ? 'var(--border)' : 'var(--primary)',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'Poppins',
            }}
          >
            {saving
              ? 'Saving...'
              : mode === 'add'
                ? 'Add Product'
                : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────
export default function SellerProducts() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [delTarget, setDelTarget] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await API.get('/products')
      setProducts(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  // ── Filter ─────────────────────────────────────────────────
  const filtered = products.filter(
    (p) =>
      (catFilter === 'All' || p.category === catFilter) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  )

  // ── Toggle available ────────────────────────────────────────
  const toggleActive = async (id) => {
    const product = products.find(p => p._id === id)
    if (!product) return
    try {
      const res = await API.patch(`/products/${id}`, { active: !product.active })
      setProducts(prev => prev.map(p => p._id === id ? res.data : p))
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  // ── Save (add or edit) ──────────────────────────────────────
  const handleSave = (product) => {
    if (modal?.mode === 'add') {
      setProducts(prev => [product, ...prev])
    } else {
      setProducts(prev => prev.map(p => p._id === product._id ? product : p))
    }
    setModal(null)
  }

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p._id !== id))
      setDelTarget(null)
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const activeCount = products.filter((p) => p.active).length
  const hiddenCount = products.filter((p) => !p.active).length

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 200,
        }}
      >
        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Loading products...
        </span>
      </div>
    )

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 4,
            }}
          >
            Products
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {activeCount} active · {hiddenCount} hidden
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          style={{
            height: 44,
            padding: '0 22px',
            background: 'var(--primary)',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Poppins',
          }}
        >
          + Add Product
        </button>
      </div>

      {/* ── Search + Category filter ─────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            🔍
          </span>
          <input
            style={{
              ...inpStyle,
              paddingLeft: 36,
              width: 240,
              marginBottom: 0,
            }}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins',
                background: catFilter === c ? 'var(--primary)' : 'var(--bg-card)',
                color: catFilter === c ? '#fff' : 'var(--text-muted)',
                border: catFilter === c ? 'none' : '1.5px solid var(--border)',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products Table ───────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 16,
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-input)' }}>
              {[
                'Product',
                'Category',
                'Price',
                'Prep Time',
                'Orders',
                'Status',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 18px',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--text-light)',
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
            {filtered.map((p, i) => (
              <tr
                key={p._id}
                style={{
                  borderTop: '1px solid var(--border-light)',
                  background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-hover)',
                }}
              >
                {/* Product name */}
                <td style={{ padding: '13px 18px' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: 'var(--success-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      🍽
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: 'var(--text)',
                        }}
                      >
                        {p.name}
                      </div>
                      {p.description && (
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--text-light)',
                            maxWidth: 160,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {p.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td
                  style={{
                    padding: '13px 18px',
                    fontSize: 13,
                    color: 'var(--text-muted)',
                  }}
                >
                  {p.category}
                </td>

                {/* Price */}
                <td
                  style={{
                    padding: '13px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--secondary)',
                  }}
                >
                  Rs. {p.price}
                </td>

                {/* Prep time */}
                <td
                  style={{
                    padding: '13px 18px',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {p.prepTime > 0 ? (
                    `${p.prepTime} min`
                  ) : (
                    <span style={{ color: 'var(--border)' }}>—</span>
                  )}
                </td>

                {/* Orders */}
                <td
                  style={{
                    padding: '13px 18px',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {p.ordersCount}
                </td>

                {/* Toggle active */}
                <td style={{ padding: '13px 18px' }}>
                  <button
                    onClick={() => toggleActive(p._id)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      fontFamily: 'Poppins',
                      background: p.active ? 'var(--success-bg)' : 'var(--bg-hover)',
                      color: p.active ? 'var(--success-text)' : 'var(--text-muted)',
                    }}
                  >
                    {p.active ? '● Active' : '○ Hidden'}
                  </button>
                </td>

                {/* Actions */}
                <td style={{ padding: '13px 18px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {/* Edit */}
                    <button
                      onClick={() => setModal({ mode: 'edit', product: p })}
                      title="Edit"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: '1.5px solid var(--border)',
                        background: 'var(--bg-card)',
                        cursor: 'pointer',
                        fontSize: 15,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✏️
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => setDelTarget(p)}
                      title="Delete"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: '1.5px solid var(--danger-text)',
                        background: 'var(--danger-bg)',
                        cursor: 'pointer',
                        fontSize: 15,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div
            style={{
              padding: '50px 20px',
              textAlign: 'center',
              color: 'var(--text-light)',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>🛍️</div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 6,
              }}
            >
              No products found
            </p>
            <p style={{ fontSize: 13 }}>
              {search || catFilter !== 'All'
                ? 'Try a different filter.'
                : 'Add your first product!'}
            </p>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────── */}
      {modal && (
        <ProductModal
          mode={modal.mode}
          initial={modal.mode === 'edit' ? modal.product : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────── */}
      {delTarget && (
        <DeleteModal
          product={delTarget}
          onClose={() => setDelTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

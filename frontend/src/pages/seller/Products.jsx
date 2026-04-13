import { useState } from 'react'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Rice & Curry', category: 'Food', price: 190, stock: 'Available', orders: 142, active: true },
  { id: 2, name: 'Kottu', category: 'Food', price: 250, stock: 'Available', orders: 98, active: true },
  { id: 3, name: 'Short Eats (Pack)', category: 'Food', price: 80, stock: 'Out of Stock', orders: 203, active: false },
  { id: 4, name: 'Fried Rice', category: 'Food', price: 220, stock: 'Available', orders: 115, active: true },
  { id: 5, name: 'Juice (Fresh)', category: 'Drinks', price: 60, stock: 'Available', orders: 89, active: true },
]

const BLANK = { name: '', category: 'Food', price: '', description: '' }
const CATEGORIES = ['Food', 'Drinks', 'Snacks', 'Stationery', 'Other']

export default function SellerProducts() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
  }

  const addProduct = () => {
    if (!form.name.trim() || !form.price) return
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: 'Available',
        orders: 0,
        active: true,
      },
    ])
    setForm(BLANK)
    setShowModal(false)
  }

  const inp = {
    width: '100%',
    height: 44,
    border: '1.5px solid #E5E7EB',
    borderRadius: 10,
    padding: '0 14px',
    fontSize: 14,
    fontFamily: 'Poppins',
    outline: 'none',
    marginBottom: 12,
    background: '#F8F9FC',
    color: '#1F2937',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
            Products
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280' }}>
            {products.filter((p) => p.active).length} active · {products.filter((p) => !p.active).length} hidden
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            height: 44,
            padding: '0 22px',
            background: '#f5a623',
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

      {/* Search */}
      <input
        style={{ ...inp, maxWidth: 320, marginBottom: 20 }}
        placeholder="🔍  Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
              {['Product', 'Category', 'Price', 'Stock', 'Orders', 'Status', ''].map((h) => (
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
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                style={{ borderTop: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}
              >
                <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#1F2937' }}>
                  {p.name}
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6B7280' }}>{p.category}</td>
                <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#1a5c3a' }}>
                  Rs. {p.price}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: p.stock === 'Available' ? '#e8f5e9' : '#fee2e2',
                      color: p.stock === 'Available' ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {p.stock}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#374151' }}>{p.orders}</td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => toggleActive(p.id)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      background: p.active ? '#e8f5e9' : '#F3F4F6',
                      color: p.active ? '#16a34a' : '#6B7280',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {p.active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 18,
                      opacity: 0.5,
                    }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            fontFamily: 'Poppins',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 32,
              width: '100%',
              maxWidth: 440,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1F2937', marginBottom: 20 }}>
              Add New Product
            </h2>

            <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>
              Product Name
            </label>
            <input
              style={inp}
              placeholder="e.g. Rice & Curry"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />

            <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>
              Category
            </label>
            <select
              style={{ ...inp, cursor: 'pointer' }}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>
              Price (Rs.)
            </label>
            <input
              style={inp}
              placeholder="e.g. 200"
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />

            <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>
              Description (optional)
            </label>
            <textarea
              style={{ ...inp, height: 72, padding: '10px 14px', resize: 'none' }}
              placeholder="Brief description..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  height: 44,
                  background: '#F8F9FC',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: 10,
                  color: '#6B7280',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'Poppins',
                }}
              >
                Cancel
              </button>
              <button
                onClick={addProduct}
                style={{
                  flex: 2,
                  height: 44,
                  background: '#f5a623',
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'Poppins',
                }}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

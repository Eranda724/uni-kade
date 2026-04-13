import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const UNIVERSITIES = [
  'University of Moratuwa',
  'University of Colombo',
  'University of Kelaniya',
  'University of Peradeniya',
  'University of Jaffna',
  'SLIIT',
  'NSBM Green University',
]

const CATEGORIES = ['Food', 'Stationery', 'Printing', 'Lab Equipment', 'Other']

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12
  const ampm = i < 12 ? 'AM' : 'PM'
  return `${String(h).padStart(2, '0')}:00 ${ampm}`
})

export default function SellerProfile() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    shopName: user?.shopName || 'My Shop',
    description: 'Fresh and delicious campus food, made with love.',
    phone: '+94 77 000 0000',
    university: user?.university || '',
    category: user?.category || 'Food',
    facultyArea: 'Main Canteen Block',
    openTime: '07:00 AM',
    closeTime: '05:00 PM',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inp = {
    width: '100%',
    height: 46,
    border: '1.5px solid #E5E7EB',
    borderRadius: 10,
    padding: '0 14px',
    fontSize: 14,
    fontFamily: 'Poppins',
    outline: 'none',
    marginBottom: 16,
    background: '#F8F9FC',
    color: '#1F2937',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
    display: 'block',
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
          Shop Profile
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>
          Update your shop details visible to students.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 28 }}>
        {/* Left — logo card */}
        <div>
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #F3F4F6',
              padding: 28,
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#1a5c3a,#2d8a57)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 16px',
                border: '4px solid #e8f5e9',
              }}
            >
              🍴
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
              {form.shopName}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 20 }}>
              {form.category} · {form.university}
            </div>
            <button
              style={{
                width: '100%',
                height: 40,
                background: '#F8F9FC',
                border: '1.5px solid #E5E7EB',
                borderRadius: 10,
                color: '#374151',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins',
              }}
            >
              Upload Logo
            </button>
          </div>

          {/* Shop stats mini */}
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              border: '1px solid #F3F4F6',
              padding: '20px 20px',
              marginTop: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 14, marginBottom: 14 }}>Shop Stats</div>
            {[
              { label: 'Total Orders', value: '482' },
              { label: 'Total Revenue', value: 'Rs. 94,200' },
              { label: 'Avg. Rating', value: '4.8 ⭐' },
              { label: 'Active Since', value: 'Jan 2025' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '9px 0',
                  borderBottom: '1px solid #F3F4F6',
                  fontSize: 13,
                }}
              >
                <span style={{ color: '#6B7280' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: '#1F2937' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #F3F4F6',
            padding: 28,
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
        >
          {saved && (
            <div
              style={{
                background: '#f0faf5',
                border: '1px solid #a7f3d0',
                borderRadius: 10,
                padding: '10px 16px',
                fontSize: 13,
                color: '#065f46',
                marginBottom: 20,
              }}
            >
              ✅ Profile saved successfully!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div>
              <label style={labelStyle}>Shop Name</label>
              <input style={inp} value={form.shopName} onChange={(e) => set('shopName', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inp} value={form.phone} type="tel" onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>University</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.university} onChange={(e) => set('university', e.target.value)}>
                <option value="">Select...</option>
                {UNIVERSITIES.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Campus Area / Location</label>
              <input style={inp} value={form.facultyArea} onChange={(e) => set('facultyArea', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Opening Time</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.openTime} onChange={(e) => set('openTime', e.target.value)}>
                {HOURS.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Closing Time</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.closeTime} onChange={(e) => set('closeTime', e.target.value)}>
                {HOURS.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Shop Description</label>
              <textarea
                style={{ ...inp, height: 80, padding: '12px 14px', resize: 'none' }}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              height: 46,
              padding: '0 28px',
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

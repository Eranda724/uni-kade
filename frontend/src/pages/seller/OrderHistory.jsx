import { useState, useEffect, useMemo } from 'react'
import API from '../../services/api'

// Native replacement for date-fns getDaysInMonth
function getDaysInMonth(year, month) {
  // month is 1-indexed
  return new Date(year, month, 0).getDate()
}

// ─── Styles ─────────────────────────────────────────────────────
const STATUS_STYLE = {
  Pending:   { bg: 'var(--warning-bg)',  color: 'var(--warning-text)' },
  Preparing: { bg: 'var(--info-bg)',     color: 'var(--info-text)'    },
  Ready:     { bg: 'var(--success-bg)',  color: 'var(--success-text)' },
  Delivered: { bg: 'var(--success-bg)',  color: 'var(--success-text)' },
  Completed: { bg: 'var(--bg-hover)',    color: 'var(--text-muted)'   },
  Cancelled: { bg: 'var(--danger-bg)',   color: 'var(--danger-text)'  },
}

const VIEW_TABS   = ['Day', 'Month']
const STATUS_TABS = ['All', 'Completed', 'Delivered', 'Cancelled']

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ─── Helpers ────────────────────────────────────────────────────
function isoDate(iso) {
  // Returns 'YYYY-MM-DD'
  return iso ? iso.slice(0, 10) : ''
}
function isoTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
function friendlyDay(dateStr) {
  // dateStr: 'YYYY-MM-DD'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'long', month: 'short', day: 'numeric' })
}
function friendlyMonth(monthStr) {
  // monthStr: 'YYYY-MM'
  const d = new Date(monthStr + '-01T00:00:00')
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function orderTotal(order) {
  return order.total ?? order.items.reduce((s, it) => s + it.price * it.qty, 0)
}

// ─── Sub-components ─────────────────────────────────────────────

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
      <input
        type="text"
        placeholder="Search by name, order ID…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%', height: 40, padding: '0 14px 0 36px',
          borderRadius: 10, border: '1.5px solid var(--border)',
          background: 'var(--bg-input)', color: 'var(--text)',
          fontSize: 14, fontFamily: 'Poppins', outline: 'none',
        }}
      />
      <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 16, color: 'var(--text-light)' }}>🔍</span>
    </div>
  )
}

function DateFilter({ selectedMonth, setSelectedMonth, selectedDay, setSelectedDay }) {
  const months = [
    { value: '', label: 'All Months' },
    ...monthNames.map((m, i) => ({ value: `2026-${String(i + 1).padStart(2, '0')}`, label: m })),
  ]

  const daysInMonth = selectedMonth
    ? getDaysInMonth(
        parseInt(selectedMonth.split('-')[0]),
        parseInt(selectedMonth.split('-')[1])
      )
    : 31
  const days = [
    { value: '', label: 'All Days' },
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label: `${i + 1}`,
    })),
  ]

  const selectStyle = {
    height: 40, padding: '0 12px', borderRadius: 10,
    border: '1.5px solid var(--border)', background: 'var(--bg-card)',
    color: 'var(--text)', fontSize: 14, fontFamily: 'Poppins', cursor: 'pointer',
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setSelectedDay('') }} style={selectStyle}>
        {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={selectStyle} disabled={!selectedMonth}>
        {days.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
      </select>
    </div>
  )
}

function OrderCard({ order, isExpanded, onToggle }) {
  const total = orderTotal(order)
  const st = STATUS_STYLE[order.status] || STATUS_STYLE.Completed
  const dateStr = isoDate(order.createdAt)
  const timeStr = isoTime(order.createdAt)
  const studentName = order.student?.name || 'Student'
  const studentPhone = order.student?.phone || ''

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 14,
      border: '1px solid var(--border)', overflow: 'hidden',
      transition: 'box-shadow 0.15s',
    }}>
      {/* ── Row ── */}
      <div
        onClick={() => onToggle(order._id)}
        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* ID + time */}
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: 14 }}>
              #{order._id.slice(-6).toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
              {dateStr} • {timeStr}
            </div>
          </div>
          {/* Divider */}
          <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
          {/* Student */}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{studentName}</div>
            {studentPhone && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{studentPhone}</div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ padding: '3px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, ...st }}>
            {order.status}
          </span>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--secondary)' }}>
            Rs. {total.toLocaleString()}
          </span>
          <span style={{ color: 'var(--text-light)', fontSize: 14, transition: 'transform 0.2s', display: 'block', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
            ▾
          </span>
        </div>
      </div>

      {/* ── Expanded detail ── */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '14px 20px', background: 'var(--bg-hover)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
            Items
          </p>
          {order.items.map((it) => (
            <div key={it._id || it.name} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, color: 'var(--text-secondary)',
              padding: '5px 0', borderBottom: '1px solid var(--border)',
            }}>
              <span>{it.name} <span style={{ color: 'var(--text-light)' }}>× {it.qty}</span></span>
              <span style={{ fontWeight: 700, color: 'var(--text)' }}>Rs. {it.price * it.qty}</span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1.5px dashed var(--border)', fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--secondary)' }}>Rs. {total.toLocaleString()}</span>
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
            💵 Payment: <strong style={{ color: 'var(--text)' }}>Cash on Pickup</strong>
          </div>

          {order.note && (
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
              📝 Note: <strong style={{ color: 'var(--text)' }}>{order.note}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Stat card ──────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 14,
      border: '1px solid var(--border-light)', padding: '18px 20px',
      flex: '1 1 160px',
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || 'var(--text)', marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color || 'var(--primary)', fontWeight: 600, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────
export default function SellerOrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('Day')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [expandedId, setExpandedId] = useState(null)

  // ── Fetch all seller orders ──────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await API.get('/orders')
        // Keep only completed/delivered/cancelled for history; active orders live in Orders page
        setOrders(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order history')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // ── Filtered list ────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const dateStr = isoDate(order.createdAt)
      const studentName = (order.student?.name || '').toLowerCase()
      const shortId = order._id.slice(-6).toLowerCase()

      const matchesSearch = !searchTerm || (
        studentName.includes(searchTerm.toLowerCase()) ||
        shortId.includes(searchTerm.toLowerCase()) ||
        dateStr.includes(searchTerm)
      )
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter
      const matchesMonth = !selectedMonth || dateStr.startsWith(selectedMonth)
      const matchesDay = !selectedDay || dateStr.endsWith(`-${selectedDay}`)

      return matchesSearch && matchesStatus && matchesMonth && matchesDay
    })
  }, [orders, searchTerm, statusFilter, selectedMonth, selectedDay])

  // ── Grouping ─────────────────────────────────────────────────
  const groupedByDay = useMemo(() => {
    const groups = {}
    filteredOrders.forEach((order) => {
      const day = isoDate(order.createdAt)
      if (!groups[day]) groups[day] = []
      groups[day].push(order)
    })
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filteredOrders])

  const groupedByMonth = useMemo(() => {
    const groups = {}
    filteredOrders.forEach((order) => {
      const month = isoDate(order.createdAt).slice(0, 7)
      if (!groups[month]) groups[month] = []
      groups[month].push(order)
    })
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filteredOrders])

  // ── Stats ────────────────────────────────────────────────────
  const grandTotal = filteredOrders.reduce((s, o) => s + orderTotal(o), 0)
  const completedCount = filteredOrders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length
  const cancelledCount = filteredOrders.filter(o => o.status === 'Cancelled').length
  const avgOrder = filteredOrders.length > 0 ? Math.round(grandTotal / filteredOrders.length) : 0

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id))

  // ── Render ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading order history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif', textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <p style={{ color: 'var(--danger-text)', fontSize: 14 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: 16, background: 'var(--primary)', border: 'none', borderRadius: 10, color: '#fff', padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Order History</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Browse, filter, and review your complete order log.
        </p>
      </div>

      {/* ── Stats row ───────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatCard icon="📦" label="Filtered Orders" value={filteredOrders.length} color="var(--text)" />
        <StatCard icon="💰" label="Total Revenue" value={`Rs. ${grandTotal.toLocaleString()}`} color="var(--secondary)" />
        <StatCard icon="✅" label="Completed" value={completedCount} color="var(--success-text)" />
        <StatCard icon="❌" label="Cancelled" value={cancelledCount} color="var(--danger-text)" />
        <StatCard icon="📊" label="Avg Order Value" value={filteredOrders.length > 0 ? `Rs. ${avgOrder.toLocaleString()}` : '—'} color="var(--primary)" />
      </div>

      {/* ── Filters bar ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <DateFilter
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        {/* Status filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '7px 14px', borderRadius: 9, fontFamily: 'Poppins',
                border: statusFilter === s ? 'none' : '1.5px solid var(--border)',
                background: statusFilter === s ? 'var(--primary)' : 'var(--bg-card)',
                color: statusFilter === s ? '#fff' : 'var(--text-muted)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── View mode tabs ───────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {VIEW_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setViewMode(tab)}
            style={{
              padding: '7px 18px', borderRadius: 9, fontFamily: 'Poppins',
              border: viewMode === tab ? 'none' : '1.5px solid var(--border)',
              background: viewMode === tab ? 'var(--secondary)' : 'var(--bg-card)',
              color: viewMode === tab ? '#fff' : 'var(--text-muted)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
          >
            {tab === 'Day' ? '📅 Group by Day' : '📆 Group by Month'}
          </button>
        ))}
      </div>

      {/* ── Empty state ──────────────────────────────────────── */}
      {filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>No orders found</p>
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === 'Day' ? (

        /* ── Day view ───────────────────────────────────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {groupedByDay.map(([date, dayOrders]) => {
            const dayRevenue = dayOrders.reduce((s, o) => s + orderTotal(o), 0)
            return (
              <div key={date}>
                {/* Day header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 12, padding: '10px 16px',
                  background: 'var(--bg-input)', borderRadius: 10,
                  border: '1px solid var(--border-light)',
                }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                      📅 {friendlyDay(date)}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {dayOrders.length} order{dayOrders.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--secondary)' }}>
                      Rs. {dayRevenue.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-light)' }}>day total</div>
                  </div>
                </div>

                {/* Order cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {dayOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      isExpanded={expandedId === order._id}
                      onToggle={toggle}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      ) : (

        /* ── Month view ─────────────────────────────────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {groupedByMonth.map(([month, monthOrders]) => {
            const monthRevenue = monthOrders.reduce((s, o) => s + orderTotal(o), 0)
            return (
              <div key={month}>
                {/* Month header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 12, padding: '12px 18px',
                  background: 'linear-gradient(135deg, var(--success-bg), var(--bg-input))',
                  borderRadius: 10, border: '1px solid var(--border-light)',
                }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                      📆 {friendlyMonth(month)}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {monthOrders.length} order{monthOrders.length !== 1 ? 's' : ''} ·{' '}
                      {monthOrders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length} completed ·{' '}
                      {monthOrders.filter(o => o.status === 'Cancelled').length} cancelled
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--secondary)' }}>
                      Rs. {monthRevenue.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-light)' }}>monthly revenue</div>
                  </div>
                </div>

                {/* Order cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {monthOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      isExpanded={expandedId === order._id}
                      onToggle={toggle}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
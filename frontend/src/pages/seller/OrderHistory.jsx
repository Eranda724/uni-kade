import { useState, useMemo } from 'react'
import { format, parseISO, getDaysInMonth } from 'date-fns'

// ─── Mock Data ────────────────────────────────────────────────
const INIT_ORDERS = [
  {
    id: '#ORD-001',
    student: 'Kasun Perera',
    phone: '077-111-2222',
    items: [{ name: 'Rice & Curry', qty: 2, price: 190 }],
    date: '2026-05-17',
    time: '10:02 AM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
  {
    id: '#ORD-002',
    student: 'Nimali Silva',
    phone: '071-333-4444',
    items: [
      { name: 'Kottu', qty: 1, price: 250 },
      { name: 'Fresh Juice', qty: 1, price: 60 },
    ],
    date: '2026-05-17',
    time: '10:08 AM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
  {
    id: '#ORD-003',
    student: 'Ashan Fernando',
    phone: '076-555-6666',
    items: [{ name: 'Short Eats', qty: 4, price: 40 }],
    date: '2026-05-16',
    time: '10:14 AM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
  {
    id: '#ORD-004',
    student: 'Dinusha Ranasinghe',
    phone: '070-777-8888',
    items: [{ name: 'Fried Rice', qty: 1, price: 220 }],
    date: '2026-05-15',
    time: '9:45 AM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
  {
    id: '#ORD-005',
    student: 'Chamara Bandara',
    phone: '078-999-0000',
    items: [
      { name: 'Noodles', qty: 1, price: 180 },
      { name: 'Water', qty: 2, price: 30 },
    ],
    date: '2026-05-14',
    time: '9:30 AM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
  {
    id: '#ORD-006',
    student: 'Samantha Kumari',
    phone: '071-222-3333',
    items: [{ name: 'Vegetable Rice', qty: 1, price: 180 }],
    date: '2026-05-13',
    time: '2:15 PM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
  {
    id: '#ORD-007',
    student: 'Rajitha Perera',
    phone: '077-333-4444',
    items: [
      { name: 'Chicken Kottu', qty: 2, price: 280 },
      { name: 'Iced Coffee', qty: 1, price: 70 },
    ],
    date: '2026-05-12',
    time: '11:30 AM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
  {
    id: '#ORD-008',
    student: 'Madhavi Silva',
    phone: '076-444-5555',
    items: [{ name: 'Pasta', qty: 1, price: 250 }],
    date: '2026-05-10',
    time: '3:45 PM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
  {
    id: '#ORD-009',
    student: 'Thilina Gunasekara',
    phone: '075-555-6666',
    items: [
      { name: 'Sandwich', qty: 3, price: 120 },
      { name: 'Tea', qty: 2, price: 40 },
    ],
    date: '2026-05-05',
    time: '8:20 AM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
  {
    id: '#ORD-010',
    student: 'Nadeeka Rajapakse',
    phone: '072-666-7777',
    items: [{ name: 'Wrap', qty: 2, price: 150 }],
    date: '2026-04-28',
    time: '1:15 PM',
    status: 'Completed',
    note: '',
    paymentMethod: 'Cash on Pickup',
    paymentStatus: 'Paid',
  },
]

// ─── Styles ─────────────────────────────────────────────────────
const STATUS_STYLE = {
  Pending: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Preparing: { bg: 'var(--info-bg)', color: 'var(--info-text)' },
  Ready: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Delivered: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Completed: { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
  Cancelled: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

const PAYMENT_STYLE = {
  Paid: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  Unpaid: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  Refunded: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
}

const VIEW_TABS = ['Day', 'Month']
const PAYMENT_TABS = ['All', 'Paid', 'Unpaid', 'Refunded']

// ─── Helpers ────────────────────────────────────────────────────
const getDayTotal = (orders) => orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.qty, 0), 0)
const getDayCount = (orders) => orders.length

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ─── Components ─────────────────────────────────────────────────

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
      <input
        type="text"
        placeholder="Search by name, order ID, or date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          height: 40,
          padding: '0 14px 0 36px',
          borderRadius: 10,
          border: '1.5px solid var(--border)',
          background: 'var(--bg-input)',
          color: 'var(--text)',
          fontSize: 14,
          fontFamily: 'Poppins',
          outline: 'none',
        }}
      />
      <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 16, color: 'var(--text-light)' }}>🔍</span>
    </div>
  )
}

function DateFilter({ selectedMonth, setSelectedMonth, selectedDay, setSelectedDay }) {
  const months = [
    { value: '', label: 'All Months' },
    ...monthNames.map((m, i) => ({ value: `${2026}-${String(i + 1).padStart(2, '0')}`, label: m })),
  ]

  const daysInMonth = selectedMonth ? getDaysInMonth(parseISO(selectedMonth + '-01')) : 31
  const days = [{ value: '', label: 'All Days' }, ...Array.from({ length: daysInMonth }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: `${i + 1}`,
  }))]

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        style={{
          height: 40,
          padding: '0 12px',
          borderRadius: 10,
          border: '1.5px solid var(--border)',
          background: 'var(--bg-card)',
          color: 'var(--text)',
          fontSize: 14,
          fontFamily: 'Poppins',
          cursor: 'pointer',
        }}
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
        style={{
          height: 40,
          padding: '0 12px',
          borderRadius: 10,
          border: '1.5px solid var(--border)',
          background: 'var(--bg-card)',
          color: 'var(--text)',
          fontSize: 14,
          fontFamily: 'Poppins',
          cursor: 'pointer',
        }}
      >
        {days.map((d) => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>
    </div>
  )
}

function OrderItem({ order, isExpanded, onToggle }) {
  const total = order.items.reduce((s, it) => s + it.price * it.qty, 0)

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 12,
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <div
        onClick={() => onToggle(order.id)}
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>{order.id}</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{order.date} • {order.time}</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{order.student}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.phone}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            padding: '4px 10px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            ...PAYMENT_STYLE[order.paymentStatus],
          }}>{order.paymentStatus}</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--secondary)' }}>Rs. {total}</span>
          <span style={{ color: 'var(--text-light)', fontSize: 14 }}>{isExpanded ? '▴' : '▾'}</span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '14px 20px', background: 'var(--bg-hover)' }}>
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 6 }}>Items</p>
            {order.items.map((it) => (
              <div key={it.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', padding: '4px 0' }}>
                <span>{it.name} × {it.qty}</span>
                <span style={{ fontWeight: 600 }}>Rs. {it.price * it.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px dashed var(--border)', fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: 'var(--secondary)' }}>Rs. {total}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
            💵 Payment: <strong style={{ color: 'var(--text)' }}>{order.paymentMethod}</strong>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export default function SellerOrderHistory() {
  const [orders] = useState(INIT_ORDERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('Day')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('All')
  const [expandedId, setExpandedId] = useState(null)

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = !searchTerm ||
        order.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.date.includes(searchTerm)
      const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter
      const matchesDate = !selectedMonth || order.date.startsWith(selectedMonth)
      const matchesDay = !selectedDay || order.date.endsWith(`-${selectedDay}`)
      return matchesSearch && matchesPayment && matchesDate && matchesDay
    })
  }, [orders, searchTerm, paymentFilter, selectedMonth, selectedDay])

  const groupedByDay = useMemo(() => {
    const groups = {}
    filteredOrders.forEach((order) => {
      const day = order.date
      if (!groups[day]) groups[day] = []
      groups[day].push(order)
    })
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filteredOrders])

  const groupedByMonth = useMemo(() => {
    const groups = {}
    filteredOrders.forEach((order) => {
      const month = order.date.substring(0, 7)
      if (!groups[month]) groups[month] = []
      groups[month].push(order)
    })
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filteredOrders])

  const grandTotal = filteredOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.qty, 0), 0)

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Order History</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>View and search your past orders with payment details.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <DateFilter selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          style={{
            height: 40,
            padding: '0 12px',
            borderRadius: 10,
            border: '1.5px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: 14,
            fontFamily: 'Poppins',
            cursor: 'pointer',
          }}
        >
          {PAYMENT_TABS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {VIEW_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setViewMode(tab)}
            style={{
              padding: '7px 16px',
              borderRadius: 9,
              border: viewMode === tab ? 'none' : '1.5px solid var(--border)',
              background: viewMode === tab ? 'var(--primary)' : 'var(--bg-card)',
              color: viewMode === tab ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'Poppins',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 20, padding: '16px 20px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Total Orders</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{filteredOrders.length}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Total Revenue</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--secondary)' }}>Rs. {grandTotal}</p>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>No orders found</p>
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === 'Day' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {groupedByDay.map(([date, dayOrders]) => (
            <div key={date}>
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{format(parseISO(date), 'EEEE, MMM d')}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {getDayCount(dayOrders)} orders • Rs. {getDayTotal(dayOrders)} total
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {dayOrders.map((order) => (
                  <OrderItem
                    key={order.id}
                    order={order}
                    isExpanded={expandedId === order.id}
                    onToggle={setExpandedId}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {groupedByMonth.map(([month, monthOrders]) => (
            <div key={month}>
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{format(parseISO(month + '-01'), 'MMMM yyyy')}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {getDayCount(monthOrders)} orders • Rs. {getDayTotal(monthOrders)} total
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {monthOrders.map((order) => (
                  <OrderItem
                    key={order.id}
                    order={order}
                    isExpanded={expandedId === order.id}
                    onToggle={setExpandedId}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
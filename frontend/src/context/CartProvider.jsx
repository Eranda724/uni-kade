import { createContext, useState } from 'react'

const STORAGE_KEY = 'unikade.cart'
const CartContext = createContext(null)
export { CartContext }

export function CartProvider({ children }) {
  const saveCart = (items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch { /* quota exceeded etc. */ }
  }

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const addItem = (item) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id)
      let next
      if (found) {
        next = prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        )
      } else {
        next = [...prev, { ...item, qty: 1 }]
      }
      saveCart(next)
      return next
    })
  }

  const removeItem = (itemId) => {
    setCart((prev) => {
      const next = prev.filter((i) => i.id !== itemId)
      saveCart(next)
      return next
    })
  }

  const setQty = (itemId, qty) => {
    if (qty <= 0) {
      removeItem(itemId)
      return
    }
    setCart((prev) => {
      const next = prev.map((i) =>
        i.id === itemId ? { ...i, qty } : i,
      )
      saveCart(next)
      return next
    })
  }

  const clearCart = () => {
    setCart([])
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  return (
    <CartContext.Provider value={{ cart, cartCount, addItem, removeItem, setQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

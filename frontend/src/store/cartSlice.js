import { createSlice } from "@reduxjs/toolkit"

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : initialState
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
    return initialState
  }
}

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

const initialState = {
  items: [],
  total: 0,
  coupon: null,
}

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.id === id)

      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ id, name, price, image, quantity })
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      saveCartToStorage(state)
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      saveCartToStorage(state)
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find((item) => item.id === id)
      if (item) {
        item.quantity = Math.max(0, quantity)
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.id !== id)
        }
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      saveCartToStorage(state)
    },

    applyCoupon: (state, action) => {
      state.coupon = action.payload
      saveCartToStorage(state)
    },

    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.coupon = null
      saveCartToStorage(state)
    },

    // Load cart from storage (useful for hydration)
    loadCart: (state) => {
      const savedCart = loadCartFromStorage()
      state.items = savedCart.items
      state.total = savedCart.total
      state.coupon = savedCart.coupon
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, applyCoupon, clearCart, loadCart } = cartSlice.actions
export default cartSlice.reducer

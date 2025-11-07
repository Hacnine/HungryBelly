import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

export const placeOrder = createAsyncThunk("order/placeOrder", async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/orders", orderData)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to place order")
  }
})

export const fetchUserOrders = createAsyncThunk("order/fetchUserOrders", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/orders")
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch orders")
  }
})

export const fetchOrderDetail = createAsyncThunk("order/fetchOrderDetail", async (orderIdentifier, { rejectWithValue }) => {
  try {
    // Check if it's an order number (starts with ORD-) or ID
    const endpoint = orderIdentifier.startsWith('ORD-') ? `/orders/track/${orderIdentifier}` : `/orders/${orderIdentifier}`
    const { data } = await axiosInstance.get(endpoint)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch order")
  }
})

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false
        state.selectedOrder = action.payload
        state.orders.unshift(action.payload)
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.selectedOrder = action.payload
      })
  },
})

export default orderSlice.reducer

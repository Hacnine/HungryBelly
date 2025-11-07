import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axiosInstance from '../api/axiosInstance'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: axiosInstance.defaults.baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    // These would be used if we had server-side cart persistence
    // For now, cart is stored in Redux/localStorage
  }),
})

export const { } = cartApi
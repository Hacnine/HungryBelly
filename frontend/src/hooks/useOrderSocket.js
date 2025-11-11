"use client"

import { useEffect, useState } from "react"
import io from "socket.io-client"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export function useOrderSocket(orderId) {
  const [order, setOrder] = useState(null)
  const [driver, setDriver] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!orderId) return

    const socket = io(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socket.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
      socket.emit("join_order", orderId)
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    // Listen for order updates
    socket.on("order:update", (updatedOrder) => {
      console.log("Order updated:", updatedOrder)
      setOrder(updatedOrder)
    })

    // Listen for driver assignment
    socket.on("driver:assigned", (driverData) => {
      console.log("Driver assigned:", driverData)
      setDriver(driverData)
    })

    // Listen for driver location updates
    socket.on("driver:location", (location) => {
      console.log("Driver location:", location)
      setDriverLocation(location)
    })

    return () => {
      socket.emit("leave_order", orderId)
      socket.disconnect()
    }
  }, [orderId])

  return { order, driver, driverLocation, isConnected }
}

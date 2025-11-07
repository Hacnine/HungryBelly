import "dotenv/config.js"
import express from "express"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import { Server } from "socket.io"

import authRoutes from "./routes/auth.js"
import menuRoutes from "./routes/menu.js"
import orderRoutes from "./routes/orders.js"
import adminRoutes from "./routes/admin.js"
import paymentRoutes from "./routes/payments.js"
import driverRoutes from "./routes/drivers.js"
import couponRoutes from "./routes/coupons.js"
import foodItemRoutes from "./routes/foodItems.js"
import addressRoutes from "./routes/addresses.js"
import {
  emitOrderUpdate,
  emitDriverLocation,
  handleOrderStatusUpdate,
  handleDriverAssignment,
} from "./utils/socket-handlers.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  },
})

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
)

app.use("/payments/webhook", express.raw({ type: "application/json" }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/auth", authRoutes)
app.use("/menu", menuRoutes)
app.use("/orders", orderRoutes)
app.use("/admin", adminRoutes)
app.use("/payments", paymentRoutes)
app.use("/drivers", driverRoutes)
app.use("/coupons", couponRoutes)
app.use("/food-items", foodItemRoutes)
app.use("/addresses", addressRoutes)

app.get("/health", (req, res) => res.json({ ok: true }))

io.on("connection", (socket) => {
  console.log("socket connected", socket.id)

  // Join order room for real-time updates
  socket.on("join_order", (orderId) => {
    socket.join(orderId)
    console.log(`[Socket] Client joined order room: ${orderId}`)
  })

  // Leave order room
  socket.on("leave_order", (orderId) => {
    socket.leave(orderId)
    console.log(`[Socket] Client left order room: ${orderId}`)
  })

  // Driver location update (from driver app)
  socket.on("driver:location_update", async (data) => {
    const { orderId, latitude, longitude } = data
    console.log(`[Socket] Driver location update for order ${orderId}`)
    emitDriverLocation(io, orderId, { latitude, longitude })
  })

  // Admin update order status
  socket.on("admin:update_order_status", async (data) => {
    const { orderId, status } = data
    console.log(`[Socket] Admin updating order ${orderId} to ${status}`)
    await handleOrderStatusUpdate(io, orderId, status)
  })

  // Admin assign driver to order
  socket.on("admin:assign_driver", async (data) => {
    const { orderId, driverId } = data
    console.log(`[Socket] Admin assigning driver ${driverId} to order ${orderId}`)
    await handleDriverAssignment(io, orderId, driverId)
  })
})

server.listen(process.env.PORT || 4000, () => {
  console.log("API server running on port", process.env.PORT || 4000)
})

export { io }

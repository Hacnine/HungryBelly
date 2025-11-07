import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

// Place order (supports both authenticated users and guests)
router.post("/", async (req, res) => {
  try {
    const { items, total, guestInfo, deliveryAddress, notes, coupon } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid items" })
    }

    // Generate unique order number
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const orderNumber = `ORD-${dateStr}-${randomNum}`

    const orderData = {
      items,
      total: Number.parseFloat(total),
      status: "placed",
      orderNumber,
      steps: [
        {
          step: "placed",
          timestamp: new Date().toISOString(),
          message: "Order has been placed successfully"
        },
      ],
    }

    // Add userId if authenticated
    if (req.user?.userId) {
      orderData.userId = req.user.userId
    }

    // Add guest info if provided (required for guest orders)
    if (!req.user?.userId) {
      if (!guestInfo || !guestInfo.name || !guestInfo.email) {
        return res.status(400).json({ error: "Guest information required for guest orders" })
      }
      orderData.guestInfo = guestInfo
    }

    // Add optional fields
    if (deliveryAddress) {
      orderData.deliveryAddress = deliveryAddress
    }
    if (notes) {
      orderData.notes = notes
    }
    if (coupon) {
      orderData.coupons = coupon
    }

    const order = await prisma.order.create({
      data: orderData
    })

    res.status(201).json({
      ...order,
      message: "Order placed successfully",
      trackingUrl: `/order/${order.orderNumber}`
    })
  } catch (error) {
    console.error("Order creation error:", error)
    res.status(500).json({ error: "Failed to create order" })
  }
})

// Get user orders (authenticated users only)
router.get("/", authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})

// Track order by order number (public route for guests and users)
router.get("/track/:orderNumber", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber }
    })

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    // If user is authenticated, check if they own this order
    if (req.user && order.userId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" })
  }
})

// Get order by id (authenticated users only)
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } })
    if (!order) return res.status(404).json({ error: "Order not found" })
    if (order.userId !== req.user.userId) return res.status(403).json({ error: "Access denied" })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" })
  }
})

export default router

import express from "express"
import stripe from "stripe"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middlewares/auth.js"
import { sendOrderConfirmationEmail } from "../utils/email.js"

const stripeInstance = process.env.STRIPE_SECRET_KEY ? stripe(process.env.STRIPE_SECRET_KEY) : null

const router = express.Router()
const prisma = new PrismaClient()

// Create payment intent
router.post("/create-payment-intent", authenticate, async (req, res) => {
  try {
    if (!stripeInstance) {
      return res.status(503).json({ error: "Payment service not configured" })
    }

    const { orderId, amount } = req.body

    if (!orderId || !amount) {
      return res.status(400).json({ error: "missing orderId or amount" })
    }

    // Verify order belongs to user
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return res.status(404).json({ error: "order not found" })
    if (order.userId !== req.user.userId) return res.status(403).json({ error: "forbidden" })

    // Create payment intent
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId,
        userId: req.user.userId,
      },
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// Webhook handler for Stripe events
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripeInstance) {
    return res.status(503).json({ error: "Payment service not configured" })
  }

  const sig = req.headers["stripe-signature"]
  let event

  try {
    event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object)
        break
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }
    res.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    res.status(500).json({ error: "webhook handler error" })
  }
})

async function handlePaymentIntentSucceeded(paymentIntent) {
  const { orderId, userId } = paymentIntent.metadata

  // Update order as paid
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      paid: true,
      status: "accepted",
      steps: [
        { step: "placed", timestamp: new Date(paymentIntent.created * 1000).toISOString() },
        { step: "accepted", timestamp: new Date().toISOString() },
      ],
    },
  })

  // Get user for email
  const user = await prisma.user.findUnique({ where: { id: userId } })

  // Send confirmation email
  await sendOrderConfirmationEmail(user.email, user.name, order)

  console.log(`Payment succeeded for order ${orderId}`)
}

async function handlePaymentIntentFailed(paymentIntent) {
  const { orderId } = paymentIntent.metadata
  console.log(`Payment failed for order ${orderId}`)
  // Optionally: update order status, send failure email
}

export default router

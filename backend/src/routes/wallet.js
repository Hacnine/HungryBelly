import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middlewares/auth.js"
import { sendNotification } from "./notifications.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get wallet balance
router.get("/balance", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        walletBalance: true,
        loyaltyPoints: true,
        loyaltyTier: true
      }
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch balance" })
  }
})

// Get wallet transactions
router.get("/transactions", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {
      userId: req.user.userId
    }

    if (type) {
      where.type = type
    }

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.walletTransaction.count({ where })
    ])

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
})

// Add money to wallet
router.post("/add", authenticate, async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    })

    const balanceBefore = user.walletBalance
    const balanceAfter = balanceBefore + parseFloat(amount)

    // Create transaction
    await prisma.walletTransaction.create({
      data: {
        userId: req.user.userId,
        type: 'credit',
        amount: parseFloat(amount),
        balanceBefore,
        balanceAfter,
        description: `Added ₹${amount} to wallet via ${paymentMethod}`,
        status: 'completed'
      }
    })

    // Update user balance
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { walletBalance: balanceAfter }
    })

    // Send notification
    await sendNotification(
      req.user.userId,
      'wallet_credit',
      'Money Added to Wallet',
      `$${amount} has been added to your wallet successfully.`,
      { amount, newBalance: balanceAfter }
    )

    res.json({
      message: "Money added successfully",
      balance: balanceAfter
    })
  } catch (error) {
    console.error("Wallet add error:", error)
    res.status(500).json({ error: "Failed to add money" })
  }
})

// Use wallet for payment (Internal function)
export async function deductFromWallet(userId, amount, orderId, description) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user.walletBalance < amount) {
      return { success: false, error: "Insufficient wallet balance" }
    }

    const balanceBefore = user.walletBalance
    const balanceAfter = balanceBefore - amount

    // Create transaction
    await prisma.walletTransaction.create({
      data: {
        userId,
        type: 'debit',
        amount,
        balanceBefore,
        balanceAfter,
        orderId,
        description,
        status: 'completed'
      }
    })

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { walletBalance: balanceAfter }
    })

    return { success: true, newBalance: balanceAfter }
  } catch (error) {
    console.error("Wallet deduction error:", error)
    return { success: false, error: "Failed to process payment" }
  }
}

// Add refund to wallet
export async function addRefundToWallet(userId, amount, orderId, description) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    const balanceBefore = user.walletBalance
    const balanceAfter = balanceBefore + amount

    // Create transaction
    await prisma.walletTransaction.create({
      data: {
        userId,
        type: 'refund',
        amount,
        balanceBefore,
        balanceAfter,
        orderId,
        description,
        status: 'completed'
      }
    })

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { walletBalance: balanceAfter }
    })

    return { success: true, newBalance: balanceAfter }
  } catch (error) {
    console.error("Refund error:", error)
    return { success: false, error: "Failed to process refund" }
  }
}

// Add cashback to wallet
export async function addCashback(userId, amount, orderId, description) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    const balanceBefore = user.walletBalance
    const balanceAfter = balanceBefore + amount

    // Create transaction
    await prisma.walletTransaction.create({
      data: {
        userId,
        type: 'cashback',
        amount,
        balanceBefore,
        balanceAfter,
        orderId,
        description,
        status: 'completed'
      }
    })

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { walletBalance: balanceAfter }
    })

    // Send notification
    await sendNotification(
      userId,
      'wallet_cashback',
      'Cashback Received! 🎉',
      `You received $${amount.toFixed(2)} cashback in your wallet.`,
      { amount, newBalance: balanceAfter }
    )

    return { success: true, newBalance: balanceAfter }
  } catch (error) {
    console.error("Cashback error:", error)
    return { success: false, error: "Failed to add cashback" }
  }
}

export default router

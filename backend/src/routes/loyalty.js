import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middlewares/auth.js"
import { sendNotification } from "./notifications.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get loyalty points
router.get("/points", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        loyaltyPoints: true,
        loyaltyTier: true,
        referralCode: true
      }
    })

    // Get transactions
    const transactions = await prisma.loyaltyTransaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    res.json({
      ...user,
      transactions,
      tierBenefits: getTierBenefits(user.loyaltyTier)
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loyalty points" })
  }
})

// Get loyalty transactions
router.get("/transactions", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [transactions, total] = await Promise.all([
      prisma.loyaltyTransaction.findMany({
        where: { userId: req.user.userId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.loyaltyTransaction.count({
        where: { userId: req.user.userId }
      })
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

// Apply referral code
router.post("/referral/apply", authenticate, async (req, res) => {
  try {
    const { referralCode } = req.body

    // Check if user already used a referral
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.userId }
    })

    if (currentUser.referredBy) {
      return res.status(400).json({ error: "Referral code already applied" })
    }

    // Find referrer
    const referrer = await prisma.user.findUnique({
      where: { referralCode }
    })

    if (!referrer) {
      return res.status(404).json({ error: "Invalid referral code" })
    }

    if (referrer.id === req.user.userId) {
      return res.status(400).json({ error: "Cannot use your own referral code" })
    }

    // Update user
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { referredBy: referrer.id }
    })

    // Give bonus to referrer (500 points)
    await addLoyaltyPoints(referrer.id, 500, 'referral', 'Referral bonus - new user joined')

    // Give bonus to new user (200 points)
    await addLoyaltyPoints(req.user.userId, 200, 'referral', 'Welcome bonus - referral applied')

    res.json({
      message: "Referral code applied successfully! You received 200 points.",
      pointsEarned: 200
    })
  } catch (error) {
    console.error("Referral error:", error)
    res.status(500).json({ error: "Failed to apply referral code" })
  }
})

// Helper function to add loyalty points
export async function addLoyaltyPoints(userId, points, type, description, orderId = null, multiplier = 1) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    const pointsToAdd = Math.floor(points * multiplier)
    const newBalance = user.loyaltyPoints + pointsToAdd

    // Create transaction
    await prisma.loyaltyTransaction.create({
      data: {
        userId,
        pointsEarned: pointsToAdd,
        pointsBalance: newBalance,
        type,
        description,
        orderId,
        multiplier
      }
    })

    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: newBalance }
    })

    // Check for tier upgrade
    const newTier = calculateTier(newBalance)
    if (newTier !== user.loyaltyTier) {
      await prisma.user.update({
        where: { id: userId },
        data: { loyaltyTier: newTier }
      })

      // Send notification
      await sendNotification(
        userId,
        'loyalty_tier_upgrade',
        'Tier Upgraded! 🎉',
        `Congratulations! You've been upgraded to ${newTier} tier.`,
        { tier: newTier }
      )
    }

    return { success: true, points: pointsToAdd, newBalance, tier: newTier }
  } catch (error) {
    console.error("Add points error:", error)
    return { success: false, error: "Failed to add points" }
  }
}

// Helper function to redeem loyalty points
export async function redeemLoyaltyPoints(userId, points, description, orderId = null) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user.loyaltyPoints < points) {
      return { success: false, error: "Insufficient points" }
    }

    const newBalance = user.loyaltyPoints - points

    // Create transaction
    await prisma.loyaltyTransaction.create({
      data: {
        userId,
        pointsRedeemed: points,
        pointsBalance: newBalance,
        type: 'redemption',
        description,
        orderId
      }
    })

    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: newBalance }
    })

    return { success: true, pointsRedeemed: points, newBalance }
  } catch (error) {
    console.error("Redeem points error:", error)
    return { success: false, error: "Failed to redeem points" }
  }
}

// Calculate tier based on points
function calculateTier(points) {
  if (points >= 10000) return 'Platinum'
  if (points >= 5000) return 'Gold'
  if (points >= 2000) return 'Silver'
  return 'Bronze'
}

// Get tier benefits
function getTierBenefits(tier) {
  const benefits = {
    Bronze: {
      pointsMultiplier: 1,
      deliveryDiscount: 0,
      prioritySupport: false,
      exclusiveDeals: false
    },
    Silver: {
      pointsMultiplier: 1.25,
      deliveryDiscount: 10,
      prioritySupport: false,
      exclusiveDeals: true
    },
    Gold: {
      pointsMultiplier: 1.5,
      deliveryDiscount: 20,
      prioritySupport: true,
      exclusiveDeals: true
    },
    Platinum: {
      pointsMultiplier: 2,
      deliveryDiscount: 50,
      prioritySupport: true,
      exclusiveDeals: true
    }
  }

  return benefits[tier]
}

export default router

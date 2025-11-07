import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await prisma.address.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

// Get a single address
export const getAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ error: "Failed to fetch address" });
  }
};

// Create a new address
export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      type = "delivery",
      label = "Home",
      street,
      city,
      state,
      zipCode,
      country = "US",
      latitude,
      longitude,
      isDefault = false,
    } = req.body;

    // Validate required fields
    if (!street || !city) {
      return res.status(400).json({
        error: "Street and city are required"
      });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, type },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        type,
        label,
        street,
        city,
        state,
        zipCode,
        country,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        isDefault,
      },
    });

    res.status(201).json(address);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ error: "Failed to create address" });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      type,
      label,
      street,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, type: type || existingAddress.type },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(label && { label }),
        ...(street && { street }),
        ...(city && { city }),
        ...(state !== undefined && { state }),
        ...(zipCode !== undefined && { zipCode }),
        ...(country && { country }),
        ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
        ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null }),
        ...(isDefault !== undefined && { isDefault }),
        updatedAt: new Date(),
      },
    });

    res.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Failed to update address" });
  }
};

// Delete (soft delete) an address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    // Soft delete
    await prisma.address.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Failed to delete address" });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    // Unset all defaults for this address type
    await prisma.address.updateMany({
      where: { userId, type: address.type },
      data: { isDefault: false },
    });

    // Set this address as default
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    res.json(updatedAddress);
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ error: "Failed to set default address" });
  }
};
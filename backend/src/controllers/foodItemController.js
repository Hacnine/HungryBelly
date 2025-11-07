import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new food item
export const createFoodItem = async (req, res) => {
  try {
    const foodItem = await prisma.foodItem.create({
      data: req.body
    });
    res.status(201).json(foodItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all food items
export const getFoodItems = async (req, res) => {
  try {
    const foodItems = await prisma.foodItem.findMany();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single food item by ID
export const getFoodItemById = async (req, res) => {
  try {
    const foodItem = await prisma.foodItem.findUnique({
      where: { id: req.params.id }
    });
    if (!foodItem) return res.status(404).json({ error: 'Food item not found' });
    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a food item
export const updateFoodItem = async (req, res) => {
  try {
    const foodItem = await prisma.foodItem.update({
      where: { id: req.params.id },
      data: req.body
    });
    if (!foodItem) return res.status(404).json({ error: 'Food item not found' });
    res.json(foodItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a food item
export const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await prisma.foodItem.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Food item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

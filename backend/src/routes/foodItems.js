import express from 'express';
import {
  createFoodItem,
  getFoodItems,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem
} from '../controllers/foodItemController.js';

const router = express.Router();

// Create a new food item
router.post('/', createFoodItem);

// Get all food items
router.get('/', getFoodItems);

// Get a single food item by ID
router.get('/:id', getFoodItemById);

// Update a food item
router.put('/:id', updateFoodItem);

// Delete a food item
router.delete('/:id', deleteFoodItem);

export default router;

import express from 'express';
import {
  getUserAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All address routes require authentication
router.use(authenticate);

// Get all addresses for the authenticated user
router.get('/', getUserAddresses);

// Get a specific address
router.get('/:id', getAddress);

// Create a new address
router.post('/', createAddress);

// Update an address
router.put('/:id', updateAddress);

// Delete an address (soft delete)
router.delete('/:id', deleteAddress);

// Set an address as default
router.patch('/:id/default', setDefaultAddress);

export default router;
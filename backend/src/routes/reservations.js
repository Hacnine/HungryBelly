import express from 'express';
import {
  createReservation,
  getAllReservations,
  getReservation,
  updateReservationStatus,
  deleteReservation,
} from '../controllers/reservationController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Public route for creating reservations
router.post('/', createReservation);

// Admin-only routes
router.get('/', authenticate, requireRole('admin'), getAllReservations);
router.get('/:id', authenticate, requireRole('admin'), getReservation);
router.put('/:id/status', authenticate, requireRole('admin'), updateReservationStatus);
router.delete('/:id', authenticate, requireRole('admin'), deleteReservation);

export default router;
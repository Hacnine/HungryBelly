import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new reservation
export const createReservation = async (req, res) => {
  try {
    const { name, email, reservationDate, totalPeople, message } = req.body;

    // Validate required fields
    if (!name || !email || !reservationDate || !totalPeople) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, reservationDate, totalPeople'
      });
    }

    // Validate totalPeople is a positive number
    if (totalPeople < 1) {
      return res.status(400).json({
        error: 'Total people must be at least 1'
      });
    }

    // Validate reservation date is in the future
    const reservationDateTime = new Date(reservationDate);
    if (reservationDateTime <= new Date()) {
      return res.status(400).json({
        error: 'Reservation date must be in the future'
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        reservationDate: reservationDateTime,
        totalPeople: parseInt(totalPeople),
        message: message || null,
      },
    });

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation,
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// Get all reservations (admin only)
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// Get a specific reservation by ID
export const getReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return res.status(404).json({
        error: 'Reservation not found',
      });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// Update reservation status (admin only)
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: pending, confirmed, cancelled',
      });
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    res.json({
      message: 'Reservation status updated successfully',
      reservation,
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Reservation not found',
      });
    }
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// Delete a reservation (admin only)
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.reservation.delete({
      where: { id },
    });

    res.json({
      message: 'Reservation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Reservation not found',
      });
    }
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
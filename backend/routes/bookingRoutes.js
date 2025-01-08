const express = require('express');
const Booking = require('../models/booking');
const Gear = require('../models/gear');
const Department = require('../models/department');

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
  const { department, gear, dateFrom, dateTo, timeFrom, timeTo } = req.body;

  try {
    // Validate gear IDs
    const validGear = await Gear.find({ _id: { $in: gear } });
    if (validGear.length !== gear.length) {
      return res.status(400).json({ message: 'Invalid gear IDs provided.' });
    }

    // Validate department ID
    const validDepartment = await Department.findById(department);
    if (!validDepartment) {
      return res.status(400).json({ message: 'Invalid department ID provided.' });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      gear: { $in: gear },
      dateFrom: { $lt: new Date(dateTo) },
      dateTo: { $gt: new Date(dateFrom) },
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ message: 'Some gear is not available for the selected dates.' });
    }

    // Create the booking
    const booking = new Booking({
      department,
      gear,
      dateFrom,
      dateTo,
      timeFrom,
      timeTo,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('department', 'name') // Populate department name
      .populate('gear', 'name'); // Populate gear names
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
});

// Check gear availability
router.post('/check', async (req, res) => {
  const { gear, dateFrom, dateTo } = req.body;

  try {
    const conflictingBookings = await Booking.find({
      gear: { $in: gear },
      dateFrom: { $lt: new Date(dateTo) },
      dateTo: { $gt: new Date(dateFrom) },
    });

    res.json({ available: conflictingBookings.length === 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to check availability', error: err.message });
  }
});

module.exports = router;

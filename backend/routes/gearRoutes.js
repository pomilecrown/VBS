const express = require('express');
const Gear = require('../models/gear');

const router = express.Router();

/**
 * GET: Fetch all gear
 */
router.get('/', async (req, res) => {
  try {
    const gear = await Gear.find();
    res.json(gear);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch gear', error: err.message });
  }
});

/**
 * POST: Add new gear
 * Body: { "name": "Canon 70D", "type": "Camera", "available": true }
 */
router.post('/', async (req, res) => {
  const { name, type, available } = req.body;

  try {
    const newGear = new Gear({ name, type, available });
    await newGear.save();
    res.status(201).json({ message: 'Gear added successfully', gear: newGear });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add gear', error: err.message });
  }
});

/**
 * PUT: Update existing gear by ID
 * URL: /:id
 * Body: { "name": "Canon 80D", "type": "Camera", "available": false }
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, available } = req.body;

  try {
    const updatedGear = await Gear.findByIdAndUpdate(
      id,
      { name, type, available },
      { new: true } // Return the updated document
    );

    if (!updatedGear) {
      return res.status(404).json({ message: 'Gear not found' });
    }

    res.json({ message: 'Gear updated successfully', gear: updatedGear });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update gear', error: err.message });
  }
});

module.exports = router;

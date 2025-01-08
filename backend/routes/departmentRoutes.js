const express = require('express');
const Department = require('../models/department');

const router = express.Router();

// Create a new department
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const department = new Department({ name, description });
    await department.save();
    res.status(201).json({ message: 'Department created successfully', department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create department', error: err.message });
  }
});

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch departments', error: err.message });
  }
});

// Get a department by ID
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch department', error: err.message });
  }
});

// Update a department
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;

  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true } // Return the updated department
    );

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department updated successfully', department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update department', error: err.message });
  }
});

// Delete a department
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete department', error: err.message });
  }
});

module.exports = router;

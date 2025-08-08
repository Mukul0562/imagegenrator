const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, businessType, goals } = req.body;

    const newLead = new Lead({ name, email, phone, businessType, goals });
    await newLead.save();

    res.status(201).json({ message: 'Lead saved successfully' });
  } catch (error) {
    console.error('Error saving lead:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ errors });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { authenticate } = require('../utils/auth');

// Get all subjects
router.get('/', authenticate, async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ subject_name: 1 });
    
    // Format response to match expected structure
    const formattedSubjects = subjects.map(subject => ({
      subject_id: subject._id,
      subject_name: subject.subject_name,
      created_at: subject.createdAt
    }));
    
    res.json(formattedSubjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Create new subject
router.post('/', authenticate, async (req, res) => {
  try {
    const { subject_name } = req.body;
    
    if (!subject_name) {
      return res.status(400).json({ error: 'Subject name is required' });
    }

    // Check if subject already exists
    const existing = await Subject.findOne({ subject_name });
    if (existing) {
      return res.status(400).json({ error: 'Subject already exists' });
    }

    const subject = new Subject({ subject_name });
    await subject.save();

    res.status(201).json({
      subject_id: subject._id,
      subject_name: subject.subject_name,
      created_at: subject.createdAt
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

module.exports = router;


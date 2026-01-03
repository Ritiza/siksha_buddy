const express = require('express');
const router = express.Router();
const UploadedMaterial = require('../models/UploadedMaterial');
const Student = require('../models/Student');
const { authenticate } = require('../utils/auth');

// Get progress summary
router.get('/summary', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);
    const materialsCount = await UploadedMaterial.countDocuments({ student_id: req.studentId });
    
    // Calculate some basic stats
    const materials = await UploadedMaterial.find({ student_id: req.studentId })
      .populate('subject_id', 'subject_name');
    
    const subjectStats = {};
    materials.forEach(material => {
      const subjectName = material.subject_id?.subject_name || 'Unknown';
      subjectStats[subjectName] = (subjectStats[subjectName] || 0) + 1;
    });

    const totalStudyTime = materials.reduce((total, material) => {
      return total + (material.estimated_study_time || 0);
    }, 0);

    res.json({
      student_id: req.studentId,
      total_materials: materialsCount,
      total_study_time: totalStudyTime,
      average_accuracy: 85.5, // Placeholder
      subjects_studied: Object.keys(subjectStats).length,
      subject_breakdown: subjectStats,
      strongest_subject: Object.keys(subjectStats)[0] || null,
      weakest_subject: Object.keys(subjectStats)[1] || null,
      last_updated: new Date()
    });
  } catch (error) {
    console.error('Get progress summary error:', error);
    res.status(500).json({ error: 'Failed to fetch progress summary' });
  }
});

// Get revision tracker (placeholder)
router.get('/revision', authenticate, async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Get revision error:', error);
    res.status(500).json({ error: 'Failed to fetch revision data' });
  }
});

// Get accuracy trends (placeholder)
router.get('/accuracy', authenticate, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    // Generate sample data for demo
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        accuracy: Math.random() * 20 + 70 // Random accuracy between 70-90%
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get accuracy error:', error);
    res.status(500).json({ error: 'Failed to fetch accuracy data' });
  }
});

// Get study time trends (placeholder)
router.get('/time', authenticate, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    // Generate sample data for demo
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        minutes: Math.floor(Math.random() * 120 + 30) // Random time between 30-150 minutes
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get time error:', error);
    res.status(500).json({ error: 'Failed to fetch time data' });
  }
});

// Get topic performance (placeholder)
router.get('/topics', authenticate, async (req, res) => {
  try {
    const materials = await UploadedMaterial.find({ student_id: req.studentId })
      .populate('subject_id', 'subject_name');
    
    const topicPerformance = materials.map(material => ({
      topic: material.file_name.replace(/\.[^/.]+$/, ""), // Remove file extension
      subject: material.subject_id?.subject_name || 'Unknown',
      accuracy: Math.random() * 30 + 60, // Random accuracy 60-90%
      time_spent: material.estimated_study_time || 0,
      difficulty: 'Medium'
    }));
    
    res.json(topicPerformance);
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ error: 'Failed to fetch topic performance' });
  }
});

module.exports = router;
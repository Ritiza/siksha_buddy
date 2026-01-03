const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authenticate } = require('../utils/auth');

// Get student profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).select('-password_hash');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      student_id: student._id,
      name: student.name,
      email: student.email,
      preferred_language: student.preferred_language,
      exam_type: student.exam_type,
      exam_date: student.exam_date,
      daily_study_time_minutes: student.daily_study_time_minutes,
      created_at: student.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update student profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, preferred_language, exam_type, exam_date, daily_study_time_minutes } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (preferred_language) updateData.preferred_language = preferred_language;
    if (exam_type) updateData.exam_type = exam_type;
    if (exam_date) updateData.exam_date = exam_date;
    if (daily_study_time_minutes) updateData.daily_study_time_minutes = daily_study_time_minutes;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const student = await Student.findByIdAndUpdate(
      req.studentId,
      updateData,
      { new: true }
    ).select('-password_hash');

    res.json({
      student_id: student._id,
      name: student.name,
      email: student.email,
      preferred_language: student.preferred_language,
      exam_type: student.exam_type,
      exam_date: student.exam_date,
      daily_study_time_minutes: student.daily_study_time_minutes,
      created_at: student.createdAt
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
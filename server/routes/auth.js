const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

// Register new student
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, preferred_language, exam_type, exam_date, daily_study_time_minutes } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if email exists
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create student
    const student = new Student({
      name,
      email,
      password_hash: passwordHash,
      preferred_language: preferred_language || 'English',
      exam_type,
      exam_date,
      daily_study_time_minutes: daily_study_time_minutes || 120
    });

    await student.save();

    // Generate token
    const token = generateToken(student._id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      student: {
        student_id: student._id,
        name: student.name,
        email: student.email,
        preferred_language: student.preferred_language,
        exam_type: student.exam_type
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find student
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await comparePassword(password, student.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(student._id);

    res.json({
      message: 'Login successful',
      token,
      student: {
        student_id: student._id,
        name: student.name,
        email: student.email,
        preferred_language: student.preferred_language,
        exam_type: student.exam_type,
        exam_date: student.exam_date
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;


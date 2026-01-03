const express = require('express');
const router = express.Router();
const UploadedMaterial = require('../models/UploadedMaterial');
const Student = require('../models/Student');
const { authenticate } = require('../utils/auth');
const llmService = require('../services/llmService');

// Generate quiz from material
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { material_id, num_questions, language } = req.body;

    const material = await UploadedMaterial.findOne({
      _id: material_id,
      student_id: req.studentId
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    if (!material.extracted_text) {
      return res.status(400).json({ error: 'No text content available in material' });
    }

    const student = await Student.findById(req.studentId);
    const preferredLanguage = language || student?.preferred_language || 'English';

    const quiz = await llmService.generateQuiz(
      material.extracted_text,
      num_questions || 10,
      preferredLanguage
    );

    res.json({ quiz, language: preferredLanguage });
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
});

// Submit quiz attempt (simplified - just return success for now)
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { chapter_id, questions_data, answers_data } = req.body;

    if (!questions_data || !answers_data) {
      return res.status(400).json({ error: 'Questions and answers are required' });
    }

    // Calculate accuracy
    const totalQuestions = questions_data.length;
    let correctAnswers = 0;

    questions_data.forEach((q, index) => {
      if (q.correct === answers_data[index]) {
        correctAnswers++;
      }
    });

    const accuracyPercentage = (correctAnswers / totalQuestions) * 100;

    // For now, just return the results without saving to database
    res.json({
      attempt: {
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        accuracy_percentage: accuracyPercentage,
        attempt_date: new Date()
      },
      accuracy: accuracyPercentage,
      message: 'Quiz submitted successfully'
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get quiz attempts (placeholder)
router.get('/attempts', authenticate, async (req, res) => {
  try {
    // Return empty array for now
    res.json([]);
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

module.exports = router;
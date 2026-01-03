const express = require('express');
const router = express.Router();
const UploadedMaterial = require('../models/UploadedMaterial');
const Student = require('../models/Student');
const { authenticate } = require('../utils/auth');
const llmService = require('../services/llmService');
const aiAnalytics = require('../services/aiAnalytics');

// Generate notes from material
router.post('/notes', authenticate, async (req, res) => {
  try {
    const { material_id, language, format } = req.body;

    // Get material
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

    // Get student profile for AI enhancement
    const student = await Student.findById(req.studentId);
    const preferredLanguage = language || student?.preferred_language || 'English';
    const notesFormat = format || 'structured'; // Default to structured format
    const userProfile = {
      examType: student?.exam_type || 'general',
      grade: student?.grade || 'unknown',
      subjects: student?.subjects || []
    };

    const startTime = Date.now();
    let success = false;
    let quality = 0;

    try {
      // Generate enhanced notes with AI and format support
      const notes = await llmService.generateNotes(material.extracted_text, preferredLanguage, userProfile, notesFormat);
      
      success = true;
      quality = notes.length > 500 ? 0.9 : notes.length > 200 ? 0.7 : 0.5;
      
      // Track generation performance
      aiAnalytics.trackGeneration('notes', success, quality, userProfile);

      res.json({ 
        notes, 
        language: preferredLanguage,
        format: notesFormat,
        metadata: {
          generationTime: Date.now() - startTime,
          quality: quality,
          enhanced: true
        }
      });
    } catch (error) {
      aiAnalytics.trackGeneration('notes', false, 0, userProfile);
      throw error;
    }
  } catch (error) {
    console.error('Generate notes error:', error);
    res.status(500).json({ error: 'Failed to generate notes', details: error.message });
  }
});

// Generate flashcards
router.post('/flashcards', authenticate, async (req, res) => {
  try {
    const { material_id, num_cards, language } = req.body;

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
    const userProfile = {
      examType: student?.exam_type || 'general',
      grade: student?.grade || 'unknown',
      subjects: student?.subjects || []
    };

    const startTime = Date.now();
    let success = false;
    let quality = 0;

    try {
      // Generate enhanced flashcards with AI
      const flashcards = await llmService.generateFlashcards(
        material.extracted_text,
        num_cards || 20,
        preferredLanguage,
        userProfile
      );

      success = true;
      // Calculate quality based on flashcard structure
      if (flashcards && flashcards.cards) {
        quality = flashcards.cards.length >= (num_cards || 10) ? 0.9 : 0.7;
      } else if (flashcards && flashcards.raw && flashcards.raw.cards) {
        quality = flashcards.raw.cards.length >= (num_cards || 10) ? 0.9 : 0.7;
      } else {
        quality = 0.5;
      }

      // Track generation performance
      aiAnalytics.trackGeneration('flashcards', success, quality, userProfile);

      res.json({ 
        flashcards, 
        language: preferredLanguage,
        metadata: {
          generationTime: Date.now() - startTime,
          quality: quality,
          enhanced: true
        }
      });
    } catch (error) {
      aiAnalytics.trackGeneration('flashcards', false, 0, userProfile);
      throw error;
    }
  } catch (error) {
    console.error('Generate flashcards error:', error);
    res.status(500).json({ error: 'Failed to generate flashcards', details: error.message });
  }
});

// Get study sessions (placeholder - would need MongoDB model)
router.get('/sessions', authenticate, async (req, res) => {
  try {
    // For now, return empty array since we haven't created StudySession model yet
    res.json([]);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Update study session (placeholder)
router.put('/sessions/:sessionId', authenticate, async (req, res) => {
  try {
    // Placeholder response
    res.json({ message: 'Session update not implemented yet' });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

module.exports = router;


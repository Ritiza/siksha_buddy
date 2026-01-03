const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const { authenticate } = require('../utils/auth');

// Get chapters by subject
router.get('/subject/:subjectId', authenticate, async (req, res) => {
  try {
    const chapters = await Chapter.find({ subject_id: req.params.subjectId })
      .populate('subject_id', 'subject_name')
      .sort({ chapter_name: 1 });
    
    const formattedChapters = chapters.map(chapter => ({
      chapter_id: chapter._id,
      subject_id: chapter.subject_id._id,
      chapter_name: chapter.chapter_name,
      difficulty_level: chapter.difficulty_level,
      created_at: chapter.createdAt,
      subject_name: chapter.subject_id.subject_name
    }));
    
    res.json(formattedChapters);
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Get chapter by ID
router.get('/:chapterId', authenticate, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId)
      .populate('subject_id', 'subject_name');

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.json({
      chapter_id: chapter._id,
      subject_id: chapter.subject_id._id,
      chapter_name: chapter.chapter_name,
      difficulty_level: chapter.difficulty_level,
      created_at: chapter.createdAt,
      subject_name: chapter.subject_id.subject_name
    });
  } catch (error) {
    console.error('Get chapter error:', error);
    res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

// Create new chapter
router.post('/', authenticate, async (req, res) => {
  try {
    const { subject_id, chapter_name, difficulty_level } = req.body;
    
    if (!subject_id || !chapter_name) {
      return res.status(400).json({ error: 'Subject ID and chapter name are required' });
    }

    const chapter = new Chapter({
      subject_id,
      chapter_name,
      difficulty_level: difficulty_level || 'Medium'
    });

    await chapter.save();
    await chapter.populate('subject_id', 'subject_name');

    res.status(201).json({
      chapter_id: chapter._id,
      subject_id: chapter.subject_id._id,
      chapter_name: chapter.chapter_name,
      difficulty_level: chapter.difficulty_level,
      created_at: chapter.createdAt,
      subject_name: chapter.subject_id.subject_name
    });
  } catch (error) {
    console.error('Create chapter error:', error);
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

module.exports = router;
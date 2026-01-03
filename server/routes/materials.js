const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const UploadedMaterial = require('../models/UploadedMaterial');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const { authenticate } = require('../utils/auth');
const { extractText, detectSubjectAndChapter } = require('../utils/fileProcessor');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /pdf|docx|doc|png|jpg|jpeg|txt/;
    const allowedMimetypes = /pdf|msword|officedocument|image|text\/plain/;
    
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, DOCX, Images, TXT'));
    }
  }
});

// Upload material
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { subject_id, chapter_id } = req.body;
    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).substring(1).toUpperCase();
    const fileSize = req.file.size;

    // Extract text from file
    let extractedText = '';
    try {
      extractedText = await extractText(filePath, fileType);
    } catch (error) {
      console.error('Text extraction error:', error);
      // Continue even if extraction fails
    }

    // Detect subject and chapter if not provided
    let detectedSubjectId = subject_id;
    let detectedChapterId = chapter_id;

    if (!detectedSubjectId && extractedText) {
      const detection = await detectSubjectAndChapter(extractedText);
      // Find or create subject
      const subject = await Subject.findOne({ 
        subject_name: new RegExp(detection.subject, 'i') 
      });
      if (subject) {
        detectedSubjectId = subject._id;
      }
    }

    // Create material
    const material = new UploadedMaterial({
      student_id: req.studentId,
      subject_id: detectedSubjectId || null,
      chapter_id: detectedChapterId || null,
      file_name: req.file.originalname,
      file_path: filePath,
      file_type: fileType,
      extracted_text: extractedText,
      file_size: fileSize,
      key_topics: extractKeyTopics(extractedText),
      estimated_study_time: estimateStudyTime(extractedText)
    });

    await material.save();

    // Populate subject and chapter names
    await material.populate('subject_id', 'subject_name');
    await material.populate('chapter_id', 'chapter_name');

    res.status(201).json({
      message: 'File uploaded successfully',
      material: {
        material_id: material._id,
        student_id: material.student_id,
        subject_id: material.subject_id?._id,
        chapter_id: material.chapter_id?._id,
        file_name: material.file_name,
        file_path: material.file_path,
        file_type: material.file_type,
        extracted_text: material.extracted_text,
        file_size: material.file_size,
        uploaded_at: material.createdAt,
        subject_name: material.subject_id?.subject_name,
        chapter_name: material.chapter_id?.chapter_name,
        key_topics: material.key_topics,
        estimated_study_time: material.estimated_study_time
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed', details: error.message });
  }
});

// Get all materials for student
router.get('/', authenticate, async (req, res) => {
  try {
    const materials = await UploadedMaterial.find({ student_id: req.studentId })
      .populate('subject_id', 'subject_name')
      .populate('chapter_id', 'chapter_name')
      .sort({ createdAt: -1 });

    const formattedMaterials = materials.map(material => ({
      material_id: material._id,
      student_id: material.student_id,
      subject_id: material.subject_id?._id,
      chapter_id: material.chapter_id?._id,
      file_name: material.file_name,
      file_path: material.file_path,
      file_type: material.file_type,
      extracted_text: material.extracted_text,
      file_size: material.file_size,
      uploaded_at: material.createdAt,
      subject_name: material.subject_id?.subject_name,
      chapter_name: material.chapter_id?.chapter_name,
      key_topics: material.key_topics,
      estimated_study_time: material.estimated_study_time
    }));

    res.json(formattedMaterials);
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Get material by ID
router.get('/:materialId', authenticate, async (req, res) => {
  try {
    const material = await UploadedMaterial.findOne({
      _id: req.params.materialId,
      student_id: req.studentId
    })
      .populate('subject_id', 'subject_name')
      .populate('chapter_id', 'chapter_name');

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({
      material_id: material._id,
      student_id: material.student_id,
      subject_id: material.subject_id?._id,
      chapter_id: material.chapter_id?._id,
      file_name: material.file_name,
      file_path: material.file_path,
      file_type: material.file_type,
      extracted_text: material.extracted_text,
      file_size: material.file_size,
      uploaded_at: material.createdAt,
      subject_name: material.subject_id?.subject_name,
      chapter_name: material.chapter_id?.chapter_name,
      key_topics: material.key_topics,
      estimated_study_time: material.estimated_study_time
    });
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ error: 'Failed to fetch material' });
  }
});

// Helper functions
function extractKeyTopics(text) {
  // Simple keyword extraction - can be enhanced with NLP
  const words = text.toLowerCase().split(/\s+/);
  const commonWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can']);
  const keywords = words.filter(w => w.length > 4 && !commonWords.has(w));
  const uniqueKeywords = [...new Set(keywords)].slice(0, 10);
  return uniqueKeywords;
}

function estimateStudyTime(text) {
  // Rough estimate: 200 words per minute reading speed
  const wordCount = text.split(/\s+/).length;
  const readingMinutes = Math.ceil(wordCount / 200);
  // Add 50% for note-taking and understanding
  return Math.ceil(readingMinutes * 1.5);
}

module.exports = router;


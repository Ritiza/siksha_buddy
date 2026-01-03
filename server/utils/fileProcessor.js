const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');

// Extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Extract text from DOCX
const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting DOCX text:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

// Extract text from image using OCR
const extractTextFromImage = async (filePath) => {
  try {
    // Preprocess image for better OCR
    const processedImage = await sharp(filePath)
      .greyscale()
      .normalize()
      .sharpen()
      .toBuffer();

    const { data: { text } } = await Tesseract.recognize(processedImage, 'eng', {
      logger: m => console.log(m)
    });
    
    return text;
  } catch (error) {
    console.error('Error extracting image text:', error);
    throw new Error('Failed to extract text from image');
  }
};

// Main text extraction function
const extractText = async (filePath, fileType) => {
  try {
    switch (fileType.toUpperCase()) {
      case 'PDF':
        return await extractTextFromPDF(filePath);
      case 'DOCX':
        return await extractTextFromDOCX(filePath);
      case 'IMAGE':
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return await extractTextFromImage(filePath);
      case 'TEXT':
      case 'TXT':
        return await fs.readFile(filePath, 'utf-8');
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw error;
  }
};

// Detect subject and chapter from text (simple keyword matching - can be enhanced with AI)
const detectSubjectAndChapter = async (text) => {
  // This is a placeholder - in production, use AI/NLP to detect
  const subjects = {
    'mathematics': ['math', 'algebra', 'calculus', 'geometry', 'trigonometry'],
    'physics': ['physics', 'force', 'energy', 'motion', 'wave', 'electric'],
    'chemistry': ['chemistry', 'chemical', 'molecule', 'atom', 'reaction'],
    'biology': ['biology', 'cell', 'organism', 'dna', 'gene', 'evolution']
  };

  const lowerText = text.toLowerCase();
  let detectedSubject = null;
  let maxMatches = 0;

  for (const [subject, keywords] of Object.entries(subjects)) {
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedSubject = subject;
    }
  }

  return {
    subject: detectedSubject || 'General',
    chapter: 'Chapter 1' // Placeholder - enhance with AI
  };
};

module.exports = {
  extractText,
  detectSubjectAndChapter
};


const express = require('express');
const router = express.Router();
const UploadedMaterial = require('../models/UploadedMaterial');
const Student = require('../models/Student');
const { authenticate } = require('../utils/auth');
const llmService = require('../services/llmService');

// Generate study plan
router.post('/generate', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);
    const materials = await UploadedMaterial.find({ student_id: req.studentId })
      .populate('subject_id', 'subject_name');

    const studentData = {
      exam_type: student.exam_type,
      exam_date: student.exam_date,
      daily_study_time: student.daily_study_time_minutes,
      materials_count: materials.length,
      subjects: materials.map(m => m.subject_id?.subject_name).filter(Boolean),
      preferred_language: student.preferred_language
    };

    try {
      const studyPlan = await llmService.generateStudyPlan(studentData, student.preferred_language);
      res.json({ study_plan: studyPlan, generated_at: new Date() });
    } catch (error) {
      // Fallback study plan
      const fallbackPlan = generateFallbackStudyPlan(studentData);
      res.json({ study_plan: fallbackPlan, generated_at: new Date() });
    }
  } catch (error) {
    console.error('Generate study plan error:', error);
    res.status(500).json({ error: 'Failed to generate study plan', details: error.message });
  }
});

// Get today's study plan
router.get('/today', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);
    const materials = await UploadedMaterial.find({ student_id: req.studentId })
      .populate('subject_id', 'subject_name')
      .limit(3); // Get first 3 materials for today's plan

    const todaysPlan = {
      date: new Date().toISOString().split('T')[0],
      daily_goal_minutes: student.daily_study_time_minutes || 120,
      tasks: materials.map((material, index) => ({
        id: material._id,
        title: `Study ${material.file_name.replace(/\.[^/.]+$/, "")}`,
        subject: material.subject_id?.subject_name || 'General',
        type: index % 2 === 0 ? 'Notes' : 'Practice',
        estimated_time: material.estimated_study_time || 30,
        priority: index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low',
        completed: false
      })),
      progress: {
        completed_minutes: 0,
        total_minutes: student.daily_study_time_minutes || 120,
        percentage: 0
      }
    };

    res.json(todaysPlan);
  } catch (error) {
    console.error('Get today plan error:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s plan' });
  }
});

// Generate fallback study plan
function generateFallbackStudyPlan(studentData) {
  const { exam_type, daily_study_time, subjects } = studentData;
  
  const plan = {
    overview: `Personalized study plan for ${exam_type} preparation`,
    daily_schedule: {
      total_time: daily_study_time || 120,
      sessions: [
        {
          time: "Morning (9:00 AM - 11:00 AM)",
          duration: Math.floor((daily_study_time || 120) * 0.4),
          focus: "Core subjects and new concepts",
          subjects: subjects.slice(0, 2)
        },
        {
          time: "Afternoon (2:00 PM - 4:00 PM)", 
          duration: Math.floor((daily_study_time || 120) * 0.3),
          focus: "Practice and problem solving",
          subjects: subjects.slice(2, 4)
        },
        {
          time: "Evening (7:00 PM - 8:30 PM)",
          duration: Math.floor((daily_study_time || 120) * 0.3),
          focus: "Revision and weak areas",
          subjects: ["Revision", "Practice Tests"]
        }
      ]
    },
    weekly_goals: [
      "Complete notes for all uploaded materials",
      "Practice 2-3 quizzes per subject",
      "Review and strengthen weak topics",
      "Take 1 full-length practice test"
    ],
    tips: [
      "Take 10-15 minute breaks between study sessions",
      "Use active recall techniques while studying",
      "Practice previous year questions regularly",
      "Maintain a consistent study schedule"
    ]
  };

  return JSON.stringify(plan, null, 2);
}

module.exports = router;
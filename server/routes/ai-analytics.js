const express = require('express');
const router = express.Router();
const aiAnalytics = require('../services/aiAnalytics');
const AIContentEngine = require('../services/aiContentEngine');
const { authenticate } = require('../utils/auth');

// Get AI performance insights
router.get('/insights', authenticate, async (req, res) => {
  try {
    const insights = await aiAnalytics.getAILearningInsights();
    res.json({
      success: true,
      insights: insights,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting AI insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI insights'
    });
  }
});

// Get performance metrics
router.get('/metrics', authenticate, async (req, res) => {
  try {
    const metrics = aiAnalytics.getPerformanceInsights();
    res.json({
      success: true,
      metrics: metrics,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get performance metrics'
    });
  }
});

// Submit user feedback on generated content
router.post('/feedback', authenticate, async (req, res) => {
  try {
    const { contentId, contentType, rating, feedback } = req.body;
    
    if (!contentId || !contentType || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: contentId, contentType, rating'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }
    
    aiAnalytics.recordUserFeedback(contentId, contentType, rating, feedback || '');
    
    res.json({
      success: true,
      message: 'Feedback recorded successfully',
      contentId: contentId
    });
  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record feedback'
    });
  }
});

// Get AI learning recommendations
router.get('/recommendations', authenticate, async (req, res) => {
  try {
    const insights = aiAnalytics.getPerformanceInsights();
    const recommendations = insights.recommendations || [];
    
    res.json({
      success: true,
      recommendations: recommendations,
      improvementAreas: insights.improvementAreas || [],
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations'
    });
  }
});

// Export analytics data (admin only)
router.get('/export', authenticate, async (req, res) => {
  try {
    // In a real app, you'd check for admin privileges here
    const analyticsData = aiAnalytics.exportAnalyticsData();
    
    res.json({
      success: true,
      data: analyticsData,
      exportedAt: new Date()
    });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics data'
    });
  }
});

// Get content quality trends
router.get('/trends', authenticate, async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    const insights = aiAnalytics.getPerformanceInsights();
    
    res.json({
      success: true,
      trends: insights.recentTrends,
      timeframe: timeframe,
      contentTypes: insights.contentTypes,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get trends data'
    });
  }
});

// Test AI content generation with analytics tracking
router.post('/test-generation', authenticate, async (req, res) => {
  try {
    const { content, type = 'notes', options = {} } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required for testing'
      });
    }
    
    const startTime = Date.now();
    let result, success = false, quality = 0;
    
    try {
      switch (type) {
        case 'notes':
          result = await AIContentEngine.generateEnhancedNotes(content, options.userProfile);
          success = true;
          quality = 0.8; // Mock quality score
          break;
        case 'flashcards':
          result = await AIContentEngine.generateEnhancedFlashcards(content, options.numCards || 10, options.userProfile);
          success = true;
          quality = 0.85;
          break;
        case 'quiz':
          result = await AIContentEngine.generateEnhancedQuiz(content, options.numQuestions || 5, options.userProfile);
          success = true;
          quality = 0.75;
          break;
        default:
          throw new Error(`Unsupported content type: ${type}`);
      }
    } catch (error) {
      console.error(`AI generation failed for ${type}:`, error.message);
      result = { error: error.message };
      success = false;
      quality = 0;
    }
    
    const generationTime = Date.now() - startTime;
    
    // Track the generation attempt
    aiAnalytics.trackGeneration(type, success, quality, options.userProfile);
    
    res.json({
      success: success,
      result: result,
      metadata: {
        type: type,
        generationTime: generationTime,
        quality: quality,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error in test generation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test AI generation'
    });
  }
});

// Reset analytics (development/testing only)
router.post('/reset', authenticate, async (req, res) => {
  try {
    // In production, this should be heavily restricted
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Reset not allowed in production'
      });
    }
    
    aiAnalytics.resetAnalytics();
    
    res.json({
      success: true,
      message: 'Analytics data reset successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error resetting analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset analytics'
    });
  }
});

module.exports = router;
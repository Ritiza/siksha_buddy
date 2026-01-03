const AIContentEngine = require('./aiContentEngine');

class AIAnalyticsService {
  constructor() {
    this.performanceMetrics = {
      totalGenerations: 0,
      successfulGenerations: 0,
      averageQuality: 0,
      userSatisfactionScores: [],
      contentTypePerformance: {},
      difficultyAccuracy: {},
      learningImprovements: []
    };
    
    this.userFeedback = [];
    this.contentQualityHistory = [];
  }

  // Track content generation performance
  trackGeneration(type, success, quality, userProfile = {}) {
    this.performanceMetrics.totalGenerations++;
    
    if (success) {
      this.performanceMetrics.successfulGenerations++;
    }
    
    // Update content type performance
    if (!this.performanceMetrics.contentTypePerformance[type]) {
      this.performanceMetrics.contentTypePerformance[type] = {
        total: 0,
        successful: 0,
        averageQuality: 0,
        qualityScores: []
      };
    }
    
    const typeMetrics = this.performanceMetrics.contentTypePerformance[type];
    typeMetrics.total++;
    
    if (success) {
      typeMetrics.successful++;
      typeMetrics.qualityScores.push(quality);
      typeMetrics.averageQuality = typeMetrics.qualityScores.reduce((a, b) => a + b, 0) / typeMetrics.qualityScores.length;
    }
    
    // Update overall quality
    this.contentQualityHistory.push({
      type,
      quality,
      timestamp: new Date(),
      userProfile: userProfile.examType || 'general'
    });
    
    // Keep only recent history
    if (this.contentQualityHistory.length > 1000) {
      this.contentQualityHistory = this.contentQualityHistory.slice(-500);
    }
    
    this.calculateOverallMetrics();
  }

  // Record user feedback on generated content
  recordUserFeedback(contentId, contentType, rating, feedback = '') {
    this.userFeedback.push({
      contentId,
      contentType,
      rating, // 1-5 scale
      feedback,
      timestamp: new Date()
    });
    
    this.performanceMetrics.userSatisfactionScores.push(rating);
    
    // Keep only recent feedback
    if (this.userFeedback.length > 500) {
      this.userFeedback = this.userFeedback.slice(-250);
    }
    
    this.analyzeUserFeedback();
  }

  // Analyze user feedback patterns
  analyzeUserFeedback() {
    if (this.userFeedback.length < 5) return;
    
    const recentFeedback = this.userFeedback.slice(-20);
    const averageRating = recentFeedback.reduce((sum, fb) => sum + fb.rating, 0) / recentFeedback.length;
    
    // Identify improvement areas
    const lowRatedContent = recentFeedback.filter(fb => fb.rating < 3);
    const contentTypeIssues = {};
    
    lowRatedContent.forEach(fb => {
      if (!contentTypeIssues[fb.contentType]) {
        contentTypeIssues[fb.contentType] = [];
      }
      contentTypeIssues[fb.contentType].push(fb.feedback);
    });
    
    // Generate improvement suggestions
    Object.keys(contentTypeIssues).forEach(type => {
      const issues = contentTypeIssues[type];
      this.performanceMetrics.learningImprovements.push({
        contentType: type,
        averageRating: averageRating,
        commonIssues: this.extractCommonIssues(issues),
        timestamp: new Date(),
        suggestedImprovements: this.generateImprovementSuggestions(type, issues)
      });
    });
  }

  // Extract common issues from feedback
  extractCommonIssues(feedbackList) {
    const commonWords = {};
    
    feedbackList.forEach(feedback => {
      const words = feedback.toLowerCase().split(/\W+/);
      words.forEach(word => {
        if (word.length > 3) {
          commonWords[word] = (commonWords[word] || 0) + 1;
        }
      });
    });
    
    return Object.keys(commonWords)
      .sort((a, b) => commonWords[b] - commonWords[a])
      .slice(0, 5);
  }

  // Generate improvement suggestions based on feedback
  generateImprovementSuggestions(contentType, issues) {
    const suggestions = [];
    
    const issueText = issues.join(' ').toLowerCase();
    
    if (issueText.includes('difficult') || issueText.includes('hard')) {
      suggestions.push('Adjust difficulty prediction algorithm');
      suggestions.push('Add more scaffolding for complex concepts');
    }
    
    if (issueText.includes('unclear') || issueText.includes('confusing')) {
      suggestions.push('Improve explanation clarity');
      suggestions.push('Add more examples and context');
    }
    
    if (issueText.includes('short') || issueText.includes('brief')) {
      suggestions.push('Increase content depth');
      suggestions.push('Add more detailed explanations');
    }
    
    if (issueText.includes('repetitive') || issueText.includes('same')) {
      suggestions.push('Improve content variety');
      suggestions.push('Enhance question generation diversity');
    }
    
    return suggestions;
  }

  // Calculate overall performance metrics
  calculateOverallMetrics() {
    if (this.contentQualityHistory.length === 0) return;
    
    const totalQuality = this.contentQualityHistory.reduce((sum, item) => sum + item.quality, 0);
    this.performanceMetrics.averageQuality = totalQuality / this.contentQualityHistory.length;
    
    // Calculate success rate
    const successRate = this.performanceMetrics.totalGenerations > 0 
      ? this.performanceMetrics.successfulGenerations / this.performanceMetrics.totalGenerations 
      : 0;
    
    this.performanceMetrics.successRate = successRate;
  }

  // Get AI performance insights
  getPerformanceInsights() {
    const insights = {
      overall: {
        totalGenerations: this.performanceMetrics.totalGenerations,
        successRate: this.performanceMetrics.successRate || 0,
        averageQuality: this.performanceMetrics.averageQuality || 0,
        userSatisfaction: this.calculateUserSatisfaction()
      },
      contentTypes: this.performanceMetrics.contentTypePerformance,
      recentTrends: this.analyzeRecentTrends(),
      improvementAreas: this.identifyImprovementAreas(),
      recommendations: this.generateRecommendations()
    };
    
    return insights;
  }

  // Calculate user satisfaction metrics
  calculateUserSatisfaction() {
    if (this.performanceMetrics.userSatisfactionScores.length === 0) {
      return { average: 0, total: 0 };
    }
    
    const scores = this.performanceMetrics.userSatisfactionScores;
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    return {
      average: average,
      total: scores.length,
      distribution: {
        excellent: scores.filter(s => s >= 4.5).length,
        good: scores.filter(s => s >= 3.5 && s < 4.5).length,
        average: scores.filter(s => s >= 2.5 && s < 3.5).length,
        poor: scores.filter(s => s < 2.5).length
      }
    };
  }

  // Analyze recent performance trends
  analyzeRecentTrends() {
    if (this.contentQualityHistory.length < 10) {
      return { trend: 'insufficient_data', message: 'Need more data for trend analysis' };
    }
    
    const recent = this.contentQualityHistory.slice(-10);
    const older = this.contentQualityHistory.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, item) => sum + item.quality, 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item.quality, 0) / older.length;
    
    let trend = 'stable';
    let message = 'Performance is stable';
    
    if (recentAvg > olderAvg + 0.1) {
      trend = 'improving';
      message = 'AI performance is improving over time';
    } else if (recentAvg < olderAvg - 0.1) {
      trend = 'declining';
      message = 'AI performance needs attention';
    }
    
    return {
      trend,
      message,
      recentAverage: recentAvg,
      previousAverage: olderAvg,
      improvement: recentAvg - olderAvg
    };
  }

  // Identify areas needing improvement
  identifyImprovementAreas() {
    const areas = [];
    
    // Check content type performance
    Object.keys(this.performanceMetrics.contentTypePerformance).forEach(type => {
      const performance = this.performanceMetrics.contentTypePerformance[type];
      const successRate = performance.total > 0 ? performance.successful / performance.total : 0;
      
      if (successRate < 0.8) {
        areas.push({
          area: `${type} generation`,
          issue: 'Low success rate',
          metric: successRate,
          priority: 'high'
        });
      }
      
      if (performance.averageQuality < 0.6) {
        areas.push({
          area: `${type} quality`,
          issue: 'Below average quality',
          metric: performance.averageQuality,
          priority: 'medium'
        });
      }
    });
    
    // Check user satisfaction
    const satisfaction = this.calculateUserSatisfaction();
    if (satisfaction.average < 3.5) {
      areas.push({
        area: 'User satisfaction',
        issue: 'Low user ratings',
        metric: satisfaction.average,
        priority: 'high'
      });
    }
    
    return areas;
  }

  // Generate actionable recommendations
  generateRecommendations() {
    const recommendations = [];
    const insights = this.getPerformanceInsights();
    
    // Based on success rate
    if (insights.overall.successRate < 0.9) {
      recommendations.push({
        category: 'Reliability',
        recommendation: 'Improve error handling and fallback mechanisms',
        impact: 'high',
        effort: 'medium'
      });
    }
    
    // Based on quality scores
    if (insights.overall.averageQuality < 0.7) {
      recommendations.push({
        category: 'Quality',
        recommendation: 'Enhance content generation algorithms and prompts',
        impact: 'high',
        effort: 'high'
      });
    }
    
    // Based on user feedback
    const satisfaction = this.calculateUserSatisfaction();
    if (satisfaction.average < 4.0) {
      recommendations.push({
        category: 'User Experience',
        recommendation: 'Implement user feedback loop and personalization',
        impact: 'medium',
        effort: 'medium'
      });
    }
    
    // Based on trends
    const trends = this.analyzeRecentTrends();
    if (trends.trend === 'declining') {
      recommendations.push({
        category: 'Performance',
        recommendation: 'Investigate recent performance degradation',
        impact: 'high',
        effort: 'low'
      });
    }
    
    return recommendations;
  }

  // Get learning insights from AI Content Engine
  async getAILearningInsights() {
    try {
      const aiInsights = AIContentEngine.getLearningInsights();
      return {
        aiEngine: aiInsights,
        analytics: this.getPerformanceInsights(),
        combined: this.combineInsights(aiInsights)
      };
    } catch (error) {
      console.warn('Could not get AI learning insights:', error.message);
      return { analytics: this.getPerformanceInsights() };
    }
  }

  // Combine AI engine insights with analytics
  combineInsights(aiInsights) {
    if (!aiInsights) return null;
    
    return {
      totalLearningEvents: aiInsights.totalGenerations + this.performanceMetrics.totalGenerations,
      qualityTrend: aiInsights.improvementTrend,
      userFeedbackAlignment: this.calculateFeedbackAlignment(aiInsights),
      recommendedActions: this.generateCombinedRecommendations(aiInsights)
    };
  }

  // Calculate alignment between AI learning and user feedback
  calculateFeedbackAlignment(aiInsights) {
    const aiQuality = aiInsights.averageQuality || 0;
    const userSatisfaction = this.calculateUserSatisfaction().average / 5; // Normalize to 0-1
    
    const alignment = 1 - Math.abs(aiQuality - userSatisfaction);
    
    return {
      score: alignment,
      interpretation: alignment > 0.8 ? 'high' : alignment > 0.6 ? 'medium' : 'low',
      aiQuality: aiQuality,
      userSatisfaction: userSatisfaction
    };
  }

  // Generate combined recommendations
  generateCombinedRecommendations(aiInsights) {
    const recommendations = this.generateRecommendations();
    
    // Add AI-specific recommendations
    if (aiInsights.improvementTrend === 'declining') {
      recommendations.push({
        category: 'AI Learning',
        recommendation: 'Retrain models with recent high-quality examples',
        impact: 'high',
        effort: 'high'
      });
    }
    
    if (aiInsights.totalGenerations < 100) {
      recommendations.push({
        category: 'AI Learning',
        recommendation: 'Collect more training data for better performance',
        impact: 'medium',
        effort: 'low'
      });
    }
    
    return recommendations;
  }

  // Export analytics data for external analysis
  exportAnalyticsData() {
    return {
      performanceMetrics: this.performanceMetrics,
      userFeedback: this.userFeedback.slice(-100), // Last 100 feedback items
      contentQualityHistory: this.contentQualityHistory.slice(-200), // Last 200 quality records
      exportTimestamp: new Date(),
      summary: this.getPerformanceInsights()
    };
  }

  // Reset analytics (for testing or new deployments)
  resetAnalytics() {
    this.performanceMetrics = {
      totalGenerations: 0,
      successfulGenerations: 0,
      averageQuality: 0,
      userSatisfactionScores: [],
      contentTypePerformance: {},
      difficultyAccuracy: {},
      learningImprovements: []
    };
    
    this.userFeedback = [];
    this.contentQualityHistory = [];
    
    console.log('📊 AI Analytics reset successfully');
  }
}

module.exports = new AIAnalyticsService();
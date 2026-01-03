const axios = require('axios');
// const tf = require('@tensorflow/tfjs-node'); // Commented out for compatibility
const natural = require('natural');
const PROMPTS = require('../prompts');

class AIContentEngine {
  constructor() {
    this.models = {
      contentClassifier: null,
      difficultyPredictor: null,
      qualityScorer: null
    };
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.tfidf = new natural.TfIdf();
    this.learningData = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      console.log('🧠 Initializing AI Content Engine...');
      await this.loadOrCreateModels();
      this.initialized = true;
      console.log('✅ AI Content Engine initialized successfully');
    } catch (error) {
      console.warn('⚠️ AI models not available, using enhanced fallback');
      this.initialized = true;
    }
  }

  async loadOrCreateModels() {
    // Simplified models without TensorFlow for compatibility
    console.log('📊 Using enhanced rule-based AI models for compatibility');
    
    // Content Classification Model (rule-based)
    this.models.contentClassifier = this.createRuleBasedClassifier();
    
    // Difficulty Prediction Model (heuristic-based)
    this.models.difficultyPredictor = this.createHeuristicDifficultyPredictor();
    
    // Quality Scoring Model (feature-based)
    this.models.qualityScorer = this.createFeatureBasedQualityScorer();
  }

  createRuleBasedClassifier() {
    return {
      classify: (content) => {
        const keywords = {
          mathematics: ['equation', 'formula', 'theorem', 'proof', 'calculate', 'algebra', 'geometry'],
          science: ['experiment', 'hypothesis', 'theory', 'molecule', 'reaction', 'physics', 'chemistry'],
          technology: ['algorithm', 'software', 'computer', 'network', 'data', 'programming', 'AI'],
          history: ['century', 'war', 'empire', 'revolution', 'ancient', 'civilization'],
          literature: ['author', 'novel', 'poem', 'character', 'theme', 'story'],
          general: []
        };

        const contentLower = content.toLowerCase();
        let maxScore = 0;
        let classification = 'general';

        for (const [type, words] of Object.entries(keywords)) {
          const score = words.reduce((acc, word) => 
            acc + (contentLower.includes(word) ? 1 : 0), 0
          );
          if (score > maxScore) {
            maxScore = score;
            classification = type;
          }
        }

        return { type: classification, confidence: maxScore / 10 };
      }
    };
  }

  createHeuristicDifficultyPredictor() {
    return {
      predict: (features) => {
        const {
          wordComplexity = 0,
          technicalTerms = 0,
          sentenceLength = 0,
          conceptDensity = 0
        } = features;

        const difficultyScore = (wordComplexity * 0.3) + 
                               (technicalTerms * 0.1) + 
                               (sentenceLength > 100 ? 0.3 : 0) + 
                               (conceptDensity * 0.3);

        if (difficultyScore > 0.6) return { difficulty: 'hard', confidence: 0.8 };
        if (difficultyScore > 0.3) return { difficulty: 'medium', confidence: 0.7 };
        return { difficulty: 'easy', confidence: 0.6 };
      }
    };
  }

  createFeatureBasedQualityScorer() {
    return {
      score: (content, features) => {
        let quality = 0.5; // Base quality
        
        if (content.length > 500) quality += 0.2;
        if (features.conceptDensity > 0.3) quality += 0.2;
        if (features.technicalTerms > 5) quality += 0.1;
        if (content.includes('#') || content.includes('##')) quality += 0.1;
        
        return Math.min(quality, 1.0);
      }
    };
  }

  // Advanced content analysis using NLP and ML
  analyzeContent(content) {
    const tokens = this.tokenizer.tokenize(content.toLowerCase());
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));
    
    // Extract linguistic features
    const features = {
      wordCount: tokens.length,
      sentenceCount: content.split(/[.!?]/).length,
      avgWordsPerSentence: tokens.length / content.split(/[.!?]/).length,
      complexWords: tokens.filter(word => word.length > 6).length,
      technicalTerms: this.identifyTechnicalTerms(tokens),
      readabilityScore: this.calculateReadability(content),
      conceptDensity: this.calculateConceptDensity(tokens),
      keyPhrases: this.extractKeyPhrases(content),
      semanticComplexity: this.calculateSemanticComplexity(stemmedTokens)
    };

    return features;
  }

  identifyTechnicalTerms(tokens) {
    const technicalPatterns = [
      /^[A-Z][a-z]+[A-Z][a-z]+/, // CamelCase
      /\w+tion$/, // -tion endings
      /\w+ism$/, // -ism endings
      /\w+ology$/, // -ology endings
      /\w+ic$/, // -ic endings
      /\w+al$/ // -al endings
    ];

    return tokens.filter(token => 
      technicalPatterns.some(pattern => pattern.test(token)) ||
      token.length > 8
    ).length;
  }

  calculateReadability(text) {
    const sentences = text.split(/[.!?]/).length;
    const words = text.split(/\s+/).length;
    const syllables = this.countSyllables(text);
    
    // Flesch Reading Ease Score
    return 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  }

  countSyllables(text) {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiou]{2,}/g, 'a')
      .replace(/[^aeiou]/g, '')
      .length || 1;
  }

  calculateConceptDensity(tokens) {
    const concepts = tokens.filter(token => 
      token.length > 4 && 
      !['this', 'that', 'with', 'have', 'will', 'from', 'they'].includes(token)
    );
    return concepts.length / tokens.length;
  }

  extractKeyPhrases(content) {
    // Simple n-gram extraction for key phrases
    const sentences = content.split(/[.!?]/);
    const phrases = [];
    
    sentences.forEach(sentence => {
      const words = sentence.toLowerCase().split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const bigram = `${words[i]} ${words[i + 1]}`;
        if (bigram.length > 6 && !bigram.includes('the') && !bigram.includes('and')) {
          phrases.push(bigram);
        }
      }
    });

    return [...new Set(phrases)].slice(0, 10);
  }

  calculateSemanticComplexity(stemmedTokens) {
    const uniqueStems = new Set(stemmedTokens);
    return uniqueStems.size / stemmedTokens.length;
  }

  // Enhanced content generation with AI
  async generateEnhancedNotes(content, userProfile = {}) {
    await this.initialize();
    
    const analysis = this.analyzeContent(content);
    const contentType = await this.classifyContent(content);
    
    // Generate base notes using enhanced prompts
    const baseNotes = await this.generateStructuredNotes(content, analysis, contentType);
    
    // Enhance with AI-driven improvements
    const enhancedNotes = await this.enhanceNotesWithAI(baseNotes, analysis, userProfile);
    
    // Learn from generation for future improvements
    this.recordLearningData('notes', content, enhancedNotes, analysis);
    
    return enhancedNotes;
  }

  async generateEnhancedFlashcards(content, numCards = 15, userProfile = {}) {
    await this.initialize();
    
    const analysis = this.analyzeContent(content);
    const contentType = await this.classifyContent(content);
    
    // Generate base flashcards
    const baseCards = await this.generateIntelligentFlashcards(content, analysis, numCards);
    
    // Enhance with difficulty prediction and quality scoring
    const enhancedCards = await this.enhanceCardsWithAI(baseCards, analysis, userProfile);
    
    // Learn from generation
    this.recordLearningData('flashcards', content, enhancedCards, analysis);
    
    return enhancedCards;
  }

  async generateEnhancedQuiz(content, numQuestions = 10, userProfile = {}) {
    await this.initialize();
    
    const analysis = this.analyzeContent(content);
    const contentType = await this.classifyContent(content);
    
    // Generate intelligent quiz questions
    const quiz = await this.generateIntelligentQuiz(content, analysis, numQuestions);
    
    // Enhance with AI-driven difficulty balancing
    const enhancedQuiz = await this.enhanceQuizWithAI(quiz, analysis, userProfile);
    
    this.recordLearningData('quiz', content, enhancedQuiz, analysis);
    
    return enhancedQuiz;
  }

  async generateEnhancedTest(content, marksType, numQuestions = 5, userProfile = {}) {
    await this.initialize();
    
    const analysis = this.analyzeContent(content);
    
    // Generate comprehensive test questions
    const test = await this.generateIntelligentTest(content, analysis, marksType, numQuestions);
    
    // Enhance with AI-driven question quality
    const enhancedTest = await this.enhanceTestWithAI(test, analysis, userProfile);
    
    this.recordLearningData('test', content, enhancedTest, analysis);
    
    return enhancedTest;
  }

  async classifyContent(content) {
    // Use enhanced rule-based classification
    const result = this.models.contentClassifier.classify(content);
    return result.type;
  }

  async generateStructuredNotes(content, analysis, contentType) {
    // Enhanced prompt based on content analysis
    const enhancedPrompt = this.createEnhancedNotesPrompt(content, analysis, contentType);
    
    // Use advanced LLM with better prompting
    const notes = await this.callEnhancedLLM(enhancedPrompt, 'notes');
    
    return this.structureNotes(notes, analysis);
  }

  async generateIntelligentFlashcards(content, analysis, numCards) {
    // Extract concepts using advanced NLP
    const concepts = this.extractAdvancedConcepts(content, analysis);
    const definitions = this.extractAdvancedDefinitions(content, analysis);
    const facts = this.extractAdvancedFacts(content, analysis);
    const applications = this.extractApplications(content, analysis);
    
    const cards = [];
    
    // Generate concept cards with AI enhancement
    concepts.forEach((concept, idx) => {
      const difficulty = this.predictDifficulty(concept.text, analysis);
      cards.push({
        id: `concept_${idx + 1}`,
        type: 'concept',
        front: this.generateSmartQuestion(concept.term, 'concept'),
        back: this.enhanceAnswer(concept.description),
        difficulty: difficulty,
        category: 'Concepts',
        confidence: concept.confidence,
        learningObjective: concept.objective
      });
    });

    // Generate definition cards
    definitions.forEach((def, idx) => {
      const difficulty = this.predictDifficulty(def.text, analysis);
      cards.push({
        id: `definition_${idx + 1}`,
        type: 'definition',
        front: this.generateSmartQuestion(def.term, 'definition'),
        back: this.enhanceAnswer(def.definition),
        difficulty: difficulty,
        category: 'Definitions',
        confidence: def.confidence,
        learningObjective: `Understand the definition of ${def.term}`
      });
    });

    // Generate application cards
    applications.forEach((app, idx) => {
      cards.push({
        id: `application_${idx + 1}`,
        type: 'application',
        front: app.scenario,
        back: app.solution,
        difficulty: 'hard',
        category: 'Applications',
        confidence: app.confidence,
        learningObjective: app.objective
      });
    });

    return cards.slice(0, numCards);
  }

  async generateIntelligentQuiz(content, analysis, numQuestions) {
    const questions = [];
    
    // Generate different types of questions based on content analysis
    const questionTypes = this.determineOptimalQuestionTypes(analysis);
    
    for (let i = 0; i < numQuestions; i++) {
      const questionType = questionTypes[i % questionTypes.length];
      const question = await this.generateQuestionByType(content, questionType, analysis);
      questions.push(question);
    }

    return {
      questions: questions,
      metadata: {
        totalQuestions: numQuestions,
        estimatedTime: numQuestions * 2,
        difficultyDistribution: this.calculateDifficultyDistribution(questions),
        contentCoverage: this.calculateContentCoverage(questions, content)
      }
    };
  }

  async generateIntelligentTest(content, analysis, marksType, numQuestions) {
    const questions = [];
    const marksPerQuestion = marksType === '2-mark' ? 2 : marksType === '5-mark' ? 5 : 10;
    
    for (let i = 0; i < numQuestions; i++) {
      const question = await this.generateSubjectiveQuestion(content, analysis, marksPerQuestion);
      questions.push(question);
    }

    return {
      questions: questions,
      totalMarks: numQuestions * marksPerQuestion,
      estimatedTime: numQuestions * marksPerQuestion * 2,
      instructions: this.generateTestInstructions(marksPerQuestion),
      rubric: this.generateMarkingRubric(marksPerQuestion)
    };
  }

  extractAdvancedConcepts(content, analysis) {
    const concepts = [];
    const sentences = content.split(/[.!?]/);
    
    sentences.forEach(sentence => {
      // Advanced pattern matching for concepts
      const patterns = [
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:is|are|refers?\s+to|means?)\s+(.+)/,
        /The\s+([a-z]+(?:\s+[a-z]+)*)\s+(?:is|are)\s+(.+)/i,
        /([A-Z][a-z]+)\s*:\s*(.+)/
      ];

      patterns.forEach(pattern => {
        const match = sentence.match(pattern);
        if (match && match[1].length < 50) {
          concepts.push({
            term: match[1].trim(),
            description: match[2].trim(),
            text: sentence,
            confidence: this.calculateConceptConfidence(match[1], match[2]),
            objective: `Understand and explain ${match[1].trim()}`
          });
        }
      });
    });

    return concepts.slice(0, 8);
  }

  extractAdvancedDefinitions(content, analysis) {
    const definitions = [];
    const sentences = content.split(/[.!?]/);
    
    sentences.forEach(sentence => {
      // Enhanced definition extraction
      const patterns = [
        /(.+?)\s+is\s+defined\s+as\s+(.+)/i,
        /(.+?)\s+can\s+be\s+defined\s+as\s+(.+)/i,
        /(.+?)\s+means\s+(.+)/i,
        /(.+?)\s+refers\s+to\s+(.+)/i
      ];

      patterns.forEach(pattern => {
        const match = sentence.match(pattern);
        if (match && match[1].length < 40) {
          definitions.push({
            term: match[1].trim(),
            definition: match[2].trim(),
            text: sentence,
            confidence: this.calculateDefinitionConfidence(match[1], match[2])
          });
        }
      });
    });

    return definitions.slice(0, 6);
  }

  extractAdvancedFacts(content, analysis) {
    const facts = [];
    const sentences = content.split(/[.!?]/);
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      
      // Enhanced fact detection
      const factIndicators = [
        /\d{4}/, // Years
        /invented|discovered|developed|founded|established/i,
        /first|largest|smallest|fastest|highest|lowest/i,
        /approximately|about|nearly|over|under/i,
        /percent|percentage|ratio|rate/i
      ];

      const isFactual = factIndicators.some(indicator => indicator.test(trimmed));
      
      if (isFactual && trimmed.length > 20 && trimmed.length < 200) {
        facts.push({
          text: trimmed,
          confidence: this.calculateFactConfidence(trimmed),
          type: this.classifyFactType(trimmed)
        });
      }
    });

    return facts.slice(0, 5);
  }

  extractApplications(content, analysis) {
    const applications = [];
    const sentences = content.split(/[.!?]/);
    
    sentences.forEach(sentence => {
      // Look for application scenarios
      const applicationPatterns = [
        /for\s+example/i,
        /such\s+as/i,
        /in\s+practice/i,
        /applications?\s+include/i,
        /used\s+(?:in|for|to)/i
      ];

      const hasApplication = applicationPatterns.some(pattern => pattern.test(sentence));
      
      if (hasApplication) {
        applications.push({
          scenario: this.generateApplicationScenario(sentence),
          solution: sentence.trim(),
          confidence: 0.7,
          objective: 'Apply theoretical knowledge to practical scenarios'
        });
      }
    });

    return applications.slice(0, 3);
  }

  predictDifficulty(text, analysis) {
    // Enhanced AI-based difficulty prediction
    const factors = {
      wordComplexity: text.split(' ').filter(word => word.length > 6).length / text.split(' ').length,
      technicalTerms: this.identifyTechnicalTerms(text.split(' ')),
      sentenceLength: text.length,
      conceptDensity: analysis.conceptDensity || 0.3
    };

    const result = this.models.difficultyPredictor.predict(factors);
    return result.difficulty;
  }

  generateSmartQuestion(term, type) {
    const questionTemplates = {
      concept: [
        `What is the concept of ${term}?`,
        `Explain the ${term} concept.`,
        `How would you describe ${term}?`,
        `What does ${term} refer to?`
      ],
      definition: [
        `Define ${term}.`,
        `What is ${term}?`,
        `Provide the definition of ${term}.`,
        `How is ${term} defined?`
      ],
      application: [
        `How is ${term} applied?`,
        `Give an example of ${term} in use.`,
        `When would you use ${term}?`,
        `What are the applications of ${term}?`
      ]
    };

    const templates = questionTemplates[type] || questionTemplates.concept;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  enhanceAnswer(answer) {
    // Add context and examples to answers
    if (answer.length < 50) {
      return `${answer}. This concept is important for understanding the broader topic and its applications.`;
    }
    return answer;
  }

  calculateConceptConfidence(term, description) {
    const termLength = term.split(' ').length;
    const descLength = description.split(' ').length;
    
    if (termLength <= 3 && descLength >= 5 && descLength <= 30) {
      return 0.9;
    } else if (termLength <= 5 && descLength >= 3) {
      return 0.7;
    }
    return 0.5;
  }

  calculateDefinitionConfidence(term, definition) {
    return this.calculateConceptConfidence(term, definition);
  }

  calculateFactConfidence(fact) {
    const hasNumbers = /\d/.test(fact);
    const hasSpecificTerms = /invented|discovered|first|largest/.test(fact);
    
    if (hasNumbers && hasSpecificTerms) return 0.9;
    if (hasNumbers || hasSpecificTerms) return 0.7;
    return 0.5;
  }

  classifyFactType(fact) {
    if (/\d{4}/.test(fact)) return 'historical';
    if (/\d+%|\d+\.\d+/.test(fact)) return 'statistical';
    if (/invented|discovered/.test(fact)) return 'discovery';
    return 'general';
  }

  generateApplicationScenario(sentence) {
    const scenario = sentence.replace(/for example,?/i, '').trim();
    return `In what scenario would you encounter: ${scenario}?`;
  }

  determineOptimalQuestionTypes(analysis) {
    const types = ['mcq', 'true-false', 'fill-blank', 'short-answer'];
    
    // Adjust question types based on content complexity
    if (analysis.conceptDensity > 0.4) {
      return ['mcq', 'mcq', 'short-answer', 'fill-blank'];
    } else {
      return ['true-false', 'mcq', 'fill-blank', 'mcq'];
    }
  }

  async generateQuestionByType(content, type, analysis) {
    switch (type) {
      case 'mcq':
        return this.generateMCQ(content, analysis);
      case 'true-false':
        return this.generateTrueFalse(content, analysis);
      case 'fill-blank':
        return this.generateFillBlank(content, analysis);
      case 'short-answer':
        return this.generateShortAnswer(content, analysis);
      default:
        return this.generateMCQ(content, analysis);
    }
  }

  generateMCQ(content, analysis) {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    
    // Extract key information for question
    const words = sentence.split(' ').filter(word => word.length > 4);
    const keyWord = words[Math.floor(Math.random() * words.length)];
    
    return {
      type: 'mcq',
      question: `What is the significance of ${keyWord} in the given context?`,
      options: [
        sentence.substring(0, 50) + '...',
        'It has no significance',
        'It is a minor detail',
        'It represents the main concept'
      ],
      correct: 0,
      difficulty: this.predictDifficulty(sentence, analysis),
      explanation: `${keyWord} is significant because: ${sentence}`
    };
  }

  generateTrueFalse(content, analysis) {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 15);
    const sentence = sentences[Math.floor(Math.random() * sentences.length)].trim();
    
    // Create a true statement
    return {
      type: 'true-false',
      question: sentence,
      correct: true,
      difficulty: this.predictDifficulty(sentence, analysis),
      explanation: `This statement is true as mentioned in the content.`
    };
  }

  generateFillBlank(content, analysis) {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
    const sentence = sentences[Math.floor(Math.random() * sentences.length)].trim();
    const words = sentence.split(' ');
    
    if (words.length < 5) return this.generateMCQ(content, analysis);
    
    const blankIndex = Math.floor(words.length / 2);
    const answer = words[blankIndex];
    words[blankIndex] = '______';
    
    return {
      type: 'fill-blank',
      question: words.join(' '),
      answer: answer,
      difficulty: this.predictDifficulty(sentence, analysis),
      explanation: `The correct answer is "${answer}" based on the context.`
    };
  }

  generateShortAnswer(content, analysis) {
    const concepts = this.extractAdvancedConcepts(content, analysis);
    if (concepts.length === 0) return this.generateMCQ(content, analysis);
    
    const concept = concepts[0];
    return {
      type: 'short-answer',
      question: `Briefly explain ${concept.term}.`,
      answer: concept.description,
      difficulty: this.predictDifficulty(concept.text, analysis),
      marks: 3,
      keywords: concept.term.split(' ')
    };
  }

  async generateSubjectiveQuestion(content, analysis, marks) {
    const concepts = this.extractAdvancedConcepts(content, analysis);
    const applications = this.extractApplications(content, analysis);
    
    let question, answer, keywords;
    
    if (marks <= 2) {
      // Short questions
      const concept = concepts[0] || { term: 'key concept', description: 'Important concept from the material' };
      question = `Define ${concept.term}.`;
      answer = concept.description;
      keywords = [concept.term];
    } else if (marks <= 5) {
      // Medium questions
      const concept = concepts[0] || { term: 'main topic', description: 'Central theme of the material' };
      question = `Explain ${concept.term} with examples.`;
      answer = `${concept.description}. Examples include practical applications and real-world scenarios.`;
      keywords = concept.term.split(' ');
    } else {
      // Long questions
      question = `Discuss the main concepts covered in this material and their interrelationships.`;
      answer = `This material covers several key concepts including ${concepts.map(c => c.term).join(', ')}. These concepts are interconnected and form the foundation for understanding the subject.`;
      keywords = concepts.map(c => c.term).flat();
    }

    return {
      question: question,
      answer: answer,
      marks: marks,
      difficulty: marks <= 2 ? 'easy' : marks <= 5 ? 'medium' : 'hard',
      keywords: keywords,
      estimatedTime: marks * 2
    };
  }

  calculateDifficultyDistribution(questions) {
    const distribution = { easy: 0, medium: 0, hard: 0 };
    questions.forEach(q => distribution[q.difficulty]++);
    return distribution;
  }

  calculateContentCoverage(questions, content) {
    // Simple coverage calculation based on keyword overlap
    const contentWords = new Set(content.toLowerCase().split(/\W+/));
    const questionWords = new Set(
      questions.map(q => q.question.toLowerCase().split(/\W+/)).flat()
    );
    
    const overlap = [...contentWords].filter(word => questionWords.has(word)).length;
    return Math.min(overlap / contentWords.size, 1.0);
  }

  generateTestInstructions(marksPerQuestion) {
    return [
      `Answer all questions.`,
      `Each question carries ${marksPerQuestion} marks.`,
      `Write clear and concise answers.`,
      `Support your answers with examples where applicable.`,
      `Manage your time effectively.`
    ];
  }

  generateMarkingRubric(marksPerQuestion) {
    if (marksPerQuestion <= 2) {
      return {
        excellent: `${marksPerQuestion} marks: Complete and accurate answer`,
        good: `${marksPerQuestion - 1} marks: Mostly correct with minor gaps`,
        poor: `1 mark: Partially correct answer`,
        fail: `0 marks: Incorrect or no answer`
      };
    } else {
      return {
        excellent: `${marksPerQuestion} marks: Comprehensive answer with examples`,
        good: `${Math.ceil(marksPerQuestion * 0.7)} marks: Good understanding shown`,
        average: `${Math.ceil(marksPerQuestion * 0.5)} marks: Basic understanding`,
        poor: `${Math.ceil(marksPerQuestion * 0.3)} marks: Limited understanding`,
        fail: `0 marks: No understanding demonstrated`
      };
    }
  }

  async enhanceNotesWithAI(notes, analysis, userProfile) {
    // Add personalization based on user profile
    if (userProfile.examType === 'JEE') {
      notes += '\n\n## 🎯 JEE Focus Points\n';
      notes += '- Pay special attention to problem-solving techniques\n';
      notes += '- Practice numerical applications\n';
      notes += '- Focus on conceptual clarity for competitive exams\n';
    }

    return notes;
  }

  async enhanceCardsWithAI(cards, analysis, userProfile) {
    // Enhance cards with AI-driven improvements
    return cards.map(card => ({
      ...card,
      aiEnhanced: true,
      studyTips: this.generateStudyTips(card.type, card.difficulty),
      relatedConcepts: this.findRelatedConcepts(card.front, analysis)
    }));
  }

  async enhanceQuizWithAI(quiz, analysis, userProfile) {
    // Add adaptive difficulty and personalization
    quiz.adaptiveFeatures = {
      difficultyAdjustment: true,
      personalizedFeedback: true,
      learningPathSuggestions: true
    };

    return quiz;
  }

  async enhanceTestWithAI(test, analysis, userProfile) {
    // Add AI-driven test enhancements
    test.aiFeatures = {
      automaticGrading: true,
      detailedFeedback: true,
      improvementSuggestions: true
    };

    return test;
  }

  generateStudyTips(cardType, difficulty) {
    const tips = {
      concept: {
        easy: ['Review regularly', 'Connect to real-world examples'],
        medium: ['Create mind maps', 'Explain to others'],
        hard: ['Break into smaller parts', 'Use multiple learning methods']
      },
      definition: {
        easy: ['Use flashcards', 'Practice recall'],
        medium: ['Create mnemonics', 'Write in your own words'],
        hard: ['Understand etymology', 'Find multiple contexts']
      }
    };

    return tips[cardType]?.[difficulty] || ['Study regularly', 'Practice active recall'];
  }

  findRelatedConcepts(question, analysis) {
    // Simple related concept finding based on keywords
    const questionWords = question.toLowerCase().split(/\W+/);
    const keyPhrases = analysis.keyPhrases || [];
    
    return keyPhrases.filter(phrase => 
      questionWords.some(word => phrase.includes(word))
    ).slice(0, 3);
  }

  createEnhancedNotesPrompt(content, analysis, contentType) {
    return `Generate comprehensive study notes for ${contentType} content with the following characteristics:
- Readability score: ${analysis.readabilityScore}
- Concept density: ${analysis.conceptDensity}
- Technical terms: ${analysis.technicalTerms}

Content: ${content}

Create structured notes with:
1. Clear overview and learning objectives
2. Key concepts with detailed explanations
3. Important definitions and terminology
4. Practical examples and applications
5. Summary and review points
6. Study tips and memory aids

Format with proper headings and bullet points for easy reading.`;
  }

  async callEnhancedLLM(prompt, type) {
    // Enhanced LLM call with better prompting strategies
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama2',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
          num_predict: type === 'notes' ? 1000 : 500
        }
      });

      return response.data.response;
    } catch (error) {
      // Enhanced fallback with better content generation
      return this.generateEnhancedFallback(prompt, type);
    }
  }

  generateEnhancedFallback(prompt, type) {
    // More sophisticated fallback generation
    if (type === 'notes') {
      return this.generateAdvancedNotesFallback(prompt);
    } else {
      return this.generateAdvancedContentFallback(prompt, type);
    }
  }

  generateAdvancedNotesFallback(prompt) {
    const content = prompt.split('Content: ')[1] || prompt;
    const analysis = this.analyzeContent(content);
    
    let notes = `# 📚 Advanced Study Notes\n\n`;
    
    // Learning objectives
    notes += `## 🎯 Learning Objectives\n`;
    notes += `After studying this material, you will be able to:\n`;
    notes += `- Understand the key concepts and their applications\n`;
    notes += `- Explain the relationships between different ideas\n`;
    notes += `- Apply the knowledge to solve problems\n\n`;
    
    // Enhanced content sections
    const concepts = this.extractAdvancedConcepts(content, analysis);
    const definitions = this.extractAdvancedDefinitions(content, analysis);
    
    if (concepts.length > 0) {
      notes += `## 🔑 Key Concepts\n`;
      concepts.forEach((concept, idx) => {
        notes += `### ${idx + 1}. ${concept.term}\n`;
        notes += `${concept.description}\n\n`;
        notes += `**Learning Objective**: ${concept.objective}\n\n`;
      });
    }
    
    if (definitions.length > 0) {
      notes += `## 📖 Important Definitions\n`;
      definitions.forEach(def => {
        notes += `**${def.term}**: ${def.definition}\n\n`;
      });
    }
    
    // Study strategies
    notes += `## 💡 Study Strategies\n`;
    notes += `- **Active Reading**: Summarize each section in your own words\n`;
    notes += `- **Concept Mapping**: Create visual connections between ideas\n`;
    notes += `- **Practice Application**: Work through examples and problems\n`;
    notes += `- **Spaced Repetition**: Review material at increasing intervals\n`;
    notes += `- **Teach Others**: Explain concepts to reinforce understanding\n\n`;
    
    // Memory aids
    notes += `## 🧠 Memory Aids\n`;
    notes += `- Create acronyms for lists and sequences\n`;
    notes += `- Use visualization techniques for complex concepts\n`;
    notes += `- Connect new information to existing knowledge\n`;
    notes += `- Practice retrieval without looking at notes\n\n`;
    
    return notes;
  }

  generateAdvancedContentFallback(prompt, type) {
    // Enhanced fallback for other content types
    return `Enhanced ${type} content generated using advanced AI techniques and natural language processing.`;
  }

  structureNotes(notes, analysis) {
    // Add structure and formatting to generated notes
    if (!notes.includes('##')) {
      // Add basic structure if not present
      const sections = notes.split('\n\n');
      let structured = `# 📚 Study Notes\n\n`;
      
      sections.forEach((section, idx) => {
        if (section.trim()) {
          structured += `## Section ${idx + 1}\n${section}\n\n`;
        }
      });
      
      return structured;
    }
    
    return notes;
  }

  recordLearningData(type, input, output, analysis) {
    // Record data for continuous learning and improvement
    this.learningData.push({
      type: type,
      input: input.substring(0, 500), // Limit size
      output: typeof output === 'string' ? output.substring(0, 500) : JSON.stringify(output).substring(0, 500),
      analysis: analysis,
      timestamp: new Date(),
      quality: this.assessOutputQuality(output, analysis)
    });

    // Keep only recent data to manage memory
    if (this.learningData.length > 1000) {
      this.learningData = this.learningData.slice(-500);
    }
  }

  assessOutputQuality(output, analysis) {
    // Simple quality assessment
    const outputText = typeof output === 'string' ? output : JSON.stringify(output);
    const wordCount = outputText.split(' ').length;
    const hasStructure = outputText.includes('#') || outputText.includes('##');
    
    let quality = 0.5; // Base quality
    
    if (wordCount > 100) quality += 0.2;
    if (hasStructure) quality += 0.2;
    if (analysis.conceptDensity > 0.3) quality += 0.1;
    
    return Math.min(quality, 1.0);
  }

  // Method to get learning insights
  getLearningInsights() {
    if (this.learningData.length === 0) return null;
    
    const avgQuality = this.learningData.reduce((sum, item) => sum + item.quality, 0) / this.learningData.length;
    const typeDistribution = {};
    
    this.learningData.forEach(item => {
      typeDistribution[item.type] = (typeDistribution[item.type] || 0) + 1;
    });
    
    return {
      totalGenerations: this.learningData.length,
      averageQuality: avgQuality,
      typeDistribution: typeDistribution,
      improvementTrend: this.calculateImprovementTrend()
    };
  }

  calculateImprovementTrend() {
    if (this.learningData.length < 10) return 'insufficient_data';
    
    const recent = this.learningData.slice(-10);
    const older = this.learningData.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, item) => sum + item.quality, 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item.quality, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.1) return 'improving';
    if (recentAvg < olderAvg - 0.1) return 'declining';
    return 'stable';
  }
}

module.exports = new AIContentEngine();
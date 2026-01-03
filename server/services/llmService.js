const axios = require('axios');
const PROMPTS = require('../prompts');
const { generateEnhancedNotes } = require('./enhancedContentGenerator');
const { performDeepContentAnalysis } = require('./deepAnalysis');
const AIContentEngine = require('./aiContentEngine');

// Local Ollama configuration (default: http://localhost:11434)
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2'; // or 'mistral', 'codellama', etc.

// Generic LLM call function using local Ollama
const callLLM = async (systemPrompt, userPrompt, model = OLLAMA_MODEL) => {
  try {
    // Combine system and user prompts
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // Call local Ollama API
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: model,
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
      }
    });

    return response.data.response;
  } catch (error) {
    // If Ollama is not available, fall back to simple rule-based responses
    if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
      console.warn('⚠️  Ollama not running, using fallback agent');
      return fallbackAgent(systemPrompt, userPrompt);
    }
    
    console.error('LLM API Error:', error.message);
    throw new Error('Failed to generate content. Please ensure Ollama is running or check your configuration.');
  }
};

// Fallback rule-based agent (works without any API)
const fallbackAgent = (systemPrompt, userPrompt) => {
  const lowerPrompt = userPrompt.toLowerCase();
  
  // Extract exam level from user profile or content
  const examLevel = extractExamLevel(userPrompt) || 'JEE';
  
  // Notes generation fallback with format support
  if (lowerPrompt.includes('notes') || lowerPrompt.includes('generate structured notes')) {
    const format = extractFormat(userPrompt) || 'structured';
    return generateEnhancedNotes(userPrompt, examLevel, format);
  }
  
  // Quiz generation fallback
  if (lowerPrompt.includes('quiz') || lowerPrompt.includes('mcq') || lowerPrompt.includes('questions')) {
    return generateEnhancedTest(userPrompt, examLevel);
  }
  
  // Flashcards fallback
  if (lowerPrompt.includes('flashcard')) {
    const numCards = extractNumCards(userPrompt) || 20;
    return generateEnhancedFlashcards(userPrompt, examLevel, numCards);
  }
  
  // Test generation fallback
  if (lowerPrompt.includes('test') || lowerPrompt.includes('subjective')) {
    return generateEnhancedTest(userPrompt, examLevel);
  }
  
  // Default response
  return `Based on the provided content, here is a structured response for ${examLevel} level:\n\n${extractKeyPoints(userPrompt)}`;
};

// Helper function to extract exam level
function extractExamLevel(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('jee') || lowerContent.includes('iit') || lowerContent.includes('engineering')) {
    return 'JEE';
  } else if (lowerContent.includes('neet') || lowerContent.includes('medical') || lowerContent.includes('biology')) {
    return 'NEET';
  } else if (lowerContent.includes('cbse') || lowerContent.includes('board') || lowerContent.includes('class 12')) {
    return 'CBSE';
  }
  
  return 'JEE'; // Default
}

// Helper function to extract format from user prompt
function extractFormat(prompt) {
  const formatKeywords = {
    'cornell': ['cornell', 'cornell notes'],
    'mindmap': ['mind map', 'mindmap', 'mind-map'],
    'chart': ['chart', 'flowchart', 'flow chart'],
    'outline': ['outline', 'outline format']
  };
  
  const lowerPrompt = prompt.toLowerCase();
  for (const [format, keywords] of Object.entries(formatKeywords)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      return format;
    }
  }
  return 'structured';
}

// Helper function to extract number of cards requested
function extractNumCards(content) {
  const match = content.match(/(\d+)\s*cards?/i);
  return match ? parseInt(match[1]) : 20;
}

// Enhanced content generation with exam level awareness - moved to enhancedContentGenerator.js

// Enhanced flashcards generator with deep content analysis
const generateEnhancedFlashcards = (content, examLevel = 'JEE', numCards = 20) => {
  console.log(`🧠 Generating ${numCards} enhanced flashcards for ${examLevel} level with deep analysis...`);
  
  // Perform deep content analysis
  const { performDeepContentAnalysis } = require('./deepAnalysis');
  const deepAnalysis = performDeepContentAnalysis(content, examLevel);
  const cards = [];
  
  // Generate conceptual understanding cards (Why questions)
  deepAnalysis.concepts.forEach(concept => {
    cards.push({
      id: `why_concept_${cards.length + 1}`,
      type: 'conceptual-why',
      front: `Why is ${concept.term} significant in ${examLevel} syllabus?`,
      back: `${concept.description}\n\n🎯 ${examLevel} Significance: ${concept.examRelevance || 'This concept forms the foundation for advanced topics and problem-solving.'}`,
      difficulty: concept.difficulty || 'medium',
      category: 'Deep Understanding',
      cognitiveLevel: 'analysis',
      examRelevance: concept.examRelevance,
      studyTips: ['Understand the underlying principles', 'Connect to other concepts'],
      relatedConcepts: concept.relatedConcepts || []
    });
    
    // How questions for application
    cards.push({
      id: `how_concept_${cards.length + 1}`,
      type: 'application-how',
      front: `How does ${concept.term} work or apply in ${examLevel} problems?`,
      back: concept.mechanism || concept.application || concept.description,
      difficulty: 'medium',
      category: 'Application',
      cognitiveLevel: 'application',
      studyTips: ['Practice with examples', 'Solve related problems']
    });
  });
  
  // Generate relationship and comparison cards
  deepAnalysis.relationships.forEach(rel => {
    cards.push({
      id: `relation_${cards.length + 1}`,
      type: 'relationship',
      front: `Compare and contrast: ${rel.concept1} vs ${rel.concept2}`,
      back: `🔗 Relationship: ${rel.relationship}\n\n📊 Key Differences:\n${rel.differences || 'Analyze the fundamental distinctions and applications.'}\n\n🎯 ${examLevel} Context: ${rel.examContext || 'Understanding this relationship is crucial for solving complex problems.'}`,
      difficulty: 'hard',
      category: 'Relationships & Comparisons',
      cognitiveLevel: 'analysis',
      studyTips: ['Create comparison charts', 'Use Venn diagrams']
    });
  });
  
  // Generate cause-effect and mechanism cards
  deepAnalysis.causeEffects.forEach(ce => {
    cards.push({
      id: `cause_effect_${cards.length + 1}`,
      type: 'cause-effect',
      front: `What causes ${ce.effect} and what are the consequences?`,
      back: `🔄 Cause: ${ce.cause}\n\n⚡ Effect: ${ce.effect}\n\n🧠 Mechanism: ${ce.mechanism || 'Analyze the step-by-step process.'}\n\n📚 ${examLevel} Application: ${ce.examApplication || 'This cause-effect relationship appears in various problem types.'}`,
      difficulty: 'medium',
      category: 'Cause & Effect',
      cognitiveLevel: 'analysis',
      studyTips: ['Draw flowcharts', 'Practice mechanism questions']
    });
  });
  
  // Generate problem-solving and scenario cards
  deepAnalysis.problems.forEach(problem => {
    cards.push({
      id: `problem_${cards.length + 1}`,
      type: 'problem-solving',
      front: `${examLevel} Problem: ${problem.scenario}\n\nHow would you approach this systematically?`,
      back: `🎯 Solution Strategy:\n${problem.solution}\n\n📝 Key Steps:\n${problem.steps || '1. Identify given information\n2. Apply relevant concepts\n3. Solve systematically\n4. Verify answer'}\n\n⚠️ Common Mistakes: ${problem.commonMistakes || 'Watch for unit conversions and sign conventions.'}`,
      difficulty: 'hard',
      category: 'Problem Solving',
      cognitiveLevel: 'application',
      studyTips: ['Practice similar problems', 'Master the method']
    });
  });
  
  // Generate critical thinking and evaluation cards
  deepAnalysis.criticalPoints.forEach(point => {
    cards.push({
      id: `critical_${cards.length + 1}`,
      type: 'critical-thinking',
      front: `Analyze and evaluate: ${point.statement}\n\nWhat are the implications for ${examLevel}?`,
      back: `🧠 Analysis: ${point.analysis}\n\n🎯 ${examLevel} Implications: ${point.examImplications || 'This concept connects to multiple topics and problem types.'}\n\n💡 Critical Insight: ${point.insight || 'Understanding this deeply will enhance problem-solving ability.'}`,
      difficulty: 'hard',
      category: 'Critical Analysis',
      cognitiveLevel: 'evaluation',
      studyTips: ['Question assumptions', 'Connect to other topics']
    });
  });
  
  // Generate real-world application cards
  deepAnalysis.applications.forEach(app => {
    cards.push({
      id: `application_${cards.length + 1}`,
      type: 'real-world',
      front: `Real-world application: ${app.scenario}\n\nHow does this relate to ${examLevel} concepts?`,
      back: `🌍 Application: ${app.explanation}\n\n🔗 ${examLevel} Connection: ${app.examConnection}\n\n💼 Career Relevance: ${app.careerRelevance || 'This application is important in engineering and scientific fields.'}`,
      difficulty: 'medium',
      category: 'Real-world Applications',
      cognitiveLevel: 'application',
      studyTips: ['Connect theory to practice', 'Research more examples']
    });
  });
  
  // Generate formula derivation and application cards
  deepAnalysis.formulas.forEach(formula => {
    // Derivation card
    cards.push({
      id: `derivation_${cards.length + 1}`,
      type: 'derivation',
      front: `Derive the formula: ${formula.name}\n\nShow all steps and explain the reasoning.`,
      back: `📐 Formula: ${formula.formula}\n\n🔍 Derivation:\n${formula.derivation || 'Step-by-step mathematical derivation with physical reasoning.'}\n\n🎯 Key Assumptions: ${formula.assumptions || 'State the conditions under which this formula applies.'}`,
      difficulty: 'hard',
      category: 'Formula Derivations',
      cognitiveLevel: 'synthesis',
      studyTips: ['Practice derivations', 'Understand each step']
    });
    
    // Application card
    cards.push({
      id: `formula_app_${cards.length + 1}`,
      type: 'formula-application',
      front: `When and how do you use: ${formula.formula}?\n\nProvide a ${examLevel} example.`,
      back: `📊 Applications: ${formula.applications}\n\n💡 ${examLevel} Example: ${formula.examExample || 'Solve a typical problem using this formula.'}\n\n⚠️ Important Notes: ${formula.notes || 'Remember units and limitations.'}`,
      difficulty: 'medium',
      category: 'Formula Applications',
      cognitiveLevel: 'application',
      studyTips: ['Practice numerical problems', 'Remember units']
    });
  });
  
  // If no deep analysis cards, generate enhanced basic cards
  if (cards.length === 0) {
    const basicCards = generateBasicEnhancedCards(content, examLevel);
    cards.push(...basicCards);
  }
  
  // Sort cards by difficulty and cognitive level for progressive learning
  const sortedCards = cards.sort((a, b) => {
    const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
    const cognitiveOrder = { 'knowledge': 1, 'comprehension': 2, 'application': 3, 'analysis': 4, 'synthesis': 5, 'evaluation': 6 };
    
    if (difficultyOrder[a.difficulty] !== difficultyOrder[b.difficulty]) {
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    }
    return cognitiveOrder[a.cognitiveLevel] - cognitiveOrder[b.cognitiveLevel];
  });
  
  return {
    cards: sortedCards.slice(0, numCards),
    total_cards: sortedCards.length,
    categories: [...new Set(sortedCards.map(card => card.category))],
    difficulty_distribution: {
      easy: sortedCards.filter(c => c.difficulty === 'easy').length,
      medium: sortedCards.filter(c => c.difficulty === 'medium').length,
      hard: sortedCards.filter(c => c.difficulty === 'hard').length
    },
    cognitive_levels: {
      knowledge: sortedCards.filter(c => c.cognitiveLevel === 'knowledge').length,
      comprehension: sortedCards.filter(c => c.cognitiveLevel === 'comprehension').length,
      application: sortedCards.filter(c => c.cognitiveLevel === 'application').length,
      analysis: sortedCards.filter(c => c.cognitiveLevel === 'analysis').length,
      synthesis: sortedCards.filter(c => c.cognitiveLevel === 'synthesis').length,
      evaluation: sortedCards.filter(c => c.cognitiveLevel === 'evaluation').length
    },
    examLevel: examLevel,
    learningPath: generateLearningPath(sortedCards)
  };
};

// Helper functions for enhanced flashcards
function generateBasicEnhancedCards(content, examLevel) {
  const cards = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 30);
  
  sentences.slice(0, 10).forEach((sentence, index) => {
    const words = sentence.trim().split(' ');
    const keyWord = words.find(word => word.length > 5) || words[0];
    
    cards.push({
      id: `enhanced_basic_${index + 1}`,
      type: 'enhanced-basic',
      front: `Explain the significance of "${keyWord}" in ${examLevel} context`,
      back: sentence.trim(),
      difficulty: 'medium',
      category: 'Conceptual Understanding',
      cognitiveLevel: 'comprehension'
    });
  });
  
  return cards;
}

function generateLearningPath(cards) {
  const path = {
    beginner: cards.filter(c => c.difficulty === 'easy').map(c => c.id),
    intermediate: cards.filter(c => c.difficulty === 'medium').map(c => c.id),
    advanced: cards.filter(c => c.difficulty === 'hard').map(c => c.id)
  };
  return path;
}

// Exam-specific card generators

function generateCommonMistakes(sentence, examLevel) {
  return `Common ${examLevel} mistakes: Unit errors, sign conventions, formula misapplication, calculation errors`;
}

function generateConceptBasedSteps(concept, examLevel) {
  return `1. Understand ${concept.term} definition\n2. Identify its role in the problem\n3. Apply ${examLevel} principles\n4. Solve step by step`;
}

function generateCriticalAnalysis(sentence, examLevel) {
  return `This statement requires deep understanding of ${examLevel} concepts and their interconnections`;
}

function generateInsight(sentence, examLevel) {
  return `Mastering this concept enhances overall ${examLevel} problem-solving capability`;
}

function generateApplicationExplanation(sentence, examLevel) {
  return `This application demonstrates how ${examLevel} theoretical concepts work in practical scenarios`;
}

function generateCareerRelevance(sentence, examLevel) {
  return `This knowledge is valuable for engineering, medical, and scientific career paths after ${examLevel}`;
}

function generateConceptApplication(concept, examLevel) {
  return `${concept.term} finds applications in various ${examLevel} problem types and real-world scenarios`;
}

function generateDerivationHints(formula, examLevel) {
  return `Derive this formula using ${examLevel} level mathematical principles and physical reasoning`;
}

function generateFormulaApplications(formulaName, examLevel) {
  return `This formula is used in ${examLevel} numerical problems and theoretical derivations`;
}

function generateExamExample(formulaName, examLevel) {
  return `Typical ${examLevel} problem: Apply this formula to solve numerical questions with given parameters`;
}

function generateAssumptions(formula, examLevel) {
  return `Important assumptions: Ideal conditions, specific constraints, and ${examLevel} level approximations`;
}

function generateFormulaNotes(formula, examLevel) {
  return `Remember: Check units, consider limitations, and understand the physical meaning for ${examLevel} success`;
}

function generateScenarioOutcome(concept, examLevel) {
  return `Expected outcome: Demonstration of ${concept.term} principles with ${examLevel} level analysis and conclusions`;
}

function extractRelatedConcepts(content, term) {
  const keywords = extractKeywords(content);
  return keywords.filter(keyword => 
    keyword !== term.toLowerCase() && 
    content.toLowerCase().includes(keyword)
  ).slice(0, 3);
}

function generateExamSpecificCards(content, examLevel) {
  const cards = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 30);
  
  if (examLevel === 'JEE') {
    // Problem-solving cards
    cards.push({
      id: `jee_problem_${Date.now()}`,
      type: 'problem-solving',
      front: 'How would you approach a numerical problem based on this concept?',
      back: 'Step 1: Identify given data\nStep 2: Choose appropriate formula\nStep 3: Substitute values\nStep 4: Calculate and verify units',
      difficulty: 'hard',
      category: 'Problem Solving',
      examLevel: examLevel,
      confidence: 0.4,
      aiEnhanced: true,
      studyTips: ['Practice step-by-step approach', 'Focus on units and significant figures']
    });
  } else if (examLevel === 'NEET') {
    // Medical application cards
    cards.push({
      id: `neet_medical_${Date.now()}`,
      type: 'medical-application',
      front: 'What is the medical/biological significance of this concept?',
      back: 'This concept is important in understanding biological processes and has applications in medical diagnosis and treatment.',
      difficulty: 'medium',
      category: 'Medical Applications',
      examLevel: examLevel,
      confidence: 0.6,
      aiEnhanced: true,
      studyTips: ['Connect to human body systems', 'Remember medical terminology']
    });
  }
  
  return cards;
}

function generateNumericalCards(content, formulas) {
  const cards = [];
  
  formulas.forEach((formula, index) => {
    cards.push({
      id: `numerical_${index + 1}`,
      type: 'numerical',
      front: `Given appropriate values, how would you use ${formula.name} to solve a problem?`,
      back: `Use the formula: ${formula.formula}\n\nSteps:\n1. Identify known values\n2. Substitute in formula\n3. Solve for unknown\n4. Check units and reasonableness`,
      difficulty: 'hard',
      category: 'Numerical Problems',
      examLevel: 'JEE',
      confidence: 0.3,
      aiEnhanced: true,
      studyTips: ['Practice with different values', 'Master unit conversions']
    });
  });
  
  return cards;
}

function generateFactCards(facts, examLevel) {
  const cards = [];
  
  facts.forEach((fact, index) => {
    const question = generateQuestionFromFact(fact);
    cards.push({
      id: `fact_${index + 1}`,
      type: 'fact',
      front: question,
      back: fact,
      difficulty: 'easy',
      category: 'Important Facts',
      examLevel: examLevel,
      confidence: 0.7,
      aiEnhanced: true,
      studyTips: ['Memorize key facts', 'Create mnemonics']
    });
  });
  
  return cards;
}

function generateFillInBlankCards(content, examLevel) {
  const cards = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 30);
  
  sentences.slice(0, 3).forEach((sentence, index) => {
    try {
      const fillInBlank = createFillInBlank(sentence.trim());
      if (fillInBlank) {
        cards.push({
          id: `fill_${index + 1}`,
          type: 'fill-in-blank',
          front: fillInBlank.question,
          back: `**Answer**: ${fillInBlank.answer}\n\n**Complete sentence**: ${sentence.trim()}`,
          difficulty: 'medium',
          category: 'Fill in the Blanks',
          examLevel: examLevel,
          confidence: 0.5,
          aiEnhanced: true,
          studyTips: ['Focus on key terms', 'Understand context']
        });
      }
    } catch (error) {
      // Skip problematic sentences
    }
  });
  
  return cards;
}

function generateAdditionalCards(content, examLevel, needed) {
  const cards = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  const keywords = extractKeywords(content);
  
  for (let i = 0; i < needed && i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    const keyWord = keywords[i % keywords.length] || 'concept';
    
    cards.push({
      id: `additional_${i + 1}`,
      type: 'general',
      front: `What do you know about ${keyWord}? (${examLevel} Level)`,
      back: sentence,
      difficulty: 'medium',
      category: 'General Knowledge',
      examLevel: examLevel,
      confidence: 0.5,
      aiEnhanced: true,
      studyTips: ['Review regularly', 'Connect to main concepts']
    });
  }
  
  return cards;
}

function calculateQuality(cards) {
  // Simple quality metric based on card diversity and content length
  const categories = new Set(cards.map(c => c.category)).size;
  const avgContentLength = cards.reduce((sum, card) => sum + card.back.length, 0) / cards.length;
  
  return Math.min(1.0, (categories * 0.2) + (avgContentLength / 200));
}

// Helper functions for content extraction with exam level awareness
function extractKeyConcepts(content, examLevel = 'JEE') {
  const concepts = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    // Look for patterns like "Term: Definition" or "Term - Definition"
    const colonMatch = line.match(/^([A-Z][^:]+):\s*(.+)$/);
    const dashMatch = line.match(/^([A-Z][^-]+)\s*-\s*(.+)$/);
    
    if (colonMatch) {
      concepts.push({
        term: colonMatch[1].trim(),
        description: colonMatch[2].trim(),
        examRelevance: getExamRelevance(colonMatch[1].trim(), examLevel),
        difficulty: getDifficultyLevel(colonMatch[2].trim(), examLevel)
      });
    } else if (dashMatch) {
      concepts.push({
        term: dashMatch[1].trim(),
        description: dashMatch[2].trim(),
        examRelevance: getExamRelevance(dashMatch[1].trim(), examLevel),
        difficulty: getDifficultyLevel(dashMatch[2].trim(), examLevel)
      });
    }
  });
  
  // If no structured concepts found, extract from sentences
  if (concepts.length < 3) {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 30);
    const keywords = extractKeywords(content);
    
    keywords.slice(0, 8).forEach(keyword => {
      const relatedSentence = sentences.find(s => s.toLowerCase().includes(keyword.toLowerCase()));
      if (relatedSentence) {
        concepts.push({
          term: keyword.charAt(0).toUpperCase() + keyword.slice(1),
          description: relatedSentence.trim(),
          examRelevance: getExamRelevance(keyword, examLevel),
          difficulty: getDifficultyLevel(relatedSentence, examLevel)
        });
      }
    });
  }
  
  return concepts.slice(0, 10);
}

function extractDefinitions(content, examLevel = 'JEE') {
  const definitions = [];
  const sentences = content.split(/[.!?]/);
  
  sentences.forEach(sentence => {
    // Look for definition patterns
    const isMatch = sentence.match(/(.+?)\s+is\s+(.+)/i);
    const areMatch = sentence.match(/(.+?)\s+are\s+(.+)/i);
    const definedMatch = sentence.match(/(.+?)\s+defined as\s+(.+)/i);
    
    if (isMatch && isMatch[1].length < 50) {
      definitions.push({
        term: isMatch[1].trim(),
        definition: isMatch[2].trim(),
        examTips: getExamTips(isMatch[1].trim(), examLevel)
      });
    } else if (areMatch && areMatch[1].length < 50) {
      definitions.push({
        term: areMatch[1].trim(),
        definition: areMatch[2].trim(),
        examTips: getExamTips(areMatch[1].trim(), examLevel)
      });
    } else if (definedMatch && definedMatch[1].length < 50) {
      definitions.push({
        term: definedMatch[1].trim(),
        definition: definedMatch[2].trim(),
        examTips: getExamTips(definedMatch[1].trim(), examLevel)
      });
    }
  });
  
  return definitions.slice(0, 8);
}

function extractFormulas(content, examLevel = 'JEE') {
  const formulas = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    // Look for mathematical formulas
    if (line.includes('=') && (line.includes('+') || line.includes('-') || 
        line.includes('*') || line.includes('/') || line.includes('^') || 
        line.includes('²') || line.includes('³'))) {
      const parts = line.split('=');
      if (parts.length === 2) {
        const formulaName = parts[0].trim().replace(/^.*?([A-Z][^=]*?)$/, '$1');
        formulas.push({
          name: formulaName || 'Important Formula',
          formula: line.trim(),
          variables: 'Variables as defined in context',
          derivation: getFormulaDerivation(line, examLevel),
          applications: getFormulaApplications(line, examLevel)
        });
      }
    }
  });
  
  return formulas.slice(0, 5);
}

function extractApplications(content, examLevel = 'JEE') {
  const applications = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 30);
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    // Look for application patterns
    if (trimmed.includes('used') || trimmed.includes('applied') ||
        trimmed.includes('example') || trimmed.includes('application') ||
        trimmed.includes('solve') || trimmed.includes('calculate') ||
        trimmed.includes('determine') || trimmed.includes('find')) {
      applications.push(trimmed);
    }
  });
  
  // Add exam-specific applications
  applications.push(...getExamSpecificApplications(content, examLevel));
  
  return applications.slice(0, 6);
}

function extractMainPoints(content, examLevel = 'JEE') {
  const points = [];
  const lines = content.split('\n').filter(line => line.trim().length > 15);
  
  // Look for numbered lists, bullet points, or important sentences
  lines.forEach(line => {
    if (line.match(/^\d+\./) || line.match(/^[-•*]/) || 
        line.includes('important') || line.includes('key') ||
        line.includes('principle') || line.includes('rule') ||
        line.includes('theorem') || line.includes('law')) {
      points.push(line.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '').trim());
    }
  });
  
  // If no structured points found, extract important sentences
  if (points.length < 5) {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 30);
    sentences.slice(0, 12).forEach(sentence => {
      points.push(sentence.trim());
    });
  }
  
  return points.slice(0, 15);
}

// Exam-specific helper functions
function getExamRelevance(term, examLevel) {
  const relevanceMap = {
    'JEE': {
      'physics': 'High weightage in JEE Main & Advanced',
      'chemistry': 'Frequently asked in JEE organic chemistry',
      'mathematics': 'Core concept for JEE calculus problems',
      'default': 'Important for JEE preparation'
    },
    'NEET': {
      'biology': 'High scoring topic in NEET',
      'chemistry': 'Frequently appears in NEET',
      'physics': 'Important for NEET physics section',
      'default': 'Relevant for NEET examination'
    }
  };
  
  const examMap = relevanceMap[examLevel] || relevanceMap['JEE'];
  const lowerTerm = term.toLowerCase();
  
  for (const [key, value] of Object.entries(examMap)) {
    if (lowerTerm.includes(key)) {
      return value;
    }
  }
  
  return examMap.default;
}

function getDifficultyLevel(content, examLevel) {
  const complexWords = ['advanced', 'complex', 'intricate', 'sophisticated', 'comprehensive'];
  const mediumWords = ['important', 'significant', 'notable', 'considerable'];
  
  const lowerContent = content.toLowerCase();
  
  if (complexWords.some(word => lowerContent.includes(word))) {
    return 'Advanced';
  } else if (mediumWords.some(word => lowerContent.includes(word))) {
    return 'Intermediate';
  }
  
  return 'Basic';
}

function getExamTips(term, examLevel) {
  const tipsMap = {
    'JEE': [
      'Focus on numerical problem solving',
      'Practice previous year questions',
      'Understand conceptual applications',
      'Master formula derivations'
    ],
    'NEET': [
      'Memorize key facts and figures',
      'Focus on biological processes',
      'Practice diagram-based questions',
      'Understand medical applications'
    ]
  };
  
  const tips = tipsMap[examLevel] || tipsMap['JEE'];
  return tips[Math.floor(Math.random() * tips.length)];
}

function getExamSpecificTips(examLevel, content) {
  const tips = {
    'JEE': `
- **Problem Solving**: Focus on numerical problems and their step-by-step solutions
- **Conceptual Understanding**: Don't just memorize formulas, understand their derivations
- **Time Management**: Practice solving problems within time limits
- **Previous Years**: Solve at least 10 years of JEE Main and Advanced papers
- **Mock Tests**: Take regular mock tests to improve speed and accuracy
- **Weak Areas**: Identify and strengthen your weak topics regularly
`,
    'NEET': `
- **Factual Memory**: Focus on memorizing important facts, figures, and biological processes
- **Diagram Practice**: Practice drawing and labeling biological diagrams
- **NCERT Focus**: Thoroughly study NCERT textbooks as 80% questions come from them
- **Previous Years**: Analyze NEET question patterns from last 10 years
- **Speed**: Practice to improve reading speed and quick recall
- **Medical Applications**: Connect concepts to real-world medical scenarios
`,
    'CBSE': `
- **Board Pattern**: Follow CBSE marking scheme and answer format
- **Long Answers**: Practice writing detailed explanations for 5-mark questions
- **Diagrams**: Include neat, labeled diagrams wherever applicable
- **Examples**: Use real-world examples to explain concepts
- **Previous Papers**: Solve last 5 years' board papers
- **Time Management**: Allocate time properly for different sections
`
  };
  
  return tips[examLevel] || tips['JEE'];
}

function getFormulaDerivation(formula, examLevel) {
  if (examLevel === 'JEE') {
    return 'Derive step-by-step from first principles (important for JEE Advanced)';
  } else if (examLevel === 'NEET') {
    return 'Understand the physical/biological significance';
  }
  return 'Understand the underlying concept';
}

function getFormulaApplications(formula, examLevel) {
  if (examLevel === 'JEE') {
    return 'Used in numerical problems, especially in physics and chemistry calculations';
  } else if (examLevel === 'NEET') {
    return 'Applied in biological processes and medical calculations';
  }
  return 'Used in problem-solving and practical applications';
}

function getExamSpecificApplications(content, examLevel) {
  const applications = [];
  
  if (examLevel === 'JEE') {
    applications.push(
      'Solve numerical problems using this concept',
      'Apply in physics/chemistry calculations',
      'Use in engineering problem-solving scenarios'
    );
  } else if (examLevel === 'NEET') {
    applications.push(
      'Understand biological significance',
      'Apply in medical and health contexts',
      'Connect to human physiology and diseases'
    );
  }
  
  return applications;
}

function generatePracticeQuestions(content, examLevel) {
  const questions = [];
  const keywords = extractKeywords(content);
  
  if (examLevel === 'JEE') {
    questions.push(
      `1. **Numerical Problem**: Calculate the value using the given formula and data.`,
      `2. **Conceptual**: Derive the relationship between the key variables.`,
      `3. **Application**: How would you apply this concept to solve a real-world engineering problem?`,
      `4. **Analysis**: Compare and contrast the different approaches discussed.`
    );
  } else if (examLevel === 'NEET') {
    questions.push(
      `1. **Multiple Choice**: Which of the following best describes the main concept?`,
      `2. **Assertion-Reason**: Analyze the given assertion and reason statements.`,
      `3. **Diagram-based**: Label the diagram and explain the process.`,
      `4. **Application**: How is this concept relevant in medical practice?`
    );
  }
  
  return questions.join('\n');
}

function generateDetailedSummary(content, examLevel) {
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  const keywords = extractKeywords(content);
  
  let summary = `This ${examLevel}-level material covers ${keywords.slice(0, 3).join(', ')} and related concepts. `;
  
  if (sentences.length > 0) {
    summary += sentences[0].trim() + '. ';
  }
  
  summary += `Key areas for ${examLevel} preparation include ${keywords.slice(3, 6).join(', ')}. `;
  
  if (examLevel === 'JEE') {
    summary += 'Focus on problem-solving techniques and numerical applications for optimal exam performance.';
  } else if (examLevel === 'NEET') {
    summary += 'Emphasize factual recall and biological applications for NEET success.';
  }
  
  return summary;
}

function extractExamples(content) {
  const examples = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    if (line.match(/^(example|e\.g\.|for example)/i) || 
        line.match(/^\d+\.\s+/) ||
        line.includes('such as')) {
      examples.push(line.trim());
    }
  });
  
  return examples.slice(0, 5);
}

function extractFacts(content) {
  const facts = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    // Look for factual statements
    if (trimmed.includes('invented') || trimmed.includes('discovered') ||
        trimmed.includes('developed') || trimmed.includes('founded') ||
        trimmed.match(/\d{4}/) || // Contains a year
        trimmed.includes('first') || trimmed.includes('largest') ||
        trimmed.includes('smallest') || trimmed.includes('fastest')) {
      facts.push(trimmed);
    }
  });
  
  return facts.slice(0, 5);
}

function extractFormulas(content) {
  const formulas = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    // Look for mathematical formulas
    if (line.includes('=') && (line.includes('+') || line.includes('-') || 
        line.includes('*') || line.includes('/') || line.includes('^'))) {
      const parts = line.split('=');
      if (parts.length === 2) {
        formulas.push({
          name: parts[0].trim(),
          formula: line.trim(),
          variables: 'Variables as defined in context'
        });
      }
    }
  });
  
  return formulas.slice(0, 3);
}

function extractMainPoints(content) {
  const points = [];
  const lines = content.split('\n').filter(line => line.trim().length > 15);
  
  // Look for numbered lists, bullet points, or important sentences
  lines.forEach(line => {
    if (line.match(/^\d+\./) || line.match(/^[-•*]/) || 
        line.includes('important') || line.includes('key') ||
        line.includes('principle') || line.includes('rule')) {
      points.push(line.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '').trim());
    }
  });
  
  // If no structured points found, extract important sentences
  if (points.length < 3) {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 30);
    sentences.slice(0, 8).forEach(sentence => {
      points.push(sentence.trim());
    });
  }
  
  return points.slice(0, 10);
}

function generateSummary(content) {
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  const firstSentence = sentences[0]?.trim() || '';
  const keyWords = extractKeywords(content);
  
  return `This material covers ${keyWords.slice(0, 3).join(', ')} and related concepts. ${firstSentence}. Key areas include ${keyWords.slice(3, 6).join(', ')}.`;
}

function extractKeywords(content) {
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4);
  
  const commonWords = new Set(['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'can', 'still', 'should', 'after', 'being', 'now', 'made', 'before', 'here', 'through', 'when', 'where', 'much', 'some', 'these', 'many', 'then', 'them', 'well', 'were']);
  
  const keywords = words.filter(word => !commonWords.has(word));
  const wordCount = {};
  
  keywords.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.keys(wordCount)
    .sort((a, b) => wordCount[b] - wordCount[a])
    .slice(0, 10);
}

function generateQuestionFromFact(fact) {
  if (fact.includes('invented')) {
    return `Who invented ${fact.split('invented')[1]?.trim()}?`;
  } else if (fact.includes('discovered')) {
    return `Who discovered ${fact.split('discovered')[1]?.trim()}?`;
  } else if (fact.match(/\d{4}/)) {
    const year = fact.match(/\d{4}/)[0];
    return `What happened in ${year}?`;
  } else {
    return `What is true about ${fact.split(' ').slice(0, 3).join(' ')}?`;
  }
}

function createFillInBlank(sentence) {
  const words = sentence.split(' ');
  if (words.length < 5) return null;
  
  // Find important words to blank out
  const importantWords = words.filter(word => 
    word.length > 4 && 
    !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were'].includes(word.toLowerCase())
  );
  
  if (importantWords.length === 0) return null;
  
  const wordToBlank = importantWords[Math.floor(Math.random() * importantWords.length)];
  // Escape special regex characters
  const escapedWord = wordToBlank.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const question = sentence.replace(new RegExp(`\\b${escapedWord}\\b`, 'gi'), '______');
  
  return {
    question: `Fill in the blank: ${question}`,
    answer: wordToBlank
  };
}

// Enhanced test generator with exam level awareness
const generateEnhancedTest = (content, examLevel = 'JEE') => {
  const concepts = extractKeyConcepts(content, examLevel);
  const formulas = extractFormulas(content, examLevel);
  const applications = extractApplications(content, examLevel);
  
  const questions = [];
  
  if (examLevel === 'JEE') {
    // JEE-style questions
    questions.push({
      question: `Derive the relationship between the key variables discussed in the content and solve a numerical problem.`,
      type: 'numerical',
      marks: 4,
      difficulty: 'hard',
      keyPoints: ['Derivation steps', 'Formula application', 'Numerical calculation', 'Unit verification'],
      sampleAnswer: 'Step-by-step derivation with proper mathematical notation and final numerical answer with correct units.'
    });
    
    questions.push({
      question: `Explain the underlying principles and their applications in engineering contexts.`,
      type: 'conceptual',
      marks: 3,
      difficulty: 'medium',
      keyPoints: ['Fundamental principles', 'Engineering applications', 'Real-world examples'],
      sampleAnswer: 'Detailed explanation connecting theory to practical engineering applications.'
    });
    
    if (formulas.length > 0) {
      questions.push({
        question: `Given the formula ${formulas[0].formula}, derive it from first principles and discuss its limitations.`,
        type: 'derivation',
        marks: 5,
        difficulty: 'hard',
        keyPoints: ['Mathematical derivation', 'Assumptions made', 'Limitations', 'Applications'],
        sampleAnswer: 'Complete mathematical derivation with clear explanation of each step and discussion of assumptions.'
      });
    }
    
  } else if (examLevel === 'NEET') {
    // NEET-style questions
    questions.push({
      question: `Describe the biological significance of the concepts discussed and their role in living organisms.`,
      type: 'descriptive',
      marks: 3,
      difficulty: 'medium',
      keyPoints: ['Biological importance', 'Role in organisms', 'Medical relevance'],
      sampleAnswer: 'Comprehensive description linking concepts to biological processes and medical applications.'
    });
    
    questions.push({
      question: `Draw a labeled diagram illustrating the key concepts and explain the process step by step.`,
      type: 'diagram',
      marks: 4,
      difficulty: 'medium',
      keyPoints: ['Accurate diagram', 'Proper labeling', 'Step-by-step explanation'],
      sampleAnswer: 'Well-labeled diagram with detailed explanation of each component and process.'
    });
    
    questions.push({
      question: `Discuss the medical applications and clinical significance of the concepts covered.`,
      type: 'application',
      marks: 3,
      difficulty: 'medium',
      keyPoints: ['Medical applications', 'Clinical significance', 'Disease connections'],
      sampleAnswer: 'Detailed discussion of medical relevance with specific examples of diseases or treatments.'
    });
    
  } else {
    // General CBSE-style questions
    questions.push({
      question: `Explain the main concepts covered in the content with suitable examples.`,
      type: 'explanatory',
      marks: 5,
      difficulty: 'medium',
      keyPoints: ['Clear explanation', 'Relevant examples', 'Proper terminology'],
      sampleAnswer: 'Comprehensive explanation with real-world examples and proper use of scientific terminology.'
    });
    
    questions.push({
      question: `Compare and contrast the different aspects discussed in the material.`,
      type: 'analytical',
      marks: 4,
      difficulty: 'medium',
      keyPoints: ['Comparison points', 'Contrasting features', 'Analysis'],
      sampleAnswer: 'Structured comparison highlighting similarities and differences with analytical insights.'
    });
  }
  
  // Add short answer questions
  concepts.slice(0, 3).forEach((concept, index) => {
    questions.push({
      question: `Define ${concept.term} and explain its significance in ${examLevel} context.`,
      type: 'short-answer',
      marks: 2,
      difficulty: 'easy',
      keyPoints: ['Accurate definition', 'Significance explanation'],
      sampleAnswer: `${concept.description} This is significant because ${concept.examRelevance || 'it forms the foundation for advanced concepts'}.`
    });
  });
  
  return {
    examLevel: examLevel,
    totalQuestions: questions.length,
    totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
    timeAllowed: `${Math.ceil(questions.length * 8)} minutes`,
    instructions: getExamInstructions(examLevel),
    questions: questions,
    markingScheme: getMarkingScheme(examLevel),
    generatedAt: new Date().toISOString()
  };
};

function getExamInstructions(examLevel) {
  const instructions = {
    'JEE': [
      'Attempt all questions',
      'Show all mathematical steps clearly',
      'Include proper units in numerical answers',
      'Derive formulas where asked',
      'Draw neat diagrams where applicable'
    ],
    'NEET': [
      'Answer all questions',
      'Draw labeled diagrams where required',
      'Use proper biological terminology',
      'Explain processes step by step',
      'Connect concepts to medical applications'
    ],
    'CBSE': [
      'Read all questions carefully',
      'Answer in complete sentences',
      'Include examples where appropriate',
      'Draw neat, labeled diagrams',
      'Manage time effectively'
    ]
  };
  
  return instructions[examLevel] || instructions['CBSE'];
}

function getMarkingScheme(examLevel) {
  const schemes = {
    'JEE': {
      'numerical': 'Full marks for correct answer with proper steps, partial marks for correct method',
      'conceptual': 'Marks for explanation clarity, examples, and applications',
      'derivation': 'Step-wise marking for mathematical derivation'
    },
    'NEET': {
      'descriptive': 'Marks for biological accuracy and completeness',
      'diagram': 'Marks for diagram accuracy and labeling',
      'application': 'Marks for medical relevance and examples'
    },
    'CBSE': {
      'explanatory': 'Marks for concept clarity and examples',
      'analytical': 'Marks for comparison accuracy and analysis depth'
    }
  };
  
  return schemes[examLevel] || schemes['CBSE'];
}

// Extract key points from content
const extractKeyPoints = (content) => {
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 5).map(s => s.trim()).join('\n');
};

// Enhanced Generate Notes using AI Content Engine with format support
const generateNotes = async (content, language = 'English', userProfile = {}, format = 'structured') => {
  try {
    console.log('🧠 Generating enhanced notes with format:', format);
    
    // Extract exam level from user profile
    const examLevel = userProfile?.examType || userProfile?.exam_type || extractExamLevel(content);
    
    // Use the enhanced content generator directly
    const { generateEnhancedNotes } = require('./enhancedContentGenerator');
    return generateEnhancedNotes(content, examLevel, format);
    
  } catch (error) {
    console.warn('⚠️ Enhanced content generator failed, using basic fallback:', error.message);
    
    // Basic fallback
    const examLevel = userProfile?.examType || userProfile?.exam_type || extractExamLevel(content);
    const systemPrompt = PROMPTS.NOTES_GENERATOR.system;
    const userPrompt = PROMPTS.NOTES_GENERATOR.user(content, language);
    return await callLLM(systemPrompt, userPrompt);
  }
};

// Enhanced Generate Quiz using AI Content Engine
const generateQuiz = async (content, numQuestions = 10, language = 'English', userProfile = {}) => {
  try {
    console.log('🧠 Generating enhanced quiz with AI Content Engine...');
    const enhancedQuiz = await AIContentEngine.generateEnhancedQuiz(content, numQuestions, userProfile);
    return enhancedQuiz;
  } catch (error) {
    console.warn('⚠️ AI Content Engine failed, using fallback:', error.message);
    const systemPrompt = PROMPTS.QUIZ_GENERATOR.system;
    const userPrompt = PROMPTS.QUIZ_GENERATOR.user(content, numQuestions, language);
    const response = await callLLM(systemPrompt, userPrompt);
    
    try {
      return JSON.parse(response);
    } catch (e) {
      return { raw: response };
    }
  }
};

// Enhanced Generate Subjective Test using AI Content Engine
const generateSubjectiveTest = async (content, marksType, numQuestions = 5, language = 'English', userProfile = {}) => {
  try {
    console.log('🧠 Generating enhanced test with AI Content Engine...');
    const enhancedTest = await AIContentEngine.generateEnhancedTest(content, marksType, numQuestions, userProfile);
    return enhancedTest;
  } catch (error) {
    console.warn('⚠️ AI Content Engine failed, using fallback:', error.message);
    const systemPrompt = PROMPTS.SUBJECTIVE_TEST.system;
    const userPrompt = PROMPTS.SUBJECTIVE_TEST.user(content, marksType, numQuestions, language);
    const response = await callLLM(systemPrompt, userPrompt);
    
    try {
      return JSON.parse(response);
    } catch (e) {
      return { raw: response };
    }
  }
};

// Analyze Weaknesses
const analyzeWeaknesses = async (quizResults, language = 'English') => {
  const systemPrompt = PROMPTS.WEAKNESS_ANALYZER.system;
  const userPrompt = PROMPTS.WEAKNESS_ANALYZER.user(quizResults, language);
  return await callLLM(systemPrompt, userPrompt);
};

// Generate Study Plan
const generateStudyPlan = async (studentData, language = 'English') => {
  const systemPrompt = PROMPTS.STUDY_PLANNER.system;
  const userPrompt = PROMPTS.STUDY_PLANNER.user(studentData, language);
  const response = await callLLM(systemPrompt, userPrompt);
  
  try {
    return JSON.parse(response);
  } catch (e) {
    return { raw: response };
  }
};

// Enhanced Generate Flashcards using AI Content Engine
const generateFlashcards = async (content, numCards = 20, language = 'English', userProfile = {}) => {
  try {
    console.log('🧠 Generating enhanced flashcards with deep analysis...');
    
    // Extract exam level from user profile
    const examLevel = userProfile?.examType || userProfile?.exam_type || extractExamLevel(content);
    
    // Use the enhanced flashcards generator directly
    return generateEnhancedFlashcards(content, examLevel, numCards);
    
  } catch (error) {
    console.warn('⚠️ Enhanced flashcards generator failed, using basic fallback:', error.message);
    
    // Basic fallback
    const examLevel = userProfile?.examType || userProfile?.exam_type || extractExamLevel(content);
    return generateEnhancedFlashcards(content, examLevel, numCards);
  }
};

// Explain Simply
const explainSimply = async (concept, content, language = 'English') => {
  const systemPrompt = PROMPTS.EXPLAIN_SIMPLE.system;
  const userPrompt = PROMPTS.EXPLAIN_SIMPLE.user(concept, content, language);
  return await callLLM(systemPrompt, userPrompt);
};

module.exports = {
  generateNotes,
  generateQuiz,
  generateSubjectiveTest,
  analyzeWeaknesses,
  generateStudyPlan,
  generateFlashcards,
  explainSimply,
  generateEnhancedFlashcards,
  generateEnhancedTest,
  extractExamLevel,
  extractFormat,
  extractNumCards,
  extractKeyPoints
};

// Deep Content Analysis Service for Enhanced Learning
// Provides comprehensive analysis of educational content for better understanding

// Main deep analysis function
function performDeepContentAnalysis(content, examLevel = 'JEE') {
  console.log(`🔍 Performing deep content analysis for ${examLevel} level...`);
  
  const analysis = {
    concepts: extractDeepConcepts(content, examLevel),
    relationships: extractConceptRelationships(content, examLevel),
    causeEffects: extractCauseEffectRelationships(content),
    problems: extractProblemScenarios(content, examLevel),
    criticalPoints: extractCriticalThinkingPoints(content, examLevel),
    applications: extractRealWorldApplications(content, examLevel),
    formulas: extractEnhancedFormulas(content, examLevel),
    scenarios: generateScenarioBasedQuestions(content, examLevel)
  };
  
  return analysis;
}

function extractDeepConcepts(content, examLevel) {
  const concepts = [];
  const lines = content.split('\n');
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  
  // Enhanced concept extraction with context analysis
  lines.forEach(line => {
    // Look for definition patterns with deeper analysis
    const colonMatch = line.match(/^([A-Z][^:]{2,50}):\s*(.+)$/);
    const dashMatch = line.match(/^([A-Z][^-]{2,50})\s*-\s*(.+)$/);
    
    if (colonMatch) {
      const term = colonMatch[1].trim();
      const description = colonMatch[2].trim();
      concepts.push({
        term,
        description,
        examRelevance: generateExamRelevance(term, description, examLevel),
        difficulty: assessConceptDifficulty(description, examLevel),
        mechanism: extractMechanism(description),
        application: generateApplicationContext(term, examLevel),
        relatedConcepts: findRelatedConcepts(term, content)
      });
    } else if (dashMatch) {
      const term = dashMatch[1].trim();
      const description = dashMatch[2].trim();
      concepts.push({
        term,
        description,
        examRelevance: generateExamRelevance(term, description, examLevel),
        difficulty: assessConceptDifficulty(description, examLevel),
        mechanism: extractMechanism(description),
        application: generateApplicationContext(term, examLevel)
      });
    }
  });
  
  // Extract concepts from sentences with "is/are" patterns
  sentences.forEach(sentence => {
    const isMatch = sentence.match(/(.{5,40})\s+is\s+(.{10,100})/i);
    const areMatch = sentence.match(/(.{5,40})\s+are\s+(.{10,100})/i);
    
    if (isMatch && isMatch[1].length < 50) {
      const term = isMatch[1].trim();
      const description = isMatch[2].trim();
      if (!concepts.find(c => c.term.toLowerCase() === term.toLowerCase())) {
        concepts.push({
          term,
          description,
          examRelevance: generateExamRelevance(term, description, examLevel),
          difficulty: assessConceptDifficulty(description, examLevel),
          significance: generateSignificance(term, description, examLevel)
        });
      }
    }
  });
  
  return concepts.slice(0, 8);
}

function extractConceptRelationships(content, examLevel) {
  const relationships = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 30);
  
  // Look for comparison and relationship patterns
  sentences.forEach(sentence => {
    // "A and B" patterns
    const andMatch = sentence.match(/(.{5,30})\s+and\s+(.{5,30})/i);
    // "A vs B" or "A versus B" patterns
    const vsMatch = sentence.match(/(.{5,30})\s+(?:vs|versus)\s+(.{5,30})/i);
    // "A compared to B" patterns
    const compareMatch = sentence.match(/(.{5,30})\s+compared to\s+(.{5,30})/i);
    // "A relates to B" patterns
    const relateMatch = sentence.match(/(.{5,30})\s+(?:relates to|is related to|connects to)\s+(.{5,30})/i);
    
    if (vsMatch || compareMatch) {
      const concept1 = (vsMatch ? vsMatch[1] : compareMatch[1]).trim();
      const concept2 = (vsMatch ? vsMatch[2] : compareMatch[2]).trim();
      relationships.push({
        concept1,
        concept2,
        relationship: `Comparison between ${concept1} and ${concept2}`,
        differences: generateDifferences(concept1, concept2, sentence),
        examContext: `Understanding the distinction is crucial for ${examLevel} problem solving`
      });
    } else if (relateMatch) {
      const concept1 = relateMatch[1].trim();
      const concept2 = relateMatch[2].trim();
      relationships.push({
        concept1,
        concept2,
        relationship: `${concept1} is connected to ${concept2}`,
        examContext: `This relationship appears in ${examLevel} applications`
      });
    }
  });
  
  return relationships.slice(0, 5);
}

function extractCauseEffectRelationships(content) {
  const causeEffects = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  
  sentences.forEach(sentence => {
    // "causes" patterns
    const causesMatch = sentence.match(/(.{10,50})\s+causes?\s+(.{10,50})/i);
    // "results in" patterns
    const resultsMatch = sentence.match(/(.{10,50})\s+results? in\s+(.{10,50})/i);
    // "leads to" patterns
    const leadsMatch = sentence.match(/(.{10,50})\s+leads? to\s+(.{10,50})/i);
    // "due to" patterns
    const dueMatch = sentence.match(/(.{10,50})\s+(?:is )?due to\s+(.{10,50})/i);
    
    if (causesMatch) {
      causeEffects.push({
        cause: causesMatch[1].trim(),
        effect: causesMatch[2].trim(),
        mechanism: extractMechanism(sentence),
        examApplication: 'This cause-effect relationship is important for understanding processes'
      });
    } else if (resultsMatch || leadsMatch) {
      const match = resultsMatch || leadsMatch;
      causeEffects.push({
        cause: match[1].trim(),
        effect: match[2].trim(),
        mechanism: extractMechanism(sentence),
        examApplication: 'Understanding this sequence helps in problem analysis'
      });
    } else if (dueMatch) {
      causeEffects.push({
        cause: dueMatch[2].trim(),
        effect: dueMatch[1].trim(),
        mechanism: extractMechanism(sentence),
        examApplication: 'This relationship explains underlying principles'
      });
    }
  });
  
  return causeEffects.slice(0, 5);
}

function extractProblemScenarios(content, examLevel) {
  const problems = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 30);
  
  // Look for problem-indicating keywords
  const problemKeywords = ['calculate', 'find', 'determine', 'solve', 'prove', 'derive', 'show that'];
  
  sentences.forEach(sentence => {
    const hasKeyword = problemKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword)
    );
    
    if (hasKeyword) {
      problems.push({
        scenario: sentence.trim(),
        solution: generateSolutionStrategy(sentence, examLevel),
        steps: generateSolutionSteps(sentence, examLevel),
        commonMistakes: generateCommonMistakes(sentence, examLevel)
      });
    }
  });
  
  // Generate additional problem scenarios based on content
  const concepts = extractKeyConcepts(content);
  concepts.slice(0, 3).forEach(concept => {
    problems.push({
      scenario: `A ${examLevel} problem involving ${concept.term}`,
      solution: `Apply the principles of ${concept.term} systematically`,
      steps: generateConceptBasedSteps(concept, examLevel),
      commonMistakes: `Common errors include misunderstanding ${concept.term} fundamentals`
    });
  });
  
  return problems.slice(0, 6);
}

function extractCriticalThinkingPoints(content, examLevel) {
  const criticalPoints = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 25);
  
  // Look for statements that require analysis
  const analysisKeywords = ['important', 'significant', 'crucial', 'fundamental', 'essential', 'key'];
  
  sentences.forEach(sentence => {
    const hasKeyword = analysisKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword)
    );
    
    if (hasKeyword) {
      criticalPoints.push({
        statement: sentence.trim(),
        analysis: generateCriticalAnalysis(sentence, examLevel),
        examImplications: `This concept connects to multiple ${examLevel} topics`,
        insight: generateInsight(sentence, examLevel)
      });
    }
  });
  
  return criticalPoints.slice(0, 4);
}

function extractRealWorldApplications(content, examLevel) {
  const applications = [];
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  
  // Look for application indicators
  const appKeywords = ['used in', 'applied to', 'application', 'example', 'real world', 'practical'];
  
  sentences.forEach(sentence => {
    const hasKeyword = appKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword)
    );
    
    if (hasKeyword) {
      applications.push({
        scenario: sentence.trim(),
        explanation: generateApplicationExplanation(sentence, examLevel),
        examConnection: `This application demonstrates ${examLevel} concepts in practice`,
        careerRelevance: generateCareerRelevance(sentence, examLevel)
      });
    }
  });
  
  // Generate additional applications based on concepts
  const concepts = extractKeyConcepts(content);
  concepts.slice(0, 2).forEach(concept => {
    applications.push({
      scenario: `Real-world application of ${concept.term}`,
      explanation: generateConceptApplication(concept, examLevel),
      examConnection: `${concept.term} appears in various ${examLevel} problem contexts`,
      careerRelevance: `Understanding ${concept.term} is valuable in engineering and science careers`
    });
  });
  
  return applications.slice(0, 5);
}

function extractEnhancedFormulas(content, examLevel) {
  const formulas = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    // Look for mathematical formulas with enhanced context
    if (line.includes('=') && (line.includes('+') || line.includes('-') || 
        line.includes('*') || line.includes('/') || line.includes('^') || 
        line.includes('²') || line.includes('³'))) {
      
      const parts = line.split('=');
      if (parts.length === 2) {
        const formulaName = parts[0].trim();
        const formulaExpression = line.trim();
        
        formulas.push({
          name: formulaName,
          formula: formulaExpression,
          derivation: generateDerivationHints(formulaExpression, examLevel),
          applications: generateFormulaApplications(formulaName, examLevel),
          examExample: generateExamExample(formulaName, examLevel),
          assumptions: generateAssumptions(formulaExpression, examLevel),
          notes: generateFormulaNotes(formulaExpression, examLevel)
        });
      }
    }
  });
  
  return formulas.slice(0, 4);
}

function generateScenarioBasedQuestions(content, examLevel) {
  const scenarios = [];
  const concepts = extractKeyConcepts(content);
  
  concepts.slice(0, 3).forEach(concept => {
    scenarios.push({
      situation: `In a ${examLevel} laboratory experiment involving ${concept.term}`,
      outcome: generateScenarioOutcome(concept, examLevel)
    });
  });
  
  return scenarios;
}

// Helper functions for deep analysis
function generateExamRelevance(term, description, examLevel) {
  const relevanceMap = {
    'JEE': `${term} is fundamental for JEE Physics/Chemistry/Mathematics problems`,
    'NEET': `${term} is crucial for NEET Biology/Chemistry/Physics concepts`,
    'CBSE': `${term} appears in CBSE curriculum and board examinations`
  };
  return relevanceMap[examLevel] || `${term} is important for ${examLevel} studies`;
}

function assessConceptDifficulty(description, examLevel) {
  const complexWords = ['complex', 'advanced', 'sophisticated', 'intricate'];
  const basicWords = ['simple', 'basic', 'fundamental', 'elementary'];
  
  if (complexWords.some(word => description.toLowerCase().includes(word))) {
    return 'hard';
  } else if (basicWords.some(word => description.toLowerCase().includes(word))) {
    return 'easy';
  }
  return 'medium';
}

function extractMechanism(text) {
  if (text.includes('process') || text.includes('mechanism') || text.includes('how')) {
    return text;
  }
  return 'Analyze the step-by-step process and underlying mechanisms';
}

function generateApplicationContext(term, examLevel) {
  return `${term} is applied in ${examLevel} problem-solving and real-world scenarios`;
}

function findRelatedConcepts(term, content) {
  const words = content.toLowerCase().split(/\W+/);
  const termWords = term.toLowerCase().split(/\W+/);
  const related = [];
  
  termWords.forEach(termWord => {
    if (termWord.length > 3) {
      const nearby = words.filter(word => 
        word.includes(termWord) || termWord.includes(word)
      );
      related.push(...nearby);
    }
  });
  
  return [...new Set(related)].slice(0, 3);
}

function generateSignificance(term, description, examLevel) {
  return `${term} plays a crucial role in ${examLevel} curriculum and forms the foundation for advanced concepts`;
}

function generateDifferences(concept1, concept2, sentence) {
  return `Key distinctions between ${concept1} and ${concept2} based on their properties and applications`;
}

function generateSolutionStrategy(sentence, examLevel) {
  return `For ${examLevel} problems: 1) Identify given information, 2) Apply relevant concepts, 3) Solve systematically, 4) Verify results`;
}

function generateSolutionSteps(sentence, examLevel) {
  return `1. Read problem carefully\n2. Identify known and unknown variables\n3. Select appropriate ${examLevel} concepts\n4. Apply formulas or principles\n5. Calculate and verify`;
}

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

// Basic concept extraction (fallback function)
function extractKeyConcepts(content) {
  const concepts = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    const colonMatch = line.match(/^([A-Z][^:]+):\s*(.+)$/);
    const dashMatch = line.match(/^([A-Z][^-]+)\s*-\s*(.+)$/);
    
    if (colonMatch) {
      concepts.push({
        term: colonMatch[1].trim(),
        description: colonMatch[2].trim()
      });
    } else if (dashMatch) {
      concepts.push({
        term: dashMatch[1].trim(),
        description: dashMatch[2].trim()
      });
    }
  });
  
  return concepts.slice(0, 8);
}

module.exports = {
  performDeepContentAnalysis,
  extractDeepConcepts,
  extractConceptRelationships,
  extractCauseEffectRelationships,
  extractProblemScenarios,
  extractCriticalThinkingPoints,
  extractRealWorldApplications,
  extractEnhancedFormulas,
  generateScenarioBasedQuestions
};
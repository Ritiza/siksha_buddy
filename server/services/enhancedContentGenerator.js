// Enhanced Content Generation Service with Deep Analysis and Multiple Formats
const { performDeepContentAnalysis } = require('./deepAnalysis');

// Main enhanced notes generator with format support
const generateEnhancedNotes = (content, examLevel = 'JEE', format = 'structured') => {
  console.log(`📝 Generating ${format} notes for ${examLevel} level...`);
  
  // Route to appropriate format generator
  switch (format.toLowerCase()) {
    case 'cornell':
      return generateCornellNotes(content, examLevel);
    case 'mindmap':
    case 'mind-map':
      return generateMindMapNotes(content, examLevel);
    case 'chart':
    case 'flowchart':
      return generateChartNotes(content, examLevel);
    case 'outline':
      return generateOutlineNotes(content, examLevel);
    default:
      return generateStructuredNotes(content, examLevel);
  }
};

// Cornell Notes Format
function generateCornellNotes(content, examLevel) {
  const analysis = performDeepContentAnalysis(content, examLevel);
  
  let notes = `# 📚 Cornell Notes - ${examLevel} Study Session\n\n`;
  notes += `---\n\n`;
  notes += `## 📋 Note-Taking Area\n\n`;
  
  // Main content area
  if (analysis.concepts.length > 0) {
    notes += `### Key Concepts\n`;
    analysis.concepts.forEach((concept, idx) => {
      notes += `**${concept.term}**\n`;
      notes += `${concept.description}\n`;
      if (concept.examRelevance) {
        notes += `*${examLevel} Relevance: ${concept.examRelevance}*\n`;
      }
      notes += `\n`;
    });
  }
  
  if (analysis.formulas.length > 0) {
    notes += `### Important Formulas\n`;
    analysis.formulas.forEach(formula => {
      notes += `**${formula.name}**: ${formula.formula}\n`;
      notes += `Applications: ${formula.applications}\n\n`;
    });
  }
  
  notes += `---\n\n`;
  notes += `## 🔑 Cue Column (Questions & Keywords)\n\n`;
  
  // Generate cue questions
  analysis.concepts.forEach(concept => {
    notes += `• What is ${concept.term}?\n`;
    notes += `• Why is ${concept.term} important for ${examLevel}?\n`;
    notes += `• How does ${concept.term} apply to problems?\n`;
  });
  
  if (analysis.relationships.length > 0) {
    analysis.relationships.forEach(rel => {
      notes += `• How do ${rel.concept1} and ${rel.concept2} relate?\n`;
    });
  }
  
  notes += `\n---\n\n`;
  notes += `## 📝 Summary Section\n\n`;
  
  notes += `### Key Takeaways for ${examLevel}\n`;
  notes += `1. **Main Concepts**: ${analysis.concepts.map(c => c.term).join(', ')}\n`;
  notes += `2. **Critical Relationships**: Understanding how concepts interconnect\n`;
  notes += `3. **Problem-Solving Applications**: Apply theory to ${examLevel} questions\n`;
  notes += `4. **Exam Strategy**: Focus on derivations, applications, and numerical problems\n\n`;
  
  notes += `### Action Items\n`;
  notes += `- [ ] Review and memorize key formulas\n`;
  notes += `- [ ] Practice numerical problems\n`;
  notes += `- [ ] Create concept maps for relationships\n`;
  notes += `- [ ] Solve previous ${examLevel} questions on this topic\n`;
  
  return notes;
}

// Mind Map Format (Text-based representation)
function generateMindMapNotes(content, examLevel) {
  const analysis = performDeepContentAnalysis(content, examLevel);
  
  let notes = `# 🧠 Mind Map - ${examLevel} Study Topic\n\n`;
  notes += `\`\`\`\n`;
  notes += `                    CENTRAL TOPIC\n`;
  notes += `                         |\n`;
  notes += `        ┌────────────────┼────────────────┐\n`;
  notes += `        │                │                │\n`;
  notes += `    CONCEPTS        FORMULAS       APPLICATIONS\n`;
  notes += `        │                │                │\n`;
  
  // Add concept branches
  if (analysis.concepts.length > 0) {
    notes += `        ├─ ${analysis.concepts[0]?.term || 'Key Concept 1'}\n`;
    if (analysis.concepts[1]) notes += `        ├─ ${analysis.concepts[1].term}\n`;
    if (analysis.concepts[2]) notes += `        └─ ${analysis.concepts[2].term}\n`;
  }
  
  notes += `\`\`\`\n\n`;
  
  // Detailed branches
  notes += `## 🌟 Central Topic Breakdown\n\n`;
  
  notes += `### 🔑 Key Concepts Branch\n`;
  analysis.concepts.forEach((concept, idx) => {
    notes += `**${idx + 1}. ${concept.term}**\n`;
    notes += `   ├─ Definition: ${concept.description}\n`;
    notes += `   ├─ ${examLevel} Relevance: ${concept.examRelevance || 'Important for exam'}\n`;
    notes += `   └─ Difficulty: ${concept.difficulty || 'Medium'}\n\n`;
  });
  
  notes += `### 📐 Formulas Branch\n`;
  analysis.formulas.forEach((formula, idx) => {
    notes += `**${idx + 1}. ${formula.name}**\n`;
    notes += `   ├─ Formula: ${formula.formula}\n`;
    notes += `   ├─ Applications: ${formula.applications}\n`;
    notes += `   └─ Derivation: ${formula.derivation}\n\n`;
  });
  
  notes += `### ⚡ Applications Branch\n`;
  analysis.applications.forEach((app, idx) => {
    notes += `**${idx + 1}. Real-world Connection**\n`;
    notes += `   ├─ Scenario: ${app.scenario}\n`;
    notes += `   ├─ ${examLevel} Context: ${app.examConnection}\n`;
    notes += `   └─ Career Relevance: ${app.careerRelevance}\n\n`;
  });
  
  notes += `### 🔗 Relationships Web\n`;
  analysis.relationships.forEach((rel, idx) => {
    notes += `**${idx + 1}. ${rel.concept1} ↔ ${rel.concept2}**\n`;
    notes += `   └─ Connection: ${rel.relationship}\n\n`;
  });
  
  return notes;
}

// Chart/Flowchart Format
function generateChartNotes(content, examLevel) {
  const analysis = performDeepContentAnalysis(content, examLevel);
  
  let notes = `# 📊 Flowchart Notes - ${examLevel} Study Guide\n\n`;
  
  // Process Flow Chart
  notes += `## 🔄 Learning Process Flow\n\n`;
  notes += `\`\`\`\n`;
  notes += `START\n`;
  notes += `  ↓\n`;
  notes += `[Understand Basic Concepts]\n`;
  notes += `  ↓\n`;
  notes += `[Learn Key Formulas]\n`;
  notes += `  ↓\n`;
  notes += `[Study Relationships]\n`;
  notes += `  ↓\n`;
  notes += `[Practice Applications]\n`;
  notes += `  ↓\n`;
  notes += `[Solve ${examLevel} Problems]\n`;
  notes += `  ↓\n`;
  notes += `END (Mastery Achieved)\n`;
  notes += `\`\`\`\n\n`;
  
  // Concept Hierarchy Chart
  notes += `## 🏗️ Concept Hierarchy\n\n`;
  notes += `\`\`\`\n`;
  notes += `                 MAIN TOPIC\n`;
  notes += `                     |\n`;
  notes += `    ┌────────────────┼────────────────┐\n`;
  
  if (analysis.concepts.length >= 3) {
    notes += `    │                │                │\n`;
    notes += `${analysis.concepts[0]?.term.padEnd(12)} ${analysis.concepts[1]?.term.padEnd(12)} ${analysis.concepts[2]?.term}\n`;
  }
  
  notes += `\`\`\`\n\n`;
  
  // Difficulty Progression Chart
  notes += `## 📈 Difficulty Progression\n\n`;
  notes += `| Level | Concepts | Skills Required | ${examLevel} Weightage |\n`;
  notes += `|-------|----------|-----------------|---------------------|\n`;
  
  const easyTopics = analysis.concepts.filter(c => c.difficulty === 'easy');
  const mediumTopics = analysis.concepts.filter(c => c.difficulty === 'medium');
  const hardTopics = analysis.concepts.filter(c => c.difficulty === 'hard');
  
  notes += `| Easy | ${easyTopics.map(c => c.term).join(', ') || 'Basic concepts'} | Memorization, Basic understanding | 30% |\n`;
  notes += `| Medium | ${mediumTopics.map(c => c.term).join(', ') || 'Intermediate concepts'} | Application, Problem-solving | 50% |\n`;
  notes += `| Hard | ${hardTopics.map(c => c.term).join(', ') || 'Advanced concepts'} | Analysis, Synthesis | 20% |\n\n`;
  
  // Problem-Solving Flowchart
  notes += `## 🎯 ${examLevel} Problem-Solving Strategy\n\n`;
  notes += `\`\`\`\n`;
  notes += `Problem Given\n`;
  notes += `     ↓\n`;
  notes += `[Read Carefully]\n`;
  notes += `     ↓\n`;
  notes += `[Identify Given Data] → [List Unknown Variables]\n`;
  notes += `     ↓                        ↓\n`;
  notes += `[Select Relevant Concepts] ← [Choose Formulas]\n`;
  notes += `     ↓\n`;
  notes += `[Apply Mathematical Steps]\n`;
  notes += `     ↓\n`;
  notes += `[Calculate Result]\n`;
  notes += `     ↓\n`;
  notes += `[Verify Units & Reasonableness]\n`;
  notes += `     ↓\n`;
  notes += `Final Answer\n`;
  notes += `\`\`\`\n\n`;
  
  // Cause-Effect Chart
  if (analysis.causeEffects.length > 0) {
    notes += `## ⚡ Cause-Effect Relationships\n\n`;
    analysis.causeEffects.forEach((ce, idx) => {
      notes += `### ${idx + 1}. ${ce.cause} → ${ce.effect}\n`;
      notes += `\`\`\`\n`;
      notes += `CAUSE: ${ce.cause}\n`;
      notes += `   ↓\n`;
      notes += `MECHANISM: ${ce.mechanism}\n`;
      notes += `   ↓\n`;
      notes += `EFFECT: ${ce.effect}\n`;
      notes += `\`\`\`\n\n`;
    });
  }
  
  return notes;
}

// Outline Format
function generateOutlineNotes(content, examLevel) {
  const analysis = performDeepContentAnalysis(content, examLevel);
  
  let notes = `# 📋 Outline Notes - ${examLevel} Study Guide\n\n`;
  
  notes += `## I. Fundamental Concepts\n`;
  analysis.concepts.forEach((concept, idx) => {
    notes += `   ${String.fromCharCode(65 + idx)}. ${concept.term}\n`;
    notes += `      1. Definition: ${concept.description}\n`;
    notes += `      2. ${examLevel} Relevance: ${concept.examRelevance || 'Important for exam success'}\n`;
    notes += `      3. Difficulty Level: ${concept.difficulty || 'Medium'}\n`;
    if (concept.application) {
      notes += `      4. Applications: ${concept.application}\n`;
    }
    notes += `\n`;
  });
  
  notes += `## II. Mathematical Formulations\n`;
  analysis.formulas.forEach((formula, idx) => {
    notes += `   ${String.fromCharCode(65 + idx)}. ${formula.name}\n`;
    notes += `      1. Formula: ${formula.formula}\n`;
    notes += `      2. Variables: ${formula.variables || 'As defined in context'}\n`;
    notes += `      3. Applications: ${formula.applications}\n`;
    notes += `      4. Derivation Notes: ${formula.derivation}\n`;
    notes += `\n`;
  });
  
  notes += `## III. Conceptual Relationships\n`;
  analysis.relationships.forEach((rel, idx) => {
    notes += `   ${String.fromCharCode(65 + idx)}. ${rel.concept1} and ${rel.concept2}\n`;
    notes += `      1. Relationship: ${rel.relationship}\n`;
    notes += `      2. ${examLevel} Context: ${rel.examContext || 'Important for understanding'}\n`;
    notes += `\n`;
  });
  
  notes += `## IV. Problem-Solving Applications\n`;
  analysis.problems.forEach((problem, idx) => {
    notes += `   ${String.fromCharCode(65 + idx)}. ${problem.scenario}\n`;
    notes += `      1. Solution Strategy: ${problem.solution}\n`;
    notes += `      2. Key Steps: ${problem.steps}\n`;
    notes += `      3. Common Mistakes: ${problem.commonMistakes}\n`;
    notes += `\n`;
  });
  
  notes += `## V. Real-World Applications\n`;
  analysis.applications.forEach((app, idx) => {
    notes += `   ${String.fromCharCode(65 + idx)}. ${app.scenario}\n`;
    notes += `      1. Explanation: ${app.explanation}\n`;
    notes += `      2. ${examLevel} Connection: ${app.examConnection}\n`;
    notes += `      3. Career Relevance: ${app.careerRelevance}\n`;
    notes += `\n`;
  });
  
  notes += `## VI. Study Strategy for ${examLevel}\n`;
  notes += `   A. Preparation Timeline\n`;
  notes += `      1. Week 1-2: Master fundamental concepts\n`;
  notes += `      2. Week 3-4: Practice formula applications\n`;
  notes += `      3. Week 5-6: Solve complex problems\n`;
  notes += `      4. Week 7+: Review and mock tests\n\n`;
  
  notes += `   B. Practice Recommendations\n`;
  notes += `      1. Daily: Review 2-3 key concepts\n`;
  notes += `      2. Weekly: Solve 10-15 ${examLevel} problems\n`;
  notes += `      3. Monthly: Take full-length practice tests\n\n`;
  
  return notes;
}

// Structured Notes (Enhanced Default Format)
function generateStructuredNotes(content, examLevel) {
  const analysis = performDeepContentAnalysis(content, examLevel);
  
  let notes = `# 📚 Enhanced Study Notes - ${examLevel} Level\n\n`;
  
  // Learning objectives with deeper analysis
  notes += `## 🎯 Learning Objectives\n`;
  notes += `By mastering this content, you will be able to:\n`;
  notes += `- **Understand**: Core concepts at ${examLevel} depth\n`;
  notes += `- **Analyze**: Relationships and cause-effect patterns\n`;
  notes += `- **Apply**: Knowledge to solve complex ${examLevel} problems\n`;
  notes += `- **Evaluate**: Different approaches and solutions critically\n`;
  notes += `- **Create**: Novel solutions using learned principles\n\n`;
  
  // Deep conceptual understanding
  notes += `## 🧠 Deep Conceptual Understanding\n`;
  analysis.concepts.forEach((concept, idx) => {
    notes += `### ${idx + 1}. ${concept.term}\n`;
    notes += `**Core Definition**: ${concept.description}\n\n`;
    notes += `**${examLevel} Significance**: ${concept.examRelevance}\n\n`;
    notes += `**Difficulty Assessment**: ${concept.difficulty} level\n\n`;
    if (concept.mechanism) {
      notes += `**Underlying Mechanism**: ${concept.mechanism}\n\n`;
    }
    if (concept.application) {
      notes += `**Practical Applications**: ${concept.application}\n\n`;
    }
    notes += `---\n\n`;
  });
  
  // Relationship analysis
  if (analysis.relationships.length > 0) {
    notes += `## 🔗 Conceptual Relationships & Comparisons\n`;
    analysis.relationships.forEach((rel, idx) => {
      notes += `### ${idx + 1}. ${rel.concept1} ↔ ${rel.concept2}\n`;
      notes += `**Relationship**: ${rel.relationship}\n\n`;
      notes += `**${examLevel} Context**: ${rel.examContext}\n\n`;
      if (rel.differences) {
        notes += `**Key Differences**: ${rel.differences}\n\n`;
      }
      notes += `---\n\n`;
    });
  }
  
  // Cause-effect analysis
  if (analysis.causeEffects.length > 0) {
    notes += `## ⚡ Cause-Effect Analysis\n`;
    analysis.causeEffects.forEach((ce, idx) => {
      notes += `### ${idx + 1}. ${ce.cause} → ${ce.effect}\n`;
      notes += `**Mechanism**: ${ce.mechanism}\n\n`;
      notes += `**${examLevel} Application**: ${ce.examApplication}\n\n`;
      notes += `---\n\n`;
    });
  }
  
  // Enhanced formula section
  if (analysis.formulas.length > 0) {
    notes += `## 📐 Mathematical Formulations & Derivations\n`;
    analysis.formulas.forEach((formula, idx) => {
      notes += `### ${idx + 1}. ${formula.name}\n`;
      notes += `**Formula**: \`${formula.formula}\`\n\n`;
      notes += `**Derivation Strategy**: ${formula.derivation}\n\n`;
      notes += `**Applications**: ${formula.applications}\n\n`;
      notes += `**${examLevel} Example**: ${formula.examExample}\n\n`;
      notes += `**Key Assumptions**: ${formula.assumptions}\n\n`;
      notes += `**Important Notes**: ${formula.notes}\n\n`;
      notes += `---\n\n`;
    });
  }
  
  // Problem-solving strategies
  notes += `## 🎯 Problem-Solving Mastery\n`;
  analysis.problems.forEach((problem, idx) => {
    notes += `### ${idx + 1}. ${problem.scenario}\n`;
    notes += `**Solution Strategy**: ${problem.solution}\n\n`;
    notes += `**Step-by-Step Approach**:\n${problem.steps}\n\n`;
    notes += `**Common Pitfalls**: ${problem.commonMistakes}\n\n`;
    notes += `---\n\n`;
  });
  
  // Critical thinking points
  if (analysis.criticalPoints.length > 0) {
    notes += `## 🤔 Critical Analysis Points\n`;
    analysis.criticalPoints.forEach((point, idx) => {
      notes += `### ${idx + 1}. ${point.statement}\n`;
      notes += `**Analysis**: ${point.analysis}\n\n`;
      notes += `**${examLevel} Implications**: ${point.examImplications}\n\n`;
      notes += `**Key Insight**: ${point.insight}\n\n`;
      notes += `---\n\n`;
    });
  }
  
  // Real-world connections
  notes += `## 🌍 Real-World Applications\n`;
  analysis.applications.forEach((app, idx) => {
    notes += `### ${idx + 1}. ${app.scenario}\n`;
    notes += `**Explanation**: ${app.explanation}\n\n`;
    notes += `**${examLevel} Connection**: ${app.examConnection}\n\n`;
    notes += `**Career Relevance**: ${app.careerRelevance}\n\n`;
    notes += `---\n\n`;
  });
  
  // Enhanced study strategy
  notes += `## 📈 Advanced Study Strategy\n`;
  notes += `### Cognitive Learning Levels\n`;
  notes += `1. **Knowledge** (Remember): Memorize key facts and formulas\n`;
  notes += `2. **Comprehension** (Understand): Explain concepts in your own words\n`;
  notes += `3. **Application** (Apply): Use knowledge to solve ${examLevel} problems\n`;
  notes += `4. **Analysis** (Analyze): Break down complex problems into components\n`;
  notes += `5. **Synthesis** (Create): Combine concepts to solve novel problems\n`;
  notes += `6. **Evaluation** (Judge): Assess solutions and choose best approaches\n\n`;
  
  notes += `### Spaced Repetition Schedule\n`;
  notes += `- **Day 1**: Initial learning\n`;
  notes += `- **Day 3**: First review\n`;
  notes += `- **Day 7**: Second review\n`;
  notes += `- **Day 21**: Third review\n`;
  notes += `- **Day 60**: Long-term retention check\n\n`;
  
  notes += `### Active Learning Techniques\n`;
  notes += `- **Feynman Technique**: Explain concepts to someone else\n`;
  notes += `- **Concept Mapping**: Create visual connections between ideas\n`;
  notes += `- **Problem Variation**: Solve similar problems with different parameters\n`;
  notes += `- **Peer Teaching**: Discuss and debate concepts with classmates\n`;
  notes += `- **Self-Testing**: Regular quizzes without looking at notes\n\n`;
  
  return notes;
}

module.exports = {
  generateEnhancedNotes,
  generateCornellNotes,
  generateMindMapNotes,
  generateChartNotes,
  generateOutlineNotes,
  generateStructuredNotes
};
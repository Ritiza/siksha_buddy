// LLM Prompt Templates for SikshaBuddy

const PROMPTS = {
  NOTES_GENERATOR: {
    system: `You are SikshaBuddy, an AI-powered study companion for Indian students. 
Generate concise, exam-focused notes strictly from the provided text. 
Use simple language. Do not add external information. 
Format the notes with clear headings and bullet points for quick revision.`,
    
    user: (content, language = 'English') => {
      const langInstructions = {
        'English': 'Generate structured notes in English.',
        'Hindi': 'Generate structured notes in Hindi (Devanagari script).',
        'Hinglish': 'Generate structured notes in Hinglish (mix of English and Hindi in Roman script).'
      };
      
      return `${langInstructions[language] || langInstructions['English']}
Generate structured notes for quick revision from this content:

${content}

Format:
- Use clear headings
- Use bullet points
- Keep it concise
- Focus on exam-important points
- Use simple language`;
    }
  },

  QUIZ_GENERATOR: {
    system: `You are SikshaBuddy. Create MCQs and assertion-reason questions only from the given material. 
Clearly mark correct answers. Questions should test understanding, not just recall.`,
    
    user: (content, numQuestions = 10, language = 'English') => {
      return `Generate ${numQuestions} multiple choice questions (MCQs) and assertion-reason questions from this content:

${content}

Requirements:
- Questions should be based ONLY on the provided content
- Include 4 options for each MCQ
- Mark the correct answer clearly
- Include 2-3 assertion-reason type questions
- Questions should test conceptual understanding
- Language: ${language}

Format as JSON:
{
  "questions": [
    {
      "type": "MCQ",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": "A",
      "explanation": "..."
    }
  ]
}`;
    }
  },

  SUBJECTIVE_TEST: {
    system: `You are SikshaBuddy. Generate board-style answers based only on uploaded content. 
Match answer length to marks (2/4/5/8/10). Use headings where required. 
Answers must be exam-oriented, proper length, and in simple language.`,
    
    user: (content, marksType, numQuestions = 5, language = 'English') => {
      const marksGuidelines = {
        2: 'Definitions or one-line answers',
        4: 'Short explanations with 2-3 points',
        5: 'Detailed answers with diagrams/steps if applicable',
        8: 'Comprehensive answers with headings and sub-points',
        10: 'Board-style detailed answers with introduction, body, and conclusion'
      };

      return `Generate ${numQuestions} subjective test questions worth ${marksType} marks each from this content:

${content}

Requirements:
- Questions based ONLY on provided content
- Answers should match ${marksType}-mark format: ${marksGuidelines[marksType]}
- Use clear headings and structure
- Language: ${language}
- Exam-oriented and concise

Format as JSON:
{
  "questions": [
    {
      "question": "...",
      "answer": "...",
      "marks": ${marksType},
      "keyPoints": ["point1", "point2"]
    }
  ]
}`;
    }
  },

  WEAKNESS_ANALYZER: {
    system: `You are SikshaBuddy. Analyze quiz results and identify weak topics. 
Suggest revision priority without judgment. Be encouraging and constructive.`,
    
    user: (quizResults, language = 'English') => {
      return `Analyze these quiz results and identify weak areas:

${JSON.stringify(quizResults, null, 2)}

Provide:
1. Weak topics that need revision
2. Priority level (High/Medium/Low) for each
3. Suggested study approach
4. Encouraging feedback

Language: ${language}`;
    }
  },

  STUDY_PLANNER: {
    system: `You are SikshaBuddy. Create a realistic daily study plan based on exam date, 
available time, weak topics, and completed chapters. Be practical and achievable.`,
    
    user: (studentData, language = 'English') => {
      return `Create a personalized study plan for this student:

Exam Type: ${studentData.examType}
Exam Date: ${studentData.examDate}
Daily Available Time: ${studentData.dailyTimeMinutes} minutes
Weak Topics: ${studentData.weakTopics?.join(', ') || 'None identified yet'}
Completed Chapters: ${studentData.completedChapters?.length || 0}
Remaining Days: ${studentData.remainingDays}

Generate:
1. Daily micro-plan for next 7 days
2. Revision slots for weak topics
3. Mock test days
4. Realistic time allocation

Language: ${language}

Format as JSON with daily plans.`;
    }
  },

  FLASHCARDS: {
    system: `You are SikshaBuddy. Generate flashcards from the provided content. 
Each flashcard should have a question/term on front and answer/definition on back.`,
    
    user: (content, numCards = 20, language = 'English') => {
      return `Generate ${numCards} flashcards from this content:

${content}

Requirements:
- Front: Question or term
- Back: Concise answer or definition
- Based ONLY on provided content
- Language: ${language}

Format as JSON:
{
  "cards": [
    {
      "front": "...",
      "back": "..."
    }
  ]
}`;
    }
  },

  EXPLAIN_SIMPLE: {
    system: `You are SikshaBuddy. Explain concepts like a patient teacher to a 12-year-old. 
Use simple analogies and avoid jargon.`,
    
    user: (concept, content, language = 'English') => {
      return `Explain this concept simply: "${concept}"

From this content:
${content}

Requirements:
- Explain like student is 12 years old
- Use simple analogies
- Avoid technical jargon
- Be encouraging
- Language: ${language}`;
    }
  }
};

module.exports = PROMPTS;


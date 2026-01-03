import { ExamLevel } from './types'

export const examLevels: ExamLevel[] = [
  // School Level
  {
    id: 'class-6',
    name: 'Class 6',
    category: 'school',
    description: 'Elementary level with basic concepts'
  },
  {
    id: 'class-7',
    name: 'Class 7',
    category: 'school',
    description: 'Middle school level'
  },
  {
    id: 'class-8',
    name: 'Class 8',
    category: 'school',
    description: 'Pre-secondary level'
  },
  {
    id: 'class-9',
    name: 'Class 9',
    category: 'school',
    description: 'Secondary level foundation'
  },
  {
    id: 'class-10',
    name: 'Class 10',
    category: 'school',
    description: 'Board exam preparation'
  },
  
  // Board Level
  {
    id: 'cbse-11',
    name: 'CBSE Class 11',
    category: 'board',
    description: 'Higher secondary first year'
  },
  {
    id: 'cbse-12',
    name: 'CBSE Class 12',
    category: 'board',
    description: 'Higher secondary board exams'
  },
  {
    id: 'icse-11',
    name: 'ICSE Class 11',
    category: 'board',
    description: 'ICSE higher secondary'
  },
  {
    id: 'icse-12',
    name: 'ICSE Class 12',
    category: 'board',
    description: 'ICSE board exams'
  },
  {
    id: 'state-board',
    name: 'State Board',
    category: 'board',
    description: 'State-specific curriculum'
  },
  
  // Competitive Exams
  {
    id: 'jee-main',
    name: 'JEE Main',
    category: 'competitive',
    description: 'Engineering entrance exam'
  },
  {
    id: 'jee-advanced',
    name: 'JEE Advanced',
    category: 'competitive',
    description: 'IIT entrance exam'
  },
  {
    id: 'neet',
    name: 'NEET',
    category: 'competitive',
    description: 'Medical entrance exam'
  },
  {
    id: 'upsc-prelims',
    name: 'UPSC Prelims',
    category: 'competitive',
    description: 'Civil services preliminary exam'
  },
  {
    id: 'upsc-mains',
    name: 'UPSC Mains',
    category: 'competitive',
    description: 'Civil services main exam'
  },
  {
    id: 'ssc-cgl',
    name: 'SSC CGL',
    category: 'government',
    description: 'Staff Selection Commission exam'
  },
  {
    id: 'bank-po',
    name: 'Bank PO',
    category: 'government',
    description: 'Banking probationary officer'
  },
  {
    id: 'cat',
    name: 'CAT',
    category: 'competitive',
    description: 'Management entrance exam'
  },
  
  // College Level
  {
    id: 'btech-sem',
    name: 'B.Tech Semester',
    category: 'college',
    description: 'Engineering semester exams'
  },
  {
    id: 'bsc-sem',
    name: 'B.Sc Semester',
    category: 'college',
    description: 'Science semester exams'
  },
  {
    id: 'bcom-sem',
    name: 'B.Com Semester',
    category: 'college',
    description: 'Commerce semester exams'
  },
  {
    id: 'ba-sem',
    name: 'B.A Semester',
    category: 'college',
    description: 'Arts semester exams'
  },
  
  // Custom
  {
    id: 'custom',
    name: 'Custom Exam',
    category: 'custom',
    description: 'Create your own exam level'
  }
]

export const getExamLevelsByCategory = (category: string) => {
  return examLevels.filter(level => level.category === category)
}

export const getExamLevelById = (id: string) => {
  return examLevels.find(level => level.id === id)
}
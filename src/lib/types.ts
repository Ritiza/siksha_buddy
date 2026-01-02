export interface ExamLevel {
  id: string
  name: string
  category: 'school' | 'board' | 'competitive' | 'college' | 'government' | 'custom'
  description: string
}

export interface StudyMaterial {
  id: string
  name: string
  type: 'pdf' | 'ppt' | 'doc' | 'image' | 'text'
  content: string
  topics: string[]
  uploadedAt: Date
}

export interface StudyPlan {
  id: string
  examLevel: ExamLevel
  examDate: Date
  dailyHours: number
  language: 'english' | 'hindi' | 'hinglish'
  topics: string[]
  schedule: StudySchedule[]
  createdAt: Date
}

export interface StudySchedule {
  date: Date
  topic: string
  hours: number
  type: 'learn' | 'practice' | 'revise' | 'test'
  completed: boolean
}

export interface Flashcard {
  id: string
  front: string
  back: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  nextReview: Date
  interval: number
  easeFactor: number
}

export interface Quiz {
  id: string
  title: string
  topic: string
  questions: Question[]
  timeLimit: number
  language: 'english' | 'hindi' | 'hinglish'
}

export interface Question {
  id: string
  type: 'mcq' | 'short' | 'fill' | 'numeric'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface PodcastLesson {
  id: string
  title: string
  topic: string
  content: string
  audioUrl?: string
  duration: number
  language: 'english' | 'hindi' | 'hinglish'
  voice: 'male' | 'female'
  tone: 'friendly' | 'professional' | 'motivational'
}

export interface UserProgress {
  topicsCompleted: string[]
  weakAreas: string[]
  strongAreas: string[]
  dailyStreak: number
  totalStudyHours: number
  quizScores: { [topic: string]: number[] }
}
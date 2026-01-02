import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StudyPlan, Flashcard, Quiz, PodcastLesson, UserProgress } from './types'

interface AppState {
  // User data
  user: {
    name: string
    examLevel: string
    examDate: string
    dailyHours: number
    language: string
  } | null
  
  // Study materials
  uploadedFiles: File[]
  extractedContent: {
    topics: string[]
    keyTerms: string[]
    difficulty: string
    estimatedStudyTime: string
    suggestedSchedule: string
    rawContent?: string
  } | null
  
  // Generated content
  flashcards: Flashcard[]
  quizzes: Quiz[]
  studyPlan: StudyPlan | null
  podcastLessons: PodcastLesson[]
  
  // Progress
  progress: UserProgress
  
  // Actions
  setUser: (user: any) => void
  addUploadedFiles: (files: File[]) => void
  setExtractedContent: (content: any) => void
  generateFlashcards: (content: string) => Promise<void>
  generateQuiz: (content: string, questionCount?: number) => Promise<void>
  generateStudyPlan: (examDate: string, topics: string[], dailyHours: number) => void
  generatePodcastLesson: (topic: string, content: string) => void
  updateProgress: (progress: Partial<UserProgress>) => void
  clearFlashcards: () => void
  clearUploadedFiles: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      uploadedFiles: [],
      extractedContent: null,
      flashcards: [],
      quizzes: [],
      studyPlan: null,
      podcastLessons: [],
      progress: {
        topicsCompleted: [],
        weakAreas: [],
        strongAreas: [],
        dailyStreak: 0,
        totalStudyHours: 0,
        quizScores: {}
      },

      setUser: (user) => set({ user }),

      addUploadedFiles: (files) => set((state) => ({
        uploadedFiles: [...state.uploadedFiles, ...files]
      })),

      setExtractedContent: (content) => set({ extractedContent: content }),

      generateFlashcards: async (content) => {
        try {
          console.log('Store: Starting flashcard generation...')
          // Import AI service dynamically to avoid issues
          const { AIService } = await import('./ai-service')
          console.log('Store: AI Service imported successfully')
          const newFlashcards = AIService.generateFlashcards(content, 10)
          console.log('Store: Generated flashcards:', newFlashcards.length, 'cards')
          console.log('Store: First flashcard:', newFlashcards[0])
          set(() => ({
            flashcards: newFlashcards // Replace existing flashcards with new ones
          }))
          console.log('Store: Flashcards saved to store')
        } catch (error) {
          console.error('Error generating flashcards:', error)
        }
      },

      generateQuiz: async (content, questionCount = 5) => {
        try {
          const { AIService } = await import('./ai-service')
          const newQuiz = AIService.generateQuiz(content, questionCount)
          set((state) => ({
            quizzes: [...state.quizzes, newQuiz]
          }))
        } catch (error) {
          console.error('Error generating quiz:', error)
        }
      },

      generateStudyPlan: (examDate, topics, dailyHours) => {
        const startDate = new Date()
        const endDate = new Date(examDate)
        const daysLeft = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        
        const schedule = []
        for (let i = 0; i < Math.min(daysLeft, 30); i++) {
          const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
          const topic = topics[i % topics.length] || 'Review'
          
          schedule.push({
            date,
            topic,
            hours: dailyHours,
            type: (i % 3 === 0 ? 'learn' : i % 3 === 1 ? 'practice' : 'revise') as 'learn' | 'practice' | 'revise',
            completed: false
          })
        }

        const newStudyPlan: StudyPlan = {
          id: `plan-${Date.now()}`,
          examLevel: (get().user?.examLevel || 'intermediate') as any,
          examDate: new Date(examDate),
          dailyHours,
          language: 'english',
          topics,
          schedule,
          createdAt: new Date()
        }

        set({ studyPlan: newStudyPlan })
      },

      generatePodcastLesson: (topic, content) => {
        const newLesson: PodcastLesson = {
          id: `podcast-${Date.now()}`,
          title: `${topic} - Audio Lesson`,
          topic,
          content: content.substring(0, 500) + '...',
          duration: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
          language: 'english',
          voice: 'female',
          tone: 'friendly'
        }

        set((state) => ({
          podcastLessons: [...state.podcastLessons, newLesson]
        }))
      },

      updateProgress: (newProgress) => set((state) => ({
        progress: { ...state.progress, ...newProgress }
      })),

      clearFlashcards: () => set(() => ({
        flashcards: []
      })),

      clearUploadedFiles: () => set(() => ({
        uploadedFiles: []
      }))
    }),
    {
      name: 'shiksha-buddy-storage'
    }
  )
)
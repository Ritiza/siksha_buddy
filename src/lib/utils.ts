import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function calculateDaysUntilExam(examDate: Date): number {
  const today = new Date()
  const diffTime = examDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function generateStudyPlan(topics: string[], examDate: Date, dailyHours: number) {
  const daysLeft = calculateDaysUntilExam(examDate)
  const totalHours = daysLeft * dailyHours
  const hoursPerTopic = totalHours / topics.length
  
  const plan = []
  let currentDate = new Date()
  
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]
    const daysForTopic = Math.ceil(hoursPerTopic / dailyHours)
    
    for (let day = 0; day < daysForTopic; day++) {
      plan.push({
        date: new Date(currentDate.getTime() + (day * 24 * 60 * 60 * 1000)),
        topic,
        hours: dailyHours,
        type: day === 0 ? 'learn' : day === daysForTopic - 1 ? 'revise' : 'practice'
      })
    }
    
    currentDate = new Date(currentDate.getTime() + (daysForTopic * 24 * 60 * 60 * 1000))
  }
  
  return plan
}
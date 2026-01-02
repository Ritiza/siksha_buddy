'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen, Brain, Clock, Target, TrendingUp, Award, Zap } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const examDate = new Date('2024-05-15')
  const daysLeft = Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const stats = [
    { label: 'Days Left', value: daysLeft, icon: Calendar, color: 'text-red-500' },
    { label: 'Study Streak', value: '12', icon: Zap, color: 'text-orange-500' },
    { label: 'Topics Completed', value: '24/45', icon: BookOpen, color: 'text-green-500' },
    { label: 'Quiz Average', value: '78%', icon: Brain, color: 'text-blue-500' }
  ]

  const todayTasks = [
    { time: '9:00 AM', subject: 'Mathematics', topic: 'Calculus - Derivatives', type: 'learn', duration: '2h' },
    { time: '11:30 AM', subject: 'Physics', topic: 'Mechanics - Motion', type: 'practice', duration: '1.5h' },
    { time: '2:00 PM', subject: 'Chemistry', topic: 'Organic Chemistry', type: 'revise', duration: '1h' },
    { time: '4:00 PM', subject: 'Mathematics', topic: 'Algebra Quiz', type: 'test', duration: '30m' }
  ]

  const weakAreas = [
    { subject: 'Physics', topic: 'Thermodynamics', score: 45 },
    { subject: 'Chemistry', topic: 'Electrochemistry', score: 52 },
    { subject: 'Mathematics', topic: 'Probability', score: 58 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Good morning, Priya! 👋✨
              </h1>
              <p className="text-gray-700 mt-1 text-lg">Ready to ace your JEE preparation today? Let's make it amazing! 🚀</p>
            </div>
            <div className="text-right bg-gradient-to-r from-orange-100 to-pink-100 p-4 rounded-2xl border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">{daysLeft} days</div>
              <div className="text-sm text-gray-700 font-medium">until JEE Main 🎯</div>
              <div className="text-xs text-orange-500 mt-1">You've got this! 💪</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-dark-500">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Your personalized study plan for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-500 w-16">{task.time}</div>
                        <div>
                          <div className="font-medium text-dark-500">{task.topic}</div>
                          <div className="text-sm text-gray-600">{task.subject}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.type === 'learn' ? 'bg-blue-100 text-blue-700' :
                          task.type === 'practice' ? 'bg-green-100 text-green-700' :
                          task.type === 'revise' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {task.type}
                        </span>
                        <span className="text-sm text-gray-500">{task.duration}</span>
                        <Button size="sm">Start</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/flashcards">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Practice Flashcards
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/quiz">
                    <Brain className="w-4 h-4 mr-2" />
                    Take a Quiz
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/upload">
                    <Target className="w-4 h-4 mr-2" />
                    Upload Notes
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Weak Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{area.topic}</div>
                        <div className="text-xs text-gray-600">{area.subject}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-500">{area.score}%</div>
                        <Button size="sm" variant="outline" className="text-xs h-6 px-2 mt-1">
                          Practice
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="bg-gradient-to-r from-gold-50 to-gold-100 border-gold-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gold-700">
                  <Award className="w-5 h-5 mr-2" />
                  Achievement Unlocked!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gold-600">
                  🔥 12-day study streak! You're on fire! Keep up the momentum.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Brain, Calendar, FileText, Headphones, Upload, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-orange-50 to-yellow-50">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                ShikshaBuddy
              </span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Features</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Pricing</Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">About</Link>
              <Button asChild className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg">
                <Link href="/exam-planner">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-6xl font-bold text-gray-800 mb-6 leading-tight"
            >
              Your AI Study Companion for{' '}
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse-warm">
                Success in Every Exam
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              🚀 Upload your study materials, choose your exam, and let our AI create a personalized study journey with 
              <span className="font-semibold text-orange-600"> smart flashcards</span>, 
              <span className="font-semibold text-pink-600"> adaptive quizzes</span>, and 
              <span className="font-semibold text-purple-600"> podcast lessons</span> in Hindi, English, or Hinglish.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" asChild>
                <Link href="/exam-planner">
                  <Calendar className="w-5 h-5 mr-2" />
                  Create Study Plan ✨
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" asChild>
                <Link href="/upload">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Notes 📚
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-orange-300 to-pink-400 rounded-full opacity-30 animate-float blur-sm"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-gradient-to-r from-indigo-300 to-blue-400 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        
        {/* Decorative Icons */}
        <div className="absolute top-32 right-32 text-4xl animate-bounce-gentle opacity-60" style={{ animationDelay: '0.5s' }}>📚</div>
        <div className="absolute bottom-40 right-16 text-3xl animate-bounce-gentle opacity-60" style={{ animationDelay: '1.5s' }}>🎯</div>
        <div className="absolute top-1/2 left-16 text-3xl animate-bounce-gentle opacity-60" style={{ animationDelay: '2.5s' }}>🚀</div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-500 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From JEE to NEET, UPSC to Board Exams - our AI adapts to your exam level and creates the perfect study strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto ${feature.color} shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                    <div className="text-3xl mt-3 opacity-80">{feature.emoji}</div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Levels Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-aqua-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-500 mb-4">
              Supports All Indian Exams
            </h2>
            <p className="text-xl text-gray-600">
              From school level to competitive exams, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {examTypes.map((exam, index) => (
              <motion.div
                key={exam}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-gray-700">{exam}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-aqua-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students who are already studying smarter with ShikshaBuddy AI
          </p>
          <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100" asChild>
            <Link href="/exam-planner">
              Start Your Personalized Study Plan
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-aqua-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ShikshaBuddy</span>
              </div>
              <p className="text-gray-400">
                AI-powered study companion for Indian students
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Study Planner</li>
                <li>AI Flashcards</li>
                <li>Smart Quizzes</li>
                <li>Podcast Lessons</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Exams</h3>
              <ul className="space-y-2 text-gray-400">
                <li>JEE Main/Advanced</li>
                <li>NEET</li>
                <li>UPSC</li>
                <li>Board Exams</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShikshaBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: 'Smart Study Planner 📅',
    description: 'AI creates personalized daily schedules based on your exam date and study materials. Never miss a topic again!',
    icon: Calendar,
    color: 'bg-gradient-to-br from-orange-400 to-red-500',
    emoji: '🎯'
  },
  {
    title: 'AI Flashcards 🃏',
    description: 'Spaced repetition system with cards generated from your uploaded notes. Learn smarter, not harder!',
    icon: BookOpen,
    color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    emoji: '🧠'
  },
  {
    title: 'Smart Quizzes 🎮',
    description: 'Adaptive quizzes that identify weak areas and adjust difficulty automatically. Make learning fun!',
    icon: Brain,
    color: 'bg-gradient-to-br from-pink-400 to-purple-500',
    emoji: '⚡'
  },
  {
    title: 'Document Upload 📤',
    description: 'Upload PDFs, PPTs, images, and handwritten notes for AI analysis. Your notes, supercharged!',
    icon: Upload,
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    emoji: '🔥'
  },
  {
    title: 'Podcast Lessons 🎧',
    description: 'Audio lessons in Hindi, English, or Hinglish with customizable voice and tone. Learn on the go!',
    icon: Headphones,
    color: 'bg-gradient-to-br from-green-400 to-teal-500',
    emoji: '🎵'
  },
  {
    title: 'Multi-language Support 🌍',
    description: 'Study in Hindi, English, or Hinglish with Indian examples and context. Your language, your way!',
    icon: Users,
    color: 'bg-gradient-to-br from-purple-400 to-pink-500',
    emoji: '💫'
  }
]

const examTypes = [
  'JEE Main', 'JEE Advanced', 'NEET', 'UPSC', 'SSC CGL', 'Bank PO',
  'CBSE 12th', 'ICSE 12th', 'State Board', 'CAT', 'GATE', 'NDA'
]

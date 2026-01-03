'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, XCircle, Brain, Target, Trophy, Plus } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'

export default function QuizPage() {
  const { quizzes, generateQuiz } = useAppStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)

  // Generate sample quiz if none exist
  useEffect(() => {
    if (quizzes.length === 0) {
      const sampleContent = "derivatives calculus integration mathematics physics mechanics chemistry organic compounds"
      generateQuiz(sampleContent, 5)
    }
  }, [quizzes.length, generateQuiz])

  const quiz = quizzes[currentQuizIndex] || {
    title: "Sample Quiz 📚",
    topic: "Mixed Topics",
    questions: [],
    timeLimit: 300,
    language: 'english'
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    if (!quiz.questions || quiz.questions.length === 0) return 0
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index]?.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Empty state when no quizzes exist
  if (quizzes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-12">
                <div className="text-6xl mb-6">🧠</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">No Quizzes Available</h2>
                <p className="text-gray-600 mb-8 text-lg">Upload some study materials to generate personalized quizzes!</p>
                <Button asChild className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600" size="lg">
                  <Link href="/upload">
                    <Plus className="w-5 h-5 mr-2" />
                    Upload Materials & Generate Quiz
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <div className="text-6xl mb-4">
                  {score >= 80 ? '🎉' : score >= 60 ? '👏' : '💪'}
                </div>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  Quiz Complete!
                </CardTitle>
                <CardDescription className="text-lg">
                  {quiz.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-600 mb-2">{score}%</div>
                  <div className="text-gray-600">Your Score</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="font-bold text-green-700">
                      {answers.filter((answer, index) => answer === quiz.questions[index]?.correctAnswer).length}
                    </div>
                    <div className="text-sm text-green-600">Correct</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="font-bold text-red-700">
                      {answers.filter((answer, index) => answer !== quiz.questions[index]?.correctAnswer).length}
                    </div>
                    <div className="text-sm text-red-600">Incorrect</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="font-bold text-blue-700">{quiz.questions.length}</div>
                    <div className="text-sm text-blue-600">Total</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Review Answers:</h3>
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium mb-2">{question.question}</div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded ${
                          answers[index] === question.correctAnswer 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          Your answer: {answers[index] || 'Not answered'}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          Correct: {question.correctAnswer}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">{question.explanation}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center space-x-4">
                  <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-orange-500 to-pink-500">
                    Take Another Quiz
                  </Button>
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.subject} • {quiz.topic}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-orange-700">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-400 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                {quiz.questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === option
                        ? 'border-orange-400 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option
                          ? 'border-orange-400 bg-orange-400'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === option && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">AI Adaptive</div>
              <div className="text-sm text-gray-600">Difficulty adjusts to your performance</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">Instant Feedback</div>
              <div className="text-sm text-gray-600">Learn from detailed explanations</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">Track Progress</div>
              <div className="text-sm text-gray-600">Monitor your improvement over time</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
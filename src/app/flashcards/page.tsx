'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, ChevronLeft, ChevronRight, Brain, BookOpen, Target, Plus } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'

export default function FlashcardsPage() {
  const { flashcards, generateFlashcards } = useAppStore()
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  // Don't auto-generate sample flashcards - let users upload materials first

  const difficulties = [
    { id: 'easy', name: 'Easy', color: 'bg-green-500', count: flashcards.filter(f => f.difficulty === 'easy').length },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-500', count: flashcards.filter(f => f.difficulty === 'medium').length },
    { id: 'hard', name: 'Hard', color: 'bg-red-500', count: flashcards.filter(f => f.difficulty === 'hard').length }
  ]

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setIsFlipped(false)
  }

  const handleDifficultyResponse = (difficulty: string) => {
    setSelectedDifficulty(difficulty)
    setTimeout(() => {
      nextCard()
      setSelectedDifficulty('')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Flashcards</h1>
              <p className="text-gray-600">Spaced repetition learning system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Card {currentCard + 1} of {flashcards.length}
              </div>
              <div className="flex space-x-2">
                {difficulties.map((diff) => (
                  <div key={diff.id} className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full ${diff.color}`}></div>
                    <span className="text-sm text-gray-600">{diff.count}</span>
                  </div>
                ))}
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
            <span>{Math.round(((currentCard + 1) / flashcards.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        {flashcards.length === 0 ? (
          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-2xl h-96 flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-dashed border-orange-200">
              <CardContent className="text-center">
                <div className="text-6xl mb-4">🃏</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No Flashcards Yet</h3>
                <p className="text-gray-600 mb-6">Upload some study materials to generate flashcards automatically!</p>
                <Button asChild className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  <Link href="/upload">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Materials
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-2xl h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Card 
                  className="w-full h-full cursor-pointer transform-gpu perspective-1000"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <CardContent className="p-8 h-full flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {!isFlipped ? (
                        <motion.div
                          key="front"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center"
                        >
                          <div className="mb-4">
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                              {flashcards[currentCard]?.topic || 'Study Topic'}
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                            {flashcards[currentCard]?.front || 'No flashcards available'}
                          </h2>
                          <p className="text-gray-500 text-sm">Click to reveal answer ✨</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="back"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center"
                        >
                          <div className="mb-4">
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                              Answer 💡
                            </span>
                          </div>
                          <div className="text-lg text-gray-800 whitespace-pre-line leading-relaxed">
                            {flashcards[currentCard]?.back || 'Answer not available'}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={prevCard}
            disabled={currentCard === 0}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Flip Card
          </Button>
          
          <Button
            size="lg"
            onClick={nextCard}
            disabled={currentCard === flashcards.length - 1}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Difficulty Rating */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-gray-600 mb-4">How difficult was this card?</p>
            <div className="flex justify-center space-x-4">
              {difficulties.map((diff) => (
                <Button
                  key={diff.id}
                  variant={selectedDifficulty === diff.id ? "default" : "outline"}
                  onClick={() => handleDifficultyResponse(diff.id)}
                  className={selectedDifficulty === diff.id ? diff.color : ''}
                >
                  {diff.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">85%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">127</div>
              <div className="text-sm text-gray-600">Cards Reviewed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">12</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
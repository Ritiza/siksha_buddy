'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Headphones, Mic, Settings } from 'lucide-react'

export default function PodcastPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState(0)
  const [selectedVoice, setSelectedVoice] = useState('female')
  const [selectedLanguage, setSelectedLanguage] = useState('hinglish')
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)

  const episodes = [
    {
      id: 1,
      title: "Calculus Made Simple 🧮",
      subject: "Mathematics",
      topic: "Calculus - Derivatives",
      duration: "12:45",
      description: "Learn derivatives step by step with easy examples and real-world applications",
      difficulty: "Intermediate",
      language: "Hinglish",
      voice: "Female",
      thumbnail: "🧮"
    },
    {
      id: 2,
      title: "Newton's Laws Explained 🚀",
      subject: "Physics",
      topic: "Mechanics",
      duration: "15:30",
      description: "Understanding motion and forces through Newton's three fundamental laws",
      difficulty: "Beginner",
      language: "Hindi",
      voice: "Male",
      thumbnail: "🚀"
    },
    {
      id: 3,
      title: "Organic Chemistry Basics 🧪",
      subject: "Chemistry",
      topic: "Organic Chemistry",
      duration: "18:20",
      description: "Introduction to carbon compounds and their fascinating properties",
      difficulty: "Intermediate",
      language: "English",
      voice: "Female",
      thumbnail: "🧪"
    },
    {
      id: 4,
      title: "Photosynthesis Journey 🌱",
      subject: "Biology",
      topic: "Plant Biology",
      duration: "14:15",
      description: "How plants convert sunlight into energy - nature's amazing process",
      difficulty: "Beginner",
      language: "Hinglish",
      voice: "Male",
      thumbnail: "🌱"
    }
  ]

  const voiceOptions = [
    { id: 'female', name: 'Priya (Female)', accent: 'Indian English' },
    { id: 'male', name: 'Arjun (Male)', accent: 'Indian English' }
  ]

  const languageOptions = [
    { id: 'english', name: 'English', flag: '🇬🇧' },
    { id: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { id: 'hinglish', name: 'Hinglish', flag: '🇮🇳' }
  ]

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const nextEpisode = () => {
    setCurrentEpisode((prev) => (prev + 1) % episodes.length)
  }

  const prevEpisode = () => {
    setCurrentEpisode((prev) => (prev - 1 + episodes.length) % episodes.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              AI Podcast Lessons 🎧
            </h1>
            <p className="text-gray-600 text-lg">Learn on the go with personalized audio lessons</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Now Playing */}
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-0 shadow-xl">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4 animate-bounce-gentle">
                  {episodes[currentEpisode].thumbnail}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {episodes[currentEpisode].title}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  {episodes[currentEpisode].subject} • {episodes[currentEpisode].topic}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 text-center leading-relaxed">
                  {episodes[currentEpisode].description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full w-1/3 transition-all duration-300"></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>4:20</span>
                    <span>{episodes[currentEpisode].duration}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={prevEpisode}
                    className="rounded-full w-12 h-12"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={nextEpisode}
                    className="rounded-full w-12 h-12"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Volume
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    {speedOptions.map(speed => (
                      <option key={speed} value={speed}>{speed}x</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Episode List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headphones className="w-5 h-5 mr-2" />
                  All Episodes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {episodes.map((episode, index) => (
                    <motion.div
                      key={episode.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setCurrentEpisode(index)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        currentEpisode === index
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200'
                          : 'hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{episode.thumbnail}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{episode.title}</h3>
                          <p className="text-sm text-gray-600">{episode.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{episode.duration}</span>
                            <span>•</span>
                            <span>{episode.difficulty}</span>
                            <span>•</span>
                            <span>{episode.language}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={currentEpisode === index ? "default" : "outline"}
                          className={currentEpisode === index ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
                        >
                          {currentEpisode === index && isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="w-5 h-5 mr-2" />
                  Voice Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice
                  </label>
                  <div className="space-y-2">
                    {voiceOptions.map((voice) => (
                      <button
                        key={voice.id}
                        onClick={() => setSelectedVoice(voice.id)}
                        className={`w-full p-3 text-left rounded-lg border transition-colors ${
                          selectedVoice === voice.id
                            ? 'border-purple-400 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-sm text-gray-600">{voice.accent}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setSelectedLanguage(lang.id)}
                        className={`p-3 rounded-lg border transition-colors ${
                          selectedLanguage === lang.id
                            ? 'border-purple-400 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12h 45m</div>
                  <div className="text-sm text-gray-600">Total Listening Time</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">24</div>
                    <div className="text-xs text-gray-600">Episodes</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">8</div>
                    <div className="text-xs text-gray-600">Subjects</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate New Episode */}
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-700">Create Custom Episode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-600 mb-4">
                  Upload your notes and we'll create a personalized podcast episode for you!
                </p>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Generate Episode
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
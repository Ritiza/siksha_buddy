'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, BookOpen, Target, Upload, ArrowRight, CheckCircle, FileText } from 'lucide-react'
import { examLevels, getExamLevelsByCategory } from '@/lib/exam-levels'
import { calculateDaysUntilExam, generateStudyPlan } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ExamPlannerPage() {
  const router = useRouter()
  const { setUser, generateStudyPlan: createStudyPlan, uploadedFiles, addUploadedFiles } = useAppStore()
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [examDate, setExamDate] = useState('')
  const [dailyHours, setDailyHours] = useState(4)
  const [language, setLanguage] = useState('english')
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)

  const categories = [
    { id: 'school', name: 'School Level', description: 'Classes 6-10 📖', icon: '🏫', color: 'hover:bg-orange-50 hover:border-orange-300' },
    { id: 'board', name: 'Board Exams', description: 'CBSE, ICSE, State Boards 📋', icon: '📚', color: 'hover:bg-blue-50 hover:border-blue-300' },
    { id: 'competitive', name: 'Competitive Exams', description: 'JEE, NEET, CAT 🚀', icon: '🎯', color: 'hover:bg-purple-50 hover:border-purple-300' },
    { id: 'government', name: 'Government Jobs', description: 'UPSC, SSC, Banking 🏆', icon: '🏛️', color: 'hover:bg-green-50 hover:border-green-300' },
    { id: 'college', name: 'College Exams', description: 'Semester exams 🎓', icon: '🎓', color: 'hover:bg-pink-50 hover:border-pink-300' },
    { id: 'custom', name: 'Custom Exam', description: 'Create your own ✨', icon: '⚙️', color: 'hover:bg-yellow-50 hover:border-yellow-300' }
  ]

  const languages = [
    { id: 'english', name: 'English', flag: '🇬🇧' },
    { id: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { id: 'hinglish', name: 'Hinglish', flag: '🇮🇳' }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    addUploadedFiles(files)
  }

  const generatePlan = () => {
    if (!examDate) return

    const topics = uploadedFiles.length > 0 
      ? uploadedFiles
          .filter(file => file && file.name) // Filter out undefined files
          .map(file => file.name.replace(/\.[^/.]+$/, ""))
      : ['Mathematics', 'Physics', 'Chemistry'] // Default topics

    // Save user preferences
    setUser({
      name: 'Student',
      examLevel: selectedExam,
      examDate,
      dailyHours,
      language
    })

    // Generate study plan
    createStudyPlan(examDate, topics, dailyHours)
    
    setGeneratedPlan({
      examLevel: examLevels.find(e => e.id === selectedExam),
      examDate: new Date(examDate),
      dailyHours,
      language,
      topics,
      schedule: generateStudyPlan(topics, new Date(examDate), dailyHours),
      daysLeft: calculateDaysUntilExam(new Date(examDate))
    })
    
    setStep(5)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Exam Planner</h1>
              <p className="text-gray-600">Create your personalized AI study program</p>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= i ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > i ? <CheckCircle className="w-4 h-4" /> : i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 1: Select Exam Category */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Select Your Exam Category</h2>
              <p className="text-gray-600">Choose the type of exam you're preparing for</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    selectedCategory === category.id 
                      ? 'ring-2 ring-orange-400 bg-gradient-to-br from-orange-50 to-pink-50 shadow-lg' 
                      : `border-gray-200 ${category.color}`
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader className="text-center">
                    <div className="text-5xl mb-3 animate-bounce-gentle">{category.icon}</div>
                    <CardTitle className="text-lg font-bold text-gray-800">{category.name}</CardTitle>
                    <CardDescription className="text-gray-600">{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedCategory}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Specific Exam */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Select Your Exam</h2>
              <p className="text-gray-600">Choose the specific exam you're preparing for</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getExamLevelsByCategory(selectedCategory).map((exam) => (
                <Card
                  key={exam.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedExam === exam.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                  }`}
                  onClick={() => setSelectedExam(exam.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{exam.name}</CardTitle>
                    <CardDescription>{exam.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedExam}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Exam Date & Preferences */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Set Your Preferences</h2>
              <p className="text-gray-600">Configure your study schedule and language</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Exam Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {examDate && (
                    <p className="text-sm text-gray-600 mt-2">
                      {calculateDaysUntilExam(new Date(examDate))} days remaining
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Daily Study Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>1 hour</span>
                    <span className="font-medium">{dailyHours} hours</span>
                    <span>12 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Preferred Language</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        language === lang.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{lang.flag}</div>
                      <div className="font-medium">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!examDate}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Upload Materials */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload Study Materials</h2>
              <p className="text-gray-600">Upload your notes, textbooks, and study materials</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Files
                </CardTitle>
                <CardDescription>
                  Supported formats: PDF, PPT, DOC, Images, Handwritten notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Maximum file size: 10MB per file
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-500 mr-3" />
                            <span className="text-sm font-medium">{file.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                onClick={generatePlan}
                disabled={uploadedFiles.length === 0}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Generate Study Plan <Target className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Generated Plan */}
        {step === 5 && generatedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Personalized Study Plan</h2>
              <p className="text-gray-600">AI-generated plan based on your materials and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Days Remaining</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-indigo-500">{generatedPlan.daysLeft}</div>
                  <p className="text-gray-600">until {generatedPlan.examLevel?.name}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Daily Study Time</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-blue-500">{generatedPlan.dailyHours}h</div>
                  <p className="text-gray-600">per day</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Topics to Cover</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-yellow-500">{generatedPlan.topics.length}</div>
                  <p className="text-gray-600">subjects</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Study Schedule Preview</CardTitle>
                <CardDescription>First 7 days of your personalized plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedPlan.schedule.slice(0, 7).map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{day.date.toLocaleDateString()}</div>
                        <div className="text-sm text-gray-600">{day.topic}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{day.hours}h</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          day.type === 'learn' ? 'bg-blue-100 text-blue-700' :
                          day.type === 'practice' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {day.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button asChild className="bg-indigo-500 hover:bg-indigo-600">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/flashcards">
                  Start with Flashcards
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
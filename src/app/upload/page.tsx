'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Image, FileCheck, Brain, BookOpen, Headphones, Zap, Calendar, Clock, Target, Play, Download, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { examLevels } from '@/lib/exam-levels'

export default function UploadPage() {
  const router = useRouter()
  const { 
    uploadedFiles, 
    extractedContent, 
    addUploadedFiles, 
    setExtractedContent,
    generateFlashcards,
    generateQuiz,
    generatePodcastLesson,
    setUser,
    generateStudyPlan,
    clearUploadedFiles
  } = useAppStore()
  
  // Single-upload workflow states
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [selectedExamLevel, setSelectedExamLevel] = useState('')
  const [examDate, setExamDate] = useState('')
  const [dailyHours, setDailyHours] = useState(3)
  const [language, setLanguage] = useState('english')
  const [generatedPackage, setGeneratedPackage] = useState<any>(null)
  const [showExamSelection, setShowExamSelection] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    // Validate files before adding to store
    const validFiles = files.filter(file => file && file.name && file.size > 0)
    
    if (validFiles.length > 0) {
      addUploadedFiles(validFiles)
      setShowExamSelection(true)
    } else {
      alert('Please select valid files to upload.')
    }
  }

  // Single-click comprehensive generation
  const generateCompleteStudyPackage = async () => {
    if (!selectedExamLevel || !examDate || uploadedFiles.length === 0) {
      alert('Please select exam level, date, and upload files first!')
      return
    }

    setIsProcessing(true)
    
    try {
      // Step 1: Parsing & Analysis
      setProcessingStep('Parsing uploaded files...')
      const { AIService } = await import('@/lib/ai-service')
      
      // Filter and validate files before processing
      const validFiles = uploadedFiles.filter(file => file && file.name && file.size > 0)
      
      if (validFiles.length === 0) {
        throw new Error('No valid files to process')
      }
      
      const analysisResults = await Promise.all(
        validFiles.map(file => AIService.analyzeFile(file))
      )
      
      // Step 2: Topic Extraction
      setProcessingStep('Extracting topics and key concepts...')
      const combinedTopics = [...new Set(analysisResults.flatMap(r => r.topics))]
      const combinedKeyTerms = [...new Set(analysisResults.flatMap(r => r.keyTerms))]
      const totalWordCount = analysisResults.reduce((sum, r) => sum + r.wordCount, 0)
      
      // Combine all extracted content from files
      const allExtractedContent = analysisResults
        .map(r => r.extractedContent || '')
        .filter(content => content.length > 0)
        .join('\n\n')
      
      console.log('Combined extracted content:', allExtractedContent.substring(0, 500) + '...')
      
      const extractedData = {
        topics: combinedTopics.slice(0, 12),
        keyTerms: combinedKeyTerms.slice(0, 15),
        difficulty: totalWordCount > 2000 ? 'advanced' : totalWordCount > 1000 ? 'intermediate' : 'beginner',
        estimatedStudyTime: `${Math.ceil(totalWordCount / 200)} hours`,
        suggestedSchedule: `${Math.ceil(totalWordCount / 500)} days intensive study`,
        rawContent: allExtractedContent // Store the actual file content
      }
      
      setExtractedContent(extractedData)
      
      // Step 3: Plan Generation
      setProcessingStep('Generating personalized study plan...')
      
      // Calculate days until exam
      const today = new Date()
      const examDateObj = new Date(examDate)
      const daysLeft = Math.ceil((examDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      // Save user preferences
      setUser({
        name: 'Student',
        examLevel: selectedExamLevel,
        examDate,
        dailyHours,
        language
      })
      
      // Generate study plan
      generateStudyPlan(examDate, extractedData.topics, dailyHours)
      
      // Step 4: Artifacts Generation
      setProcessingStep('Creating study materials...')
      
      // Create rich content for generation using ACTUAL FILE CONTENT
      const richContent = `
REAL STUDY MATERIAL CONTENT FOR ${selectedExamLevel}:

=== EXTRACTED FROM YOUR UPLOADED FILES ===
${extractedData.rawContent}

=== ANALYSIS FOR ${selectedExamLevel} EXAM ===
Exam Date: ${examDate} (${daysLeft} days remaining)
Daily Study Hours: ${dailyHours}
Language: ${language}

Topics Identified from Your Materials: ${extractedData.topics.join(', ')}
Key Terms from Your Content: ${extractedData.keyTerms.join(', ')}
Difficulty Level: ${extractedData.difficulty}
Total Study Time Required: ${extractedData.estimatedStudyTime}

=== STUDY FOCUS AREAS FROM YOUR CONTENT ===
${extractedData.topics.map((topic, i) => `
${i + 1}. ${topic} (from your uploaded materials)
   - This topic appears in your study files
   - Focus on understanding the concepts as presented in your materials
   - Review the specific examples and explanations from your content
   - Practice time: ${Math.ceil(dailyHours * 60 / extractedData.topics.length)} minutes daily
`).join('')}

=== KEY TERMINOLOGY FROM YOUR FILES ===
${extractedData.keyTerms.map((term, i) => `
${i + 1}. ${term} - Important term identified in your uploaded content
`).join('')}

This content is generated specifically from YOUR uploaded study materials for ${selectedExamLevel} exam preparation.
All flashcards, quizzes, and notes will be based on the actual content you provided.
`

      // Generate all study materials
      await Promise.all([
        generateFlashcards(richContent),
        generateQuiz(richContent, 10),
        generatePodcastLesson(extractedData.topics[0] || 'Study Material', richContent)
      ])
      
      // Step 5: Package Creation
      setProcessingStep('Finalizing study package...')
      
      const studyPackage = {
        examLevel: selectedExamLevel,
        examDate,
        daysLeft,
        dailyHours,
        language,
        topics: extractedData.topics,
        keyTerms: extractedData.keyTerms,
        difficulty: extractedData.difficulty,
        estimatedTime: extractedData.estimatedStudyTime,
        generatedAt: new Date().toISOString(),
        sourceFiles: uploadedFiles.map(f => f.name)
      }
      
      setGeneratedPackage(studyPackage)
      setProcessingStep('Complete! Your study package is ready.')
      
    } catch (error) {
      console.error('Error generating study package:', error)
      setProcessingStep('Error occurred. Please try again.')
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
        setProcessingStep('')
      }, 1000)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Study Materials</h1>
            <p className="text-gray-600">Upload your notes, textbooks, and study materials for AI analysis</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Single Upload Workflow */}
        {!generatedPackage ? (
          <div className="space-y-8">
            {/* Step 1: Upload Files */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-6 h-6 mr-2" />
                  Step 1: Upload Your Study Materials
                </CardTitle>
                <CardDescription>
                  Upload your notes, textbooks, PDFs - ShikshaBuddy will auto-generate everything from your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-orange-400 transition-colors">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Drop your study files here
                  </h3>
                  <p className="text-gray-500 mb-6">
                    PDF, PPT, DOC, Images, Handwritten notes - all supported
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose Files 📁
                    </label>
                  </Button>
                  <p className="text-xs text-gray-400 mt-4">
                    One upload → Complete study package generated automatically
                  </p>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-semibold mb-4 text-green-700">✅ Files Uploaded ({uploadedFiles.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            {file.type.includes('image') ? (
                              <Image className="w-5 h-5 text-green-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <FileCheck className="w-5 h-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Exam Selection */}
            {showExamSelection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-6 h-6 mr-2" />
                      Step 2: Select Your Exam & Preferences
                    </CardTitle>
                    <CardDescription>
                      Choose your exam level and date - we'll customize everything for your specific exam
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Exam Level Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Exam Level</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {examLevels.slice(0, 6).map((exam) => (
                          <button
                            key={exam.id}
                            onClick={() => setSelectedExamLevel(exam.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              selectedExamLevel === exam.id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium text-sm">{exam.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{exam.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Exam Date & Study Hours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Exam Date</label>
                        <input
                          type="date"
                          value={examDate}
                          onChange={(e) => setExamDate(e.target.value)}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Daily Study Hours</label>
                        <select
                          value={dailyHours}
                          onChange={(e) => setDailyHours(Number(e.target.value))}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value={1}>1 hour</option>
                          <option value={2}>2 hours</option>
                          <option value={3}>3 hours</option>
                          <option value={4}>4 hours</option>
                          <option value={5}>5 hours</option>
                          <option value={6}>6 hours</option>
                          <option value={8}>8 hours</option>
                        </select>
                      </div>
                    </div>

                    {/* Language Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Preferred Language</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'english', name: 'English', flag: '🇬🇧' },
                          { id: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
                          { id: 'hinglish', name: 'Hinglish', flag: '🇮🇳' }
                        ].map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => setLanguage(lang.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              language === lang.id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-2xl mb-2">{lang.flag}</div>
                            <div className="font-medium text-sm">{lang.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <div className="text-center pt-4">
                      <Button
                        onClick={generateCompleteStudyPackage}
                        disabled={!selectedExamLevel || !examDate || isProcessing}
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 text-lg"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            {processingStep || 'Generating...'}
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Generate Complete Study Package
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        Auto-creates: Notes • Flashcards • Quizzes • Mock Tests • Study Plan • Audio Lessons
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        ) : (
          /* Generated Package Dashboard */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Success Header */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <CardTitle className="text-3xl text-green-800">Study Package Ready!</CardTitle>
                <CardDescription className="text-lg text-green-700">
                  Complete study materials generated from your uploaded content for {generatedPackage.examLevel}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{generatedPackage.daysLeft}</div>
                    <div className="text-sm text-gray-600">Days Left</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{generatedPackage.topics.length}</div>
                    <div className="text-sm text-gray-600">Topics</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{generatedPackage.dailyHours}h</div>
                    <div className="text-sm text-gray-600">Daily Study</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{generatedPackage.sourceFiles.length}</div>
                    <div className="text-sm text-gray-600">Source Files</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* One-Click Actions */}
            <Card>
              <CardHeader>
                <CardTitle>🚀 Start Studying - One Click Actions</CardTitle>
                <CardDescription>
                  Jump directly into any study activity - everything is pre-generated from your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => router.push('/quiz')}
                    className="h-24 flex-col bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Brain className="w-8 h-8 mb-2" />
                    <span>Start Quiz</span>
                    <span className="text-xs opacity-80">10 questions ready</span>
                  </Button>
                  
                  <Button
                    onClick={() => router.push('/flashcards')}
                    className="h-24 flex-col bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <BookOpen className="w-8 h-8 mb-2" />
                    <span>Study Flashcards</span>
                    <span className="text-xs opacity-80">SRS ready</span>
                  </Button>
                  
                  <Button
                    onClick={() => router.push('/notes')}
                    className="h-24 flex-col bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  >
                    <FileText className="w-8 h-8 mb-2" />
                    <span>Read Notes</span>
                    <span className="text-xs opacity-80">Organized by topic</span>
                  </Button>
                  
                  <Button
                    onClick={() => router.push('/podcast')}
                    className="h-24 flex-col bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                  >
                    <Headphones className="w-8 h-8 mb-2" />
                    <span>Listen Lessons</span>
                    <span className="text-xs opacity-80">Audio ready</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Study Plan Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  Your Personalized Study Plan
                </CardTitle>
                <CardDescription>
                  Day-wise schedule covering all topics from your uploaded materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedPackage.topics.slice(0, 7).map((topic: string, index: number) => {
                    const date = new Date()
                    date.setDate(date.getDate() + index)
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{date.toLocaleDateString()}</div>
                          <div className="text-sm text-gray-600">{topic}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{generatedPackage.dailyHours}h</div>
                          <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            Study + Practice
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    className="mr-4"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Full Schedule
                  </Button>
                  <Button
                    onClick={() => {
                      // Reset for new upload
                      setGeneratedPackage(null)
                      setShowExamSelection(false)
                      clearUploadedFiles()
                      setSelectedExamLevel('')
                      setExamDate('')
                    }}
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Materials
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Download Bundle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-6 h-6 mr-2" />
                  Download Study Bundle
                </CardTitle>
                <CardDescription>
                  Get offline access to all generated materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="flex-col h-20">
                    <FileText className="w-6 h-6 mb-1" />
                    <span className="text-xs">Notes PDF</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-20">
                    <BookOpen className="w-6 h-6 mb-1" />
                    <span className="text-xs">Flashcards CSV</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-20">
                    <Brain className="w-6 h-6 mb-1" />
                    <span className="text-xs">Quiz JSON</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-20">
                    <Headphones className="w-6 h-6 mb-1" />
                    <span className="text-xs">Audio MP3</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Legacy AI Analysis Results - Hidden when package is generated */}
        {extractedContent && !generatedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-6 h-6 mr-2" />
                  AI Analysis Complete
                </CardTitle>
                <CardDescription>
                  Here's what our AI extracted from your study materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Topics Identified</h4>
                    <div className="flex flex-wrap gap-2">
                      {extractedContent.topics.map((topic: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Key Terms</h4>
                    <div className="flex flex-wrap gap-2">
                      {extractedContent.keyTerms.map((term: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-lg text-gray-800">
                      {extractedContent.difficulty}
                    </div>
                    <div className="text-sm text-gray-600">Difficulty Level</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-lg text-gray-800">
                      {extractedContent.estimatedStudyTime}
                    </div>
                    <div className="text-sm text-gray-600">Estimated Study Time</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-lg text-gray-800">
                      {extractedContent.suggestedSchedule}
                    </div>
                    <div className="text-sm text-gray-600">Suggested Schedule</div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </motion.div>
        )}
        
        {/* Features Info - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">One-Upload Workflow</h3>
              <p className="text-sm text-gray-600">
                Upload once → Get complete study package automatically generated
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Exam-Level Customization</h3>
              <p className="text-sm text-gray-600">
                Content tailored to your specific exam level and date
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Complete Study Package</h3>
              <p className="text-sm text-gray-600">
                Notes, flashcards, quizzes, mock tests, and audio lessons
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
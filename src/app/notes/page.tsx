'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Plus, BookOpen, Star, Filter, Download, Share } from 'lucide-react'

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const notes = [
    {
      id: 1,
      title: "Calculus - Derivatives 📐",
      subject: "Mathematics",
      topic: "Calculus",
      content: "Derivatives represent the rate of change of a function. The power rule states that d/dx(x^n) = nx^(n-1)...",
      tags: ["calculus", "derivatives", "mathematics"],
      createdAt: "2024-01-15",
      favorite: true,
      color: "bg-gradient-to-br from-blue-50 to-indigo-100"
    },
    {
      id: 2,
      title: "Newton's Laws of Motion 🚀",
      subject: "Physics",
      topic: "Mechanics",
      content: "First Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion...",
      tags: ["physics", "mechanics", "newton"],
      createdAt: "2024-01-14",
      favorite: false,
      color: "bg-gradient-to-br from-green-50 to-emerald-100"
    },
    {
      id: 3,
      title: "Organic Chemistry Basics 🧪",
      subject: "Chemistry",
      topic: "Organic Chemistry",
      content: "Organic chemistry is the study of carbon compounds. Carbon can form four covalent bonds...",
      tags: ["chemistry", "organic", "carbon"],
      createdAt: "2024-01-13",
      favorite: true,
      color: "bg-gradient-to-br from-purple-50 to-pink-100"
    },
    {
      id: 4,
      title: "Photosynthesis Process 🌱",
      subject: "Biology",
      topic: "Plant Biology",
      content: "Photosynthesis is the process by which plants convert light energy into chemical energy...",
      tags: ["biology", "photosynthesis", "plants"],
      createdAt: "2024-01-12",
      favorite: false,
      color: "bg-gradient-to-br from-yellow-50 to-orange-100"
    }
  ]

  const categories = [
    { id: 'all', name: 'All Notes', count: notes.length },
    { id: 'mathematics', name: 'Mathematics', count: notes.filter(n => n.subject === 'Mathematics').length },
    { id: 'physics', name: 'Physics', count: notes.filter(n => n.subject === 'Physics').length },
    { id: 'chemistry', name: 'Chemistry', count: notes.filter(n => n.subject === 'Chemistry').length },
    { id: 'biology', name: 'Biology', count: notes.filter(n => n.subject === 'Biology').length },
  ]

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           note.subject.toLowerCase() === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Study Notes 📚
              </h1>
              <p className="text-gray-600 mt-1">Organize and review your study materials</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-orange-100 text-orange-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Notes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Share Collection
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filter
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing {filteredNotes.length} of {notes.length} notes
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>

            {/* Notes Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:scale-105 ${note.color} border-0`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-gray-800 mb-2">
                            {note.title}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            {note.subject} • {note.topic}
                          </CardDescription>
                        </div>
                        <button
                          className={`p-1 rounded-full transition-colors ${
                            note.favorite 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${note.favorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {note.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/60 text-gray-700 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <Button size="sm" variant="outline" className="bg-white/60 hover:bg-white/80">
                          <BookOpen className="w-4 h-4 mr-1" />
                          Read
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started'}
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Note
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
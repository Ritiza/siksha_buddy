import React, { useState, useEffect } from 'react';
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  AcademicCapIcon,
  ClockIcon,
  TagIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { materialsAPI, studyAPI, subjectsAPI } from '../services/api';
import NotesViewer from '../components/NotesViewer';
import FlashcardsViewer from '../components/FlashcardsViewer';
import toast from 'react-hot-toast';

const StudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [filterSubject, setFilterSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotesViewer, setShowNotesViewer] = useState(false);
  const [showFlashcardsViewer, setShowFlashcardsViewer] = useState(false);
  const [notesFormat, setNotesFormat] = useState('structured');

  useEffect(() => {
    loadMaterials();
    loadSubjects();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialsAPI.getAll();
      setMaterials(response.data);
    } catch (error) {
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await subjectsAPI.getAll();
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to load subjects');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await materialsAPI.upload(formData);
      toast.success('File uploaded successfully!');
      loadMaterials();
      
      // Auto-select the newly uploaded material
      setSelectedMaterial(response.data.material);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleGenerate = async (type) => {
    if (!selectedMaterial) {
      toast.error('Please select a material first');
      return;
    }

    setGenerating(true);
    setContentType(type);

    try {
      let response;
      if (type === 'notes') {
        response = await studyAPI.generateNotes({ 
          material_id: selectedMaterial.material_id,
          format: notesFormat
        });
        setGeneratedContent(response.data.notes);
        setShowNotesViewer(true);
      } else if (type === 'flashcards') {
        response = await studyAPI.generateFlashcards({ 
          material_id: selectedMaterial.material_id,
          num_cards: 15
        });
        
        // Handle different response structures
        let flashcardsData = response.data.flashcards;
        
        // If it's a direct array, wrap it in the expected structure
        if (Array.isArray(flashcardsData)) {
          flashcardsData = {
            cards: flashcardsData,
            total_cards: flashcardsData.length,
            categories: [...new Set(flashcardsData.map(card => card.category))],
            difficulty_distribution: {
              easy: flashcardsData.filter(c => c.difficulty === 'easy').length,
              medium: flashcardsData.filter(c => c.difficulty === 'medium').length,
              hard: flashcardsData.filter(c => c.difficulty === 'hard').length
            }
          };
        } else if (flashcardsData && flashcardsData.raw) {
          flashcardsData = flashcardsData.raw;
        }
        
        setGeneratedContent(flashcardsData);
        setShowFlashcardsViewer(true);
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!`);
    } catch (error) {
      toast.error(`Failed to generate ${type}`);
      console.error(`Generate ${type} error:`, error);
    } finally {
      setGenerating(false);
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSubject = filterSubject === 'all' || material.subject_name === filterSubject;
    const matchesSearch = material.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.subject_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const getFileIcon = (fileType) => {
    switch (fileType?.toUpperCase()) {
      case 'PDF':
        return '📄';
      case 'DOCX':
      case 'DOC':
        return '📝';
      case 'TXT':
        return '📃';
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return '🖼️';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
            <p className="mt-1 text-gray-600">Upload and manage your study content</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <div className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white transition-colors ${
                uploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}>
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Material'}
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject.subject_id} value={subject.subject_name}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Materials List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Materials ({filteredMaterials.length})
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredMaterials.length > 0 ? (
                <div className="grid gap-4">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.material_id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMaterial?.material_id === material.material_id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedMaterial(material)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{getFileIcon(material.file_type)}</div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{material.file_name}</h3>
                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                              {material.subject_name && (
                                <div className="flex items-center">
                                  <FolderIcon className="h-4 w-4 mr-1" />
                                  {material.subject_name}
                                </div>
                              )}
                              {material.estimated_study_time && (
                                <div className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {material.estimated_study_time} min
                                </div>
                              )}
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {material.file_type}
                              </span>
                            </div>
                            {material.key_topics && material.key_topics.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {material.key_topics.slice(0, 3).map((topic, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                                  >
                                    <TagIcon className="h-3 w-3 mr-1" />
                                    {topic}
                                  </span>
                                ))}
                                {material.key_topics.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{material.key_topics.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(material.uploaded_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No materials found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterSubject !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Upload your first study material to get started.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="space-y-6">
          {/* Selected Material Info */}
          {selectedMaterial && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Material</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">File Name</p>
                  <p className="text-sm text-gray-900">{selectedMaterial.file_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Subject</p>
                  <p className="text-sm text-gray-900">{selectedMaterial.subject_name || 'Not detected'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Study Time</p>
                  <p className="text-sm text-gray-900">{selectedMaterial.estimated_study_time || 0} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">File Size</p>
                  <p className="text-sm text-gray-900">
                    {selectedMaterial.file_size ? `${(selectedMaterial.file_size / 1024).toFixed(1)} KB` : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Content</h3>
            
            {/* Notes Format Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Notes Format
              </label>
              <select
                value={notesFormat}
                onChange={(e) => setNotesFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="structured">📋 Structured Notes - Comprehensive format with deep analysis</option>
                <option value="cornell">📝 Cornell Notes - Note-taking system with cues and summary</option>
                <option value="mindmap">🧠 Mind Map - Visual representation of concepts</option>
                <option value="chart">📊 Chart/Flowchart - Process flows and relationships</option>
                <option value="outline">📑 Outline Format - Hierarchical organization</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Choose the format that best suits your learning style
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleGenerate('notes')}
                disabled={!selectedMaterial || generating}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                {generating && contentType === 'notes' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Enhanced Notes...
                  </>
                ) : (
                  'Generate Enhanced Notes'
                )}
              </button>
              
              {/* Format Preview */}
              {notesFormat && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                  <div className="text-xs text-gray-600">
                    {notesFormat === 'structured' && (
                      <div>
                        <strong>📋 Structured Notes:</strong> Comprehensive format with learning objectives, deep conceptual understanding, relationships, formulas, and study strategies.
                      </div>
                    )}
                    {notesFormat === 'cornell' && (
                      <div>
                        <strong>📝 Cornell Notes:</strong> Three-section layout with note-taking area, cue column for questions, and summary section for key takeaways.
                      </div>
                    )}
                    {notesFormat === 'mindmap' && (
                      <div>
                        <strong>🧠 Mind Map:</strong> Visual representation with central topic branching into concepts, formulas, applications, and relationships.
                      </div>
                    )}
                    {notesFormat === 'chart' && (
                      <div>
                        <strong>📊 Chart/Flowchart:</strong> Process flows, learning progression, difficulty charts, and cause-effect relationships.
                      </div>
                    )}
                    {notesFormat === 'outline' && (
                      <div>
                        <strong>📑 Outline Format:</strong> Hierarchical organization with numbered sections, concepts, formulas, and study strategies.
                      </div>
                    )}
                  </div>
                </div>
              )}
              <button
                onClick={() => handleGenerate('flashcards')}
                disabled={!selectedMaterial || generating}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                {generating && contentType === 'flashcards' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating AI Flashcards...
                  </>
                ) : (
                  'Generate AI Flashcards'
                )}
              </button>
              
              {/* Flashcards Features */}
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xs text-green-700">
                  <strong>✨ AI-Enhanced Features:</strong> Deep analysis questions, cognitive levels (knowledge to evaluation), cause-effect relationships, real-world applications, and progressive difficulty.
                </div>
              </div>
              <button
                disabled
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"
              >
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Generate Quiz (Coming Soon)
              </button>
            </div>
            {!selectedMaterial && (
              <p className="mt-3 text-xs text-gray-500 text-center">
                Select a material to generate content
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Viewers */}
      {showNotesViewer && generatedContent && (
        <NotesViewer
          notes={generatedContent}
          onClose={() => setShowNotesViewer(false)}
          materialName={selectedMaterial?.file_name || 'Study Material'}
        />
      )}

      {showFlashcardsViewer && generatedContent && (
        <FlashcardsViewer
          flashcardsData={generatedContent}
          onClose={() => setShowFlashcardsViewer(false)}
          materialName={selectedMaterial?.file_name || 'Study Material'}
        />
      )}
    </div>
  );
};

export default StudyMaterial;
import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  PrinterIcon,
  ShareIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  AcademicCapIcon,
  EyeIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const NotesViewer = ({ notes, onClose, materialName }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['overview', 'concepts', 'points']));
  const [fontSize, setFontSize] = useState('text-base');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState(new Set());
  const [readingProgress, setReadingProgress] = useState(0);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrolled / maxHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleBookmark = (sectionId) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(sectionId)) {
      newBookmarks.delete(sectionId);
    } else {
      newBookmarks.add(sectionId);
    }
    setBookmarks(newBookmarks);
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">$1</mark>');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const parseNotes = (notesText) => {
    const sections = [];
    const lines = notesText.split('\n');
    let currentSection = null;
    let currentContent = [];

    lines.forEach(line => {
      if (line.startsWith('# ')) {
        if (currentSection) {
          sections.push({ ...currentSection, content: currentContent.join('\n') });
        }
        currentSection = { 
          type: 'title', 
          title: line.replace('# ', ''), 
          id: 'title',
          icon: '📚'
        };
        currentContent = [];
      } else if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push({ ...currentSection, content: currentContent.join('\n') });
        }
        const title = line.replace('## ', '');
        const id = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Assign icons based on section type
        let icon = '📝';
        if (title.includes('Learning') || title.includes('Objective')) icon = '🎯';
        else if (title.includes('Concept') || title.includes('Understanding')) icon = '🧠';
        else if (title.includes('Formula') || title.includes('Mathematical')) icon = '📐';
        else if (title.includes('Problem') || title.includes('Solving')) icon = '🔧';
        else if (title.includes('Application') || title.includes('Real')) icon = '🌍';
        else if (title.includes('Critical') || title.includes('Analysis')) icon = '🤔';
        else if (title.includes('Strategy') || title.includes('Study')) icon = '📈';
        else if (title.includes('Summary') || title.includes('Key')) icon = '📋';
        
        currentSection = { 
          type: 'section', 
          title, 
          id,
          icon
        };
        currentContent = [];
      } else if (line.trim()) {
        currentContent.push(line);
      }
    });

    if (currentSection) {
      sections.push({ ...currentSection, content: currentContent.join('\n') });
    }

    return sections;
  };

  const sections = parseNotes(notes);
  const filteredSections = sections.filter(section => 
    !searchTerm || 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableOfContents = sections.filter(s => s.type === 'section');

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Study Notes - ${materialName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; }
            h2 { color: #374151; margin-top: 20px; }
            .content { line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="content">${notes.replace(/\n/g, '<br>')}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Study Notes - ${materialName}`,
          text: notes
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(notes);
      alert('Notes copied to clipboard!');
    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 ${darkMode ? 'dark' : ''}`}>
      <div className={`relative top-4 mx-auto p-0 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-2xl rounded-lg ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'} min-h-[90vh]`}>
        
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className={`sticky top-0 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 rounded-t-lg z-40`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Enhanced Study Notes
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {materialName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Table of Contents Toggle */}
              <button
                onClick={() => setShowTableOfContents(!showTableOfContents)}
                className={`p-2 rounded-lg transition-colors ${
                  showTableOfContents 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Table of Contents"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>

              {/* Focus Mode Toggle */}
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`p-2 rounded-lg transition-colors ${
                  focusMode 
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Focus Mode"
              >
                <EyeIcon className="h-5 w-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Toggle Dark Mode"
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>

              {/* Font Size Selector */}
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className={`text-sm border rounded px-2 py-1 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="text-sm">Small</option>
                <option value="text-base">Medium</option>
                <option value="text-lg">Large</option>
                <option value="text-xl">Extra Large</option>
              </select>

              {/* Action Buttons */}
              <button
                onClick={handlePrint}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Print Notes"
              >
                <PrinterIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Share Notes"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Table of Contents Sidebar */}
          {showTableOfContents && !focusMode && (
            <div className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r p-4 max-h-screen overflow-y-auto`}>
              <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📚 Table of Contents
              </h4>
              <nav className="space-y-2">
                {tableOfContents.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                        : 'hover:bg-white text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="truncate">{section.title}</span>
                    {bookmarks.has(section.id) && (
                      <StarIcon className="h-4 w-4 text-yellow-500 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Main Content */}
          <div className={`flex-1 px-6 py-4 ${fontSize} ${focusMode ? 'max-w-4xl mx-auto' : ''}`}>
            {filteredSections.map((section, index) => (
              <div key={index} className="mb-6" id={section.id}>
                {section.type === 'title' && (
                  <div className="text-center mb-8">
                    <h1 className={`text-4xl font-bold mb-4 pb-4 border-b-2 border-blue-500 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <span className="text-5xl mr-3">📚</span>
                      {section.title}
                    </h1>
                  </div>
                )}
                
                {section.type === 'section' && (
                  <div className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${
                    darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-700' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{section.icon}</span>
                        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {section.title}
                        </h2>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(section.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            bookmarks.has(section.id)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="Bookmark Section"
                        >
                          <StarIcon className="h-5 w-5" />
                        </button>
                        {expandedSections.has(section.id) ? (
                          <ChevronDownIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                          <ChevronRightIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                      </div>
                    </button>
                    
                    {expandedSections.has(section.id) && (
                      <div className={`px-6 py-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} animate-fadeIn`}>
                        <div className="prose max-w-none">
                          {section.content.split('\n').map((line, lineIndex) => {
                            
                            if (line.startsWith('- **') || line.startsWith('* **')) {
                              // Definition list item
                              const match = line.match(/^[-*]\s*\*\*([^*]+)\*\*:\s*(.+)$/);
                              if (match) {
                                return (
                                  <div key={lineIndex} className={`mb-3 p-4 rounded-lg border-l-4 border-blue-400 ${
                                    darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                                  }`}>
                                    <dt className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                                      💡 {match[1]}
                                    </dt>
                                    <dd className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} 
                                        dangerouslySetInnerHTML={{ __html: highlightSearchTerm(match[2]) }} />
                                  </div>
                                );
                              }
                            } else if (line.match(/^\d+\.\s*\*\*([^*]+)\*\*:\s*(.+)$/)) {
                              // Numbered concept
                              const match = line.match(/^\d+\.\s*\*\*([^*]+)\*\*:\s*(.+)$/);
                              return (
                                <div key={lineIndex} className={`mb-4 p-4 rounded-lg border-l-4 border-green-400 ${
                                  darkMode ? 'bg-green-900/20' : 'bg-green-50'
                                }`}>
                                  <h4 className={`font-semibold flex items-center ${darkMode ? 'text-green-300' : 'text-green-900'}`}>
                                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                                    {match[1]}
                                  </h4>
                                  <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} 
                                     dangerouslySetInnerHTML={{ __html: highlightSearchTerm(match[2]) }} />
                                </div>
                              );
                            } else if (line.match(/^\d+\.\s/)) {
                              // Regular numbered list
                              const number = line.match(/^(\d+)\./)[1];
                              return (
                                <div key={lineIndex} className="mb-3 flex items-start">
                                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-4 mt-0.5 ${
                                    darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {number}
                                  </span>
                                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`} 
                                     dangerouslySetInnerHTML={{ __html: highlightSearchTerm(line.replace(/^\d+\.\s*/, '')) }} />
                                </div>
                              );
                            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                              // Bullet point
                              return (
                                <div key={lineIndex} className="mb-3 flex items-start">
                                  <span className={`flex-shrink-0 w-3 h-3 rounded-full mr-4 mt-2 ${
                                    darkMode ? 'bg-gray-500' : 'bg-gray-400'
                                  }`}></span>
                                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`} 
                                     dangerouslySetInnerHTML={{ __html: highlightSearchTerm(line.replace(/^[-*]\s*/, '')) }} />
                                </div>
                              );
                            } else if (line.includes('```')) {
                              // Code block
                              return (
                                <div key={lineIndex} className={`mb-4 p-4 rounded-lg font-mono text-sm ${
                                  darkMode ? 'bg-gray-800 text-green-400 border border-gray-700' : 'bg-gray-100 text-gray-800 border'
                                }`}>
                                  <pre className="whitespace-pre-wrap" 
                                       dangerouslySetInnerHTML={{ __html: highlightSearchTerm(line.replace(/```/g, '')) }} />
                                </div>
                              );
                            } else if (line.trim()) {
                              // Regular paragraph
                              return (
                                <p key={lineIndex} className={`mb-4 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} 
                                   dangerouslySetInnerHTML={{ __html: highlightSearchTerm(line) }} />
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {filteredSections.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-900'}`}>
                  No results found
                </h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Try adjusting your search terms or clear the search to see all content.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className={`sticky bottom-0 border-t px-6 py-4 rounded-b-lg ${
          darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className="flex items-center">
                <BookOpenIcon className="h-4 w-4 mr-1" />
                Enhanced Study Notes
              </span>
              <span>•</span>
              <span className="flex items-center">
                <AcademicCapIcon className="h-4 w-4 mr-1" />
                SikshaBuddy AI
              </span>
              {bookmarks.size > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1 text-yellow-500" />
                    {bookmarks.size} Bookmarked
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Reading Progress: {Math.round(readingProgress)}%
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Close Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        mark {
          animation: highlight 0.3s ease-out;
        }
        @keyframes highlight {
          from { background-color: transparent; }
          to { background-color: rgb(254 240 138); }
        }
      `}</style>
    </div>
  );
};

export default NotesViewer;
import React, { useState, useEffect } from 'react';
import {
  SparklesIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const FlashcardsViewer = ({ flashcardsData, onClose, materialName }) => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studiedCards, setStudiedCards] = useState(new Set());
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [shuffled, setShuffled] = useState(false);
  const [originalCards, setOriginalCards] = useState([]);

  useEffect(() => {
    let parsedCards = [];
    
    if (typeof flashcardsData === 'string') {
      try {
        const parsed = JSON.parse(flashcardsData);
        parsedCards = parsed.cards || parsed.raw?.cards || parsed || [];
      } catch (error) {
        // If parsing fails, create simple cards from text
        const lines = flashcardsData.split('\n').filter(line => line.trim());
        parsedCards = lines.slice(0, 10).map((line, index) => ({
          id: `card_${index + 1}`,
          type: 'text',
          front: `Question ${index + 1}`,
          back: line.trim(),
          difficulty: 'medium',
          category: 'General'
        }));
      }
    } else if (flashcardsData) {
      // Handle different response structures
      if (Array.isArray(flashcardsData)) {
        // Direct array of cards
        parsedCards = flashcardsData;
      } else {
        // Object with cards property or nested structure
        parsedCards = flashcardsData.cards || 
                     flashcardsData.raw?.cards || 
                     (flashcardsData.flashcards?.cards) ||
                     (flashcardsData.flashcards?.raw?.cards) ||
                     (Array.isArray(flashcardsData.flashcards) ? flashcardsData.flashcards : []) ||
                     [];
      }
    }

    setOriginalCards(parsedCards);
    setCards(parsedCards);
  }, [flashcardsData]);

  const filteredCards = cards.filter(card => {
    const matchesDifficulty = difficulty === 'all' || card.difficulty === difficulty;
    const matchesCategory = category === 'all' || card.category === category;
    return matchesDifficulty && matchesCategory;
  });

  const currentCard = filteredCards[currentIndex];
  
  // Debug logging
  console.log('FlashcardsViewer Debug:', {
    flashcardsDataType: typeof flashcardsData,
    cardsLength: cards.length,
    filteredCardsLength: filteredCards.length,
    currentIndex,
    currentCard: currentCard ? 'exists' : 'null'
  });
  const progress = filteredCards.length > 0 ? ((currentIndex + 1) / filteredCards.length) * 100 : 0;

  const nextCard = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const markAsStudied = (cardId, known) => {
    const newStudied = new Set(studiedCards);
    if (known) {
      newStudied.add(cardId);
    } else {
      newStudied.delete(cardId);
    }
    setStudiedCards(newStudied);
  };

  const shuffleCards = () => {
    if (!shuffled) {
      const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setShuffled(true);
    } else {
      setCards(originalCards);
      setShuffled(false);
    }
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const resetProgress = () => {
    setStudiedCards(new Set());
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Concepts': return '🧠';
      case 'Definitions': return '📖';
      case 'Facts': return '📊';
      case 'Formulas': return '🔢';
      case 'Application': return '⚡';
      default: return '📚';
    }
  };

  if (!currentCard) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">No flashcards available</h3>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categories = [...new Set(cards.map(card => card.category))];
  const difficulties = ['easy', 'medium', 'hard'];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SparklesIcon className="h-6 w-6" />
                <div>
                  <h3 className="text-lg font-semibold">Flashcards</h3>
                  <p className="text-purple-100 text-sm">{materialName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Card {currentIndex + 1} of {filteredCards.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    setCurrentIndex(0);
                    setShowAnswer(false);
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Difficulties</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>
                
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCurrentIndex(0);
                    setShowAnswer(false);
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {getCategoryIcon(cat)} {cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={shuffleCards}
                  className={`p-2 rounded-lg transition-colors ${
                    shuffled 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title={shuffled ? 'Unshuffle' : 'Shuffle'}
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={resetProgress}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Reset Progress"
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="p-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                  {currentCard.difficulty}
                </span>
                <span className="text-sm text-gray-500">
                  {getCategoryIcon(currentCard.category)} {currentCard.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {studiedCards.has(currentCard.id) && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>

            <div 
              className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-h-[200px] flex items-center justify-center cursor-pointer transition-all duration-300 ${
                showAnswer ? 'from-blue-50 to-blue-100' : ''
              }`}
              onClick={toggleAnswer}
            >
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900 mb-4">
                  {showAnswer ? 'Answer:' : 'Question:'}
                </div>
                <div className="text-xl text-gray-800 leading-relaxed">
                  {showAnswer ? currentCard.back : currentCard.front}
                </div>
                {!showAnswer && (
                  <div className="mt-6 text-sm text-gray-500 flex items-center justify-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Click to reveal answer
                  </div>
                )}
              </div>
            </div>

            {/* Answer Actions */}
            {showAnswer && (
              <div className="mt-6 flex items-center justify-center space-x-4">
                <button
                  onClick={() => markAsStudied(currentCard.id, false)}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Need Review
                </button>
                <button
                  onClick={() => markAsStudied(currentCard.id, true)}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Got It!
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <button
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </button>

              <button
                onClick={toggleAnswer}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showAnswer ? (
                  <>
                    <EyeSlashIcon className="h-4 w-4 mr-2" />
                    Hide Answer
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Show Answer
                  </>
                )}
              </button>

              <button
                onClick={nextCard}
                disabled={currentIndex === filteredCards.length - 1}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            </div>

            {/* Study Stats */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Studied: {studiedCards.size} / {filteredCards.length} cards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsViewer;
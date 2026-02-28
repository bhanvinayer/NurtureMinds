'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Clock, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  category: string
  difficulty: string
}

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'assessment' | 'results'>('intro')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [results, setResults] = useState<any>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // Mock questions data
  const mockQuestions: Question[] = [
    {
      id: '1',
      question: 'Look at these colors: Red, Blue, Green. Which color was first?',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      category: 'memory',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'Count how many times the letter "A" appears: B A C A D A',
      options: ['1', '2', '3', '4'],
      category: 'attention',
      difficulty: 'easy'
    },
    {
      id: '3',
      question: 'Which word rhymes with "cat"?',
      options: ['dog', 'hat', 'car', 'run'],
      category: 'language',
      difficulty: 'easy'
    },
    {
      id: '4',
      question: 'How many sides does a triangle have?',
      options: ['2', '3', '4', '5'],
      category: 'visual',
      difficulty: 'easy'
    },
    {
      id: '5',
      question: 'Study this pattern: 2, 4, 6, 8. What comes next?',
      options: ['9', '10', '11', '12'],
      category: 'memory',
      difficulty: 'medium'
    }
  ]

  useEffect(() => {
    if (currentStep === 'assessment' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, timeRemaining])

  const startAssessment = () => {
    setQuestions(mockQuestions)
    setCurrentStep('assessment')
    setTimeRemaining(1800)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)
      setSelectedAnswer(null)

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // Assessment complete
        completeAssessment(newAnswers)
      }
    }
  }

  const completeAssessment = (finalAnswers: number[]) => {
    // Calculate mock results
    const correctAnswers = [0, 2, 1, 1, 1] // Correct answer indices
    let correctCount = 0
    
    finalAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        correctCount++
      }
    })

    const score = (correctCount / questions.length) * 100
    
    const mockResults = {
      score: score,
      total_questions: questions.length,
      correct_answers: correctCount,
      level: score >= 80 ? 'Advanced' : score >= 60 ? 'Grade Level' : score >= 40 ? 'Needs Support' : 'Intensive Support',
      category_scores: {
        memory: 85,
        attention: 75,
        language: 90,
        visual: 70
      },
      insights: [
        score >= 80 ? 'Excellent cognitive performance across all areas!' : 'Good cognitive abilities with room for growth',
        'Strong performance in language and memory tasks',
        'Visual processing skills show potential for improvement',
        'Attention skills are developing well'
      ],
      recommendations: [
        score >= 80 ? 'Ready for advanced challenges and enrichment activities' : 'Continue current learning approach with gradual challenges',
        'Incorporate visual learning aids to support processing',
        'Practice attention-building exercises daily',
        'Celebrate achievements to build confidence'
      ]
    }

    setResults(mockResults)
    setCurrentStep('results')
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {/* Introduction Step */}
          {currentStep === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="w-16 h-16 text-blue-600" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Cognitive Assessment
                </h1>
              </div>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                This personalized assessment will help us understand your child's learning style and cognitive strengths. 
                The questions adapt based on responses to provide accurate insights.
              </p>

              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">What to Expect</h2>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">30 minutes total time</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">12-15 adaptive questions</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Memory & Attention</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Language & Visual Skills</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Important:</strong> This assessment is for educational purposes and provides insights to support learning. 
                    It does not replace professional evaluation or diagnosis.
                  </p>
                </div>
              </div>

              <motion.button
                onClick={startAssessment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Begin Assessment
              </motion.button>
            </motion.div>
          )}

          {/* Assessment Step */}
          {currentStep === 'assessment' && questions.length > 0 && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Progress Header */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-mono">{formatTime(timeRemaining)}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8"
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <div className="text-sm font-medium text-blue-600 mb-2 capitalize">
                    {questions[currentQuestion].category} • {questions[currentQuestion].difficulty}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {questions[currentQuestion].question}
                  </h2>
                </div>

                <div className="space-y-3 mb-8">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    {currentQuestion + 1 === questions.length ? 'Complete Assessment' : 'Next Question'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Results Header */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
                <p className="text-xl text-gray-600">Here are your personalized results and insights</p>
              </div>

              {/* Score Overview */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">{results.score.toFixed(1)}%</div>
                    <div className="text-gray-600">Overall Score</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-600 mb-2">{results.correct_answers}/{results.total_questions}</div>
                    <div className="text-gray-600">Correct Answers</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-600 mb-2">{results.level}</div>
                    <div className="text-gray-600">Cognitive Level</div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Skill Area Breakdown</h3>
                <div className="space-y-6">
                  {Object.entries(results.category_scores).map(([category, score]: [string, any]) => (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-medium text-gray-700 capitalize">{category}</span>
                        <span className="text-lg font-bold text-gray-900">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className="bg-blue-500 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights & Recommendations */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    Key Insights
                  </h3>
                  <ul className="space-y-3">
                    {results.insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-purple-600" />
                    Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {results.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setCurrentStep('intro')
                    setCurrentQuestion(0)
                    setAnswers([])
                    setResults(null)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Take Another Assessment
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Download Report
                </button>
                <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                  View Progress Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
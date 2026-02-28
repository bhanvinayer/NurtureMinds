'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, CheckCircle, Clock, Star, ArrowRight, Zap, BookOpen, Users, Trophy } from 'lucide-react'
import Link from 'next/link'

interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  progress: number
  modules: LearningModule[]
  aiRecommendation?: string
  personalizedFor: string[]
  badges: string[]
}

interface LearningModule {
  id: string
  title: string
  type: 'assessment' | 'game' | 'video' | 'interactive'
  isCompleted: boolean
  estimatedMinutes: number
  xpReward: number
}

const learningPaths: LearningPath[] = [
  {
    id: 'autism-foundation',
    title: 'Autism Support Foundation',
    description: 'Comprehensive learning path for understanding and supporting children with autism spectrum disorders.',
    difficulty: 'beginner',
    estimatedTime: '2-3 weeks',
    progress: 60,
    personalizedFor: ['visual learners', 'new parents', 'evidence-based approach'],
    aiRecommendation: 'Recommended based on your child\'s assessment results showing strong visual processing skills.',
    badges: ['autism-advocate', 'visual-supporter'],
    modules: [
      { id: 'autism-basics', title: 'Understanding Autism Spectrum', type: 'video', isCompleted: true, estimatedMinutes: 15, xpReward: 100 },
      { id: 'communication-strategies', title: 'Communication Strategies', type: 'interactive', isCompleted: true, estimatedMinutes: 20, xpReward: 150 },
      { id: 'sensory-assessment', title: 'Sensory Processing Assessment', type: 'assessment', isCompleted: true, estimatedMinutes: 25, xpReward: 200 },
      { id: 'social-skills-games', title: 'Social Skills Building Games', type: 'game', isCompleted: false, estimatedMinutes: 30, xpReward: 250 },
      { id: 'daily-routine-builder', title: 'Daily Routine Builder', type: 'interactive', isCompleted: false, estimatedMinutes: 20, xpReward: 150 },
    ]
  },
  {
    id: 'adhd-management',
    title: 'ADHD Management Mastery',
    description: 'Strategies and tools for supporting children with ADHD in learning and daily activities.',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    progress: 25,
    personalizedFor: ['kinesthetic learners', 'attention challenges', 'executive function'],
    aiRecommendation: 'Your child shows high energy levels and benefits from movement-based activities.',
    badges: ['adhd-expert', 'focus-master'],
    modules: [
      { id: 'adhd-understanding', title: 'ADHD Brain Science', type: 'video', isCompleted: true, estimatedMinutes: 18, xpReward: 100 },
      { id: 'attention-games', title: 'Attention Building Games', type: 'game', isCompleted: false, estimatedMinutes: 25, xpReward: 200 },
      { id: 'executive-function', title: 'Executive Function Training', type: 'interactive', isCompleted: false, estimatedMinutes: 30, xpReward: 250 },
      { id: 'movement-integration', title: 'Movement & Learning Integration', type: 'interactive', isCompleted: false, estimatedMinutes: 35, xpReward: 300 },
    ]
  },
  {
    id: 'emotional-regulation',
    title: 'Emotional Regulation Journey',
    description: 'Advanced techniques for emotional self-regulation and social-emotional learning.',
    difficulty: 'advanced',
    estimatedTime: '4-5 weeks',
    progress: 10,
    personalizedFor: ['emotional sensitivity', 'social awareness', 'mindfulness'],
    aiRecommendation: 'Advanced path recommended based on your progress in emotional recognition assessments.',
    badges: ['emotion-guru', 'mindfulness-master', 'empathy-champion'],
    modules: [
      { id: 'emotion-recognition', title: 'Advanced Emotion Recognition', type: 'assessment', isCompleted: true, estimatedMinutes: 20, xpReward: 150 },
      { id: 'mindfulness-practice', title: 'Mindfulness for Kids', type: 'interactive', isCompleted: false, estimatedMinutes: 25, xpReward: 200 },
      { id: 'social-scenarios', title: 'Social Scenario Training', type: 'game', isCompleted: false, estimatedMinutes: 40, xpReward: 350 },
      { id: 'peer-interaction', title: 'Peer Interaction Mastery', type: 'interactive', isCompleted: false, estimatedMinutes: 30, xpReward: 300 },
    ]
  }
]

const difficultyColors = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500', 
  advanced: 'bg-red-500'
}

const typeIcons = {
  assessment: Brain,
  game: Target,
  video: BookOpen,
  interactive: Zap
}

export default function LearningPathsPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [userXP, setUserXP] = useState(2450)
  const [userLevel, setUserLevel] = useState(8)

  const selectedPathData = learningPaths.find(path => path.id === selectedPath)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Learning Paths
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Personalized learning journeys tailored to your child's unique needs, 
              learning style, and developmental goals using advanced AI recommendations.
            </p>
          </motion.div>

          {/* User Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Level {userLevel} Learner</h3>
                  <p className="text-gray-600">{userXP} XP earned</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Next Level</p>
                <p className="font-semibold text-gray-900">{3000 - userXP} XP to go</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((userXP % 1000) / 1000) * 100}%` }}
              />
            </div>
          </motion.div>
        </div>

        {!selectedPath ? (
          /* Learning Paths Grid */
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
                onClick={() => setSelectedPath(path.id)}
              >
                {/* AI Recommendation Badge */}
                {path.aiRecommendation && (
                  <div className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>AI Recommended</span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${difficultyColors[path.difficulty]}`}>
                      {path.difficulty}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {path.estimatedTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{path.description}</p>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{path.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>

                {/* Personalization Tags */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Personalized for:</p>
                  <div className="flex flex-wrap gap-1">
                    {path.personalizedFor.map((tag, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Recommendation */}
                {path.aiRecommendation && (
                  <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-blue-800 text-sm">
                      <strong>AI Insight:</strong> {path.aiRecommendation}
                    </p>
                  </div>
                )}

                {/* Modules Count */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    {path.modules.length} modules • {path.modules.filter(m => m.isCompleted).length} completed
                  </span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Selected Path Detail */
          selectedPathData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedPath(null)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Learning Paths</span>
              </button>

              {/* Path Header */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedPathData.title}</h1>
                    <p className="text-lg text-gray-600 mb-4">{selectedPathData.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${difficultyColors[selectedPathData.difficulty]}`}>
                        {selectedPathData.difficulty}
                      </span>
                      <span className="text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedPathData.estimatedTime}
                      </span>
                      <span className="text-gray-500">
                        {selectedPathData.modules.length} modules
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{selectedPathData.progress}%</div>
                    <div className="text-gray-600">Complete</div>
                  </div>
                </div>

                {/* AI Recommendation */}
                {selectedPathData.aiRecommendation && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <Brain className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">AI Recommendation</h4>
                        <p className="text-blue-700">{selectedPathData.aiRecommendation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modules */}
              <div className="space-y-4">
                {selectedPathData.modules.map((module, index) => {
                  const Icon = typeIcons[module.type]
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-xl p-6 shadow-lg border-l-4 transition-all hover:shadow-xl ${
                        module.isCompleted 
                          ? 'border-l-green-500 bg-green-50' 
                          : 'border-l-blue-500 hover:border-l-purple-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            module.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}>
                            {module.isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                              <Icon className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <span className="text-sm">{module.estimatedMinutes} min</span>
                              <span>•</span>
                              <span className="text-sm">{module.xpReward} XP</span>
                              <span>•</span>
                              <span className="text-sm capitalize">{module.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {module.isCompleted ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              Completed
                            </span>
                          ) : (
                            <Link
                              href={`/${module.type === 'assessment' ? 'assessment' : module.type === 'game' ? 'games' : 'interactive'}`}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                              Start Module
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  )
}
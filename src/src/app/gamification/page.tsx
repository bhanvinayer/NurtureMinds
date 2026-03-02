'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Crown, Star, Zap, Target, Brain, Heart, Users, Award, TrendingUp, Calendar, Gift } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: any
  category: 'achievement' | 'streak' | 'social' | 'learning'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isEarned: boolean
  earnedDate?: string
  progress: number
  maxProgress: number
  xpReward: number
  color: string
}

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  xp: number
  level: number
  badges: number
  streakDays: number
  isCurrentUser?: boolean
}

const badges: Badge[] = [
  {
    id: 'first-assessment',
    name: 'First Steps',
    description: 'Complete your first assessment',
    icon: Brain,
    category: 'achievement',
    rarity: 'common',
    isEarned: true,
    earnedDate: '2026-02-20',
    progress: 1,
    maxProgress: 1,
    xpReward: 100,
    color: 'bg-blue-500'
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 7-day learning streak',
    icon: Zap,
    category: 'streak',
    rarity: 'rare',
    isEarned: true,
    earnedDate: '2026-02-25',
    progress: 7,
    maxProgress: 7,
    xpReward: 300,
    color: 'bg-yellow-500'
  },
  {
    id: 'game-champion',
    name: 'Game Champion',
    description: 'Complete 10 cognitive games',
    icon: Target,
    category: 'achievement',
    rarity: 'epic',
    isEarned: false,
    progress: 7,
    maxProgress: 10,
    xpReward: 500,
    color: 'bg-purple-500'
  },
  {
    id: 'community-helper',
    name: 'Community Helper',
    description: 'Help 5 other parents in the forum',
    icon: Heart,
    category: 'social',
    rarity: 'rare',
    isEarned: false,
    progress: 3,
    maxProgress: 5,
    xpReward: 250,
    color: 'bg-pink-500'
  },
  {
    id: 'legend-status',
    name: 'Platform Legend',
    description: 'Reach Level 20 and unlock all features',
    icon: Crown,
    category: 'achievement',
    rarity: 'legendary',
    isEarned: false,
    progress: 8,
    maxProgress: 20,
    xpReward: 1000,
    color: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete activities before 9 AM for 5 days',
    icon: Calendar,
    category: 'streak',
    rarity: 'common',
    isEarned: true,
    earnedDate: '2026-02-22',
    progress: 5,
    maxProgress: 5,
    xpReward: 150,
    color: 'bg-green-500'
  }
]

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Sarah M.', avatar: '👩‍🦰', xp: 4250, level: 12, badges: 15, streakDays: 23 },
  { rank: 2, name: 'Mike R.', avatar: '👨‍💼', xp: 3890, level: 11, badges: 12, streakDays: 18 },
  { rank: 3, name: 'Lisa K.', avatar: '👩‍🎓', xp: 3456, level: 10, badges: 11, streakDays: 15 },
  { rank: 4, name: 'You', avatar: '🌟', xp: 2450, level: 8, badges: 8, streakDays: 7, isCurrentUser: true },
  { rank: 5, name: 'David L.', avatar: '👨‍🔬', xp: 2234, level: 7, badges: 9, streakDays: 12 },
  { rank: 6, name: 'Emma T.', avatar: '👩‍🏫', xp: 1967, level: 6, badges: 7, streakDays: 5 },
  { rank: 7, name: 'Chris P.', avatar: '👨‍🎨', xp: 1834, level: 6, badges: 6, streakDays: 9 },
  { rank: 8, name: 'Ana S.', avatar: '👩‍💻', xp: 1723, level: 5, badges: 5, streakDays: 3 }
]

const rarityColors = {
  common: 'border-gray-300 bg-gray-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50'
}

const rarityGlow = {
  common: '',
  rare: 'shadow-blue-200 shadow-lg',
  epic: 'shadow-purple-200 shadow-lg',
  legendary: 'shadow-yellow-200 shadow-xl'
}

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [newBadgeAnimation, setNewBadgeAnimation] = useState<string | null>(null)
  const [userStats, setUserStats] = useState({
    totalXP: 2450,
    level: 8,
    badgesEarned: badges.filter(b => b.isEarned).length,
    currentStreak: 7,
    totalBadges: badges.length
  })

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory)

  const earnedBadges = badges.filter(badge => badge.isEarned)
  const inProgressBadges = badges.filter(badge => !badge.isEarned && badge.progress > 0)
  const lockedBadges = badges.filter(badge => !badge.isEarned && badge.progress === 0)

  useEffect(() => {
    // Simulate new badge earned animation
    if (newBadgeAnimation) {
      setTimeout(() => setNewBadgeAnimation(null), 3000)
    }
  }, [newBadgeAnimation])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎮 Achievement Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn badges, climb leaderboards, and celebrate your learning journey milestones!
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats.totalXP}</div>
            <div className="text-gray-600 text-sm">Total XP</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">Level {userStats.level}</div>
            <div className="text-gray-600 text-sm">Current Level</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <Medal className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats.badgesEarned}/{userStats.totalBadges}</div>
            <div className="text-gray-600 text-sm">Badges Earned</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats.currentStreak}</div>
            <div className="text-gray-600 text-sm">Day Streak</div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'badges'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🏆 Badges & Achievements
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📊 Leaderboard
            </button>
          </div>
        </div>

        {activeTab === 'badges' ? (
          <div>
            {/* Badge Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['all', 'achievement', 'streak', 'social', 'learning'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  {category === 'all' ? '🌟 All Badges' : `${category} badges`}
                </button>
              ))}
            </div>

            {/* Badge Sections */}
            <div className="space-y-8">
              {/* Earned Badges */}
              {earnedBadges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                    Earned Badges ({earnedBadges.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {earnedBadges.map((badge, index) => {
                      const Icon = badge.icon
                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className={`relative border-2 rounded-xl p-4 text-center ${rarityColors[badge.rarity]} ${rarityGlow[badge.rarity]} transition-all cursor-pointer`}
                        >
                          <div className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                          <div className="text-xs text-green-600 font-medium">
                            +{badge.xpReward} XP • Earned {badge.earnedDate && new Date(badge.earnedDate).toLocaleDateString()}
                          </div>
                          {badge.rarity === 'legendary' && (
                            <div className="absolute -top-2 -right-2">
                              <Crown className="w-6 h-6 text-yellow-500" />
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* In Progress Badges */}
              {inProgressBadges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
                    In Progress ({inProgressBadges.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {inProgressBadges.map((badge, index) => {
                      const Icon = badge.icon
                      const progressPercent = (badge.progress / badge.maxProgress) * 100
                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="relative border-2 border-gray-200 bg-gray-50 rounded-xl p-4 text-center transition-all cursor-pointer"
                        >
                          <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 relative overflow-hidden">
                            <Icon className="w-8 h-8 text-white" />
                            <div 
                              className={`absolute bottom-0 left-0 right-0 ${badge.color} transition-all duration-500`}
                              style={{ height: `${progressPercent}%`, opacity: 0.8 }}
                            />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                          <div className="text-xs text-blue-600 font-medium mb-2">
                            {badge.progress}/{badge.maxProgress} • +{badge.xpReward} XP
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Locked Badges */}
              {lockedBadges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Award className="w-6 h-6 text-gray-400 mr-2" />
                    Locked Badges ({lockedBadges.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {lockedBadges.map((badge, index) => {
                      const Icon = badge.icon
                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative border-2 border-gray-200 bg-gray-100 rounded-xl p-4 text-center opacity-60"
                        >
                          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon className="w-8 h-8 text-gray-500" />
                          </div>
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">{badge.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                          <div className="text-xs text-gray-500">
                            🔒 +{badge.xpReward} XP
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          /* Leaderboard */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">🏆 Monthly Leaderboard</h3>
              <p className="text-blue-100">Top learners this month • Updated daily</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      entry.isCurrentUser 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                        entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                        entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {entry.rank <= 3 ? (
                          entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'
                        ) : (
                          entry.rank
                        )}
                      </div>
                      <div className="text-2xl">{entry.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{entry.name}</span>
                          {entry.isCurrentUser && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">You</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Level {entry.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{entry.xp.toLocaleString()} XP</div>
                      <div className="text-sm text-gray-600 flex items-center space-x-2">
                        <span>{entry.badges} 🏆</span>
                        <span>•</span>
                        <span>{entry.streakDays}⚡</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* New Badge Notification */}
        <AnimatePresence>
          {newBadgeAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-6 border border-yellow-200 max-w-sm"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">🎉 New Badge Earned!</h4>
                <p className="text-gray-600 text-sm mb-3">You've unlocked the Streak Master badge!</p>
                <button 
                  onClick={() => setNewBadgeAnimation(null)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
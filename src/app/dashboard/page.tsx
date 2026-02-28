'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Calendar, TrendingUp, Brain, Target, Clock, Star, Award, Video, MessageSquare, Gamepad2, BookOpen, User } from 'lucide-react'

interface ProgressData {
  date: string
  score: number
  category: string
}

interface ActivityData {
  activity: string
  time: number
  sessions: number
}

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [selectedChild, setSelectedChild] = useState('emma')

  // Mock data
  const weeklyProgress: ProgressData[] = [
    { date: 'Mon', score: 75, category: 'memory' },
    { date: 'Tue', score: 82, category: 'attention' },
    { date: 'Wed', score: 78, category: 'processing' },
    { date: 'Thu', score: 85, category: 'language' },
    { date: 'Fri', score: 88, category: 'memory' },
    { date: 'Sat', score: 92, category: 'attention' },
    { date: 'Sun', score: 87, category: 'processing' }
  ]

  const monthlyProgress: ProgressData[] = [
    { date: 'Week 1', score: 72, category: 'overall' },
    { date: 'Week 2', score: 78, category: 'overall' },
    { date: 'Week 3', score: 85, category: 'overall' },
    { date: 'Week 4', score: 89, category: 'overall' }
  ]

  const skillDistribution = [
    { name: 'Memory', value: 85, color: '#3B82F6' },
    { name: 'Attention', value: 78, color: '#10B981' },
    { name: 'Language', value: 92, color: '#8B5CF6' },
    { name: 'Processing', value: 74, color: '#F59E0B' }
  ]

  const activityData: ActivityData[] = [
    { activity: 'Memory Games', time: 45, sessions: 8 },
    { activity: 'Video Analysis', time: 30, sessions: 3 },
    { activity: 'Assessments', time: 60, sessions: 2 },
    { activity: 'Reading Practice', time: 90, sessions: 12 },
    { activity: 'Focus Training', time: 35, sessions: 6 }
  ]

  const children = [
    { id: 'emma', name: 'Emma', age: 8, avatar: '👧', condition: 'Autism' },
    { id: 'alex', name: 'Alex', age: 10, avatar: '👦', condition: 'ADHD' }
  ]

  const achievements = [
    { title: 'Memory Master', description: 'Completed 10 memory games', icon: '🧠', date: '2024-01-15', color: 'bg-blue-100' },
    { title: 'Focus Champion', description: '7-day streak of attention exercises', icon: '🎯', date: '2024-01-12', color: 'bg-green-100' },
    { title: 'Reading Star', description: 'Read for 30 minutes daily this week', icon: '📚', date: '2024-01-10', color: 'bg-purple-100' },
    { title: 'Assessment Ace', description: 'Scored 90%+ on language assessment', icon: '⭐', date: '2024-01-08', color: 'bg-yellow-100' }
  ]

  const recentActivities = [
    { type: 'game', title: 'Completed Memory Match Level 3', time: '2 hours ago', icon: Gamepad2 },
    { type: 'assessment', title: 'Language Assessment - Score: 92%', time: '1 day ago', icon: Brain },
    { type: 'video', title: 'Video behavior analysis completed', time: '2 days ago', icon: Video },
    { type: 'forum', title: 'Posted in Parent Forum', time: '3 days ago', icon: MessageSquare },
    { type: 'reading', title: 'Read "The Magic Garden" - Chapter 3', time: '4 days ago', icon: BookOpen }
  ]

  const getCurrentProgress = () => {
    return selectedTimeRange === 'week' ? weeklyProgress : monthlyProgress
  }

  const getOverallScore = () => {
    const data = getCurrentProgress()
    const average = data.reduce((sum, item) => sum + item.score, 0) / data.length
    return Math.round(average)
  }

  const getScoreChange = () => {
    const data = getCurrentProgress()
    if (data.length < 2) return 0
    const current = data[data.length - 1].score
    const previous = data[data.length - 2].score
    return current - previous
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Progress Dashboard</h1>
            <p className="text-xl text-gray-600">Track cognitive development and celebrate achievements</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Child Selector */}
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.avatar} {child.name} ({child.age})
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Selector */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTimeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{getOverallScore()}%</div>
                <div className="text-gray-600">Overall Score</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className={`text-sm mt-2 ${getScoreChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {getScoreChange() >= 0 ? '+' : ''}{getScoreChange()} from last period
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">24</div>
                <div className="text-gray-600">Activities Completed</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-sm text-green-600 mt-2">+3 this week</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">4.2h</div>
                <div className="text-gray-600">Learning Time</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-sm text-purple-600 mt-2">Daily average</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-gray-600">Achievements</div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-sm text-yellow-600 mt-2">2 new this week</div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Cognitive Progress</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Last {selectedTimeRange}
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getCurrentProgress()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Skills Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Skill Areas</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={skillDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {skillDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  {skillDistribution.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: skill.color }}
                        />
                        <span className="text-gray-700">{skill.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{skill.value}%</div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${skill.value}%`,
                              backgroundColor: skill.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-900">Recent Achievements</h3>
              </div>
              
              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className={`p-4 rounded-lg ${achievement.color}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(achievement.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View All Achievements
              </button>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h3>
              
              <div className="space-y-4">
                {recentActivities.slice(0, 4).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View Activity History
              </button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors">
                  Start Assessment
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium transition-colors">
                  Upload Video
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium transition-colors">
                  Play Games
                </button>
                <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 p-3 rounded-lg font-medium transition-colors">
                  Download Report
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Activity Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Activity Breakdown</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="activity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="time" fill="#3B82F6" name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
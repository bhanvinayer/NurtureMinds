'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, Heart, MessageCircle, Share2, Filter, Search, User, Clock, Pin, TrendingUp } from 'lucide-react'

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    role: 'parent' | 'therapist' | 'educator'
  }
  timestamp: Date
  category: string
  likes: number
  comments: number
  isPinned?: boolean
  isLiked?: boolean
  tags: string[]
}

interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar: string
    role: 'parent' | 'therapist' | 'educator'
  }
  timestamp: Date
  likes: number
  isLiked?: boolean
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'commented'>('recent')

  const categories = [
    { id: 'all', name: 'All Posts', color: 'text-gray-600' },
    { id: 'autism', name: 'Autism', color: 'text-blue-600' },
    { id: 'adhd', name: 'ADHD', color: 'text-green-600' },
    { id: 'dyslexia', name: 'Dyslexia', color: 'text-purple-600' },
    { id: 'support', name: 'Support & Tips', color: 'text-yellow-600' },
    { id: 'education', name: 'Education', color: 'text-red-600' },
    { id: 'therapy', name: 'Therapy', color: 'text-indigo-600' }
  ]

  // Mock data
  useEffect(() => {
    const mockPosts: ForumPost[] = [
      {
        id: '1',
        title: 'Sensory-friendly strategies that actually work for my autistic daughter',
        content: 'After months of trial and error, I found some amazing sensory strategies that have transformed our daily routines. My 8-year-old daughter was struggling with loud noises and busy environments...',
        author: {
          name: 'Sarah M.',
          avatar: '👩‍💼',
          role: 'parent'
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        category: 'autism',
        likes: 24,
        comments: 8,
        isPinned: true,
        isLiked: false,
        tags: ['sensory', 'strategies', 'daily-routine']
      },
      {
        id: '2',
        title: 'How to advocate effectively during IEP meetings',
        content: 'As a parent of two neurodivergent children, I\'ve learned so much about navigating the IEP process. Here are my top tips for ensuring your child gets the support they need...',
        author: {
          name: 'Dr. Jennifer L.',
          avatar: '👩‍⚕️',
          role: 'therapist'
        },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        category: 'education',
        likes: 45,
        comments: 12,
        isPinned: false,
        isLiked: true,
        tags: ['IEP', 'advocacy', 'education']
      },
      {
        id: '3',
        title: 'ADHD medication questions - first time parent needing advice',
        content: 'My 7-year-old was just diagnosed with ADHD and our pediatrician is recommending medication. I\'m feeling overwhelmed and would love to hear from other parents about their experiences...',
        author: {
          name: 'Michael R.',
          avatar: '👨‍💻',
          role: 'parent'
        },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        category: 'adhd',
        likes: 18,
        comments: 15,
        isPinned: false,
        isLiked: false,
        tags: ['ADHD', 'medication', 'advice']
      },
      {
        id: '4',
        title: 'Celebrating small wins: My dyslexic son read his first chapter book!',
        content: 'I just had to share this victory! After two years of reading intervention and lots of patience, my son just finished his first chapter book. The joy on his face was priceless...',
        author: {
          name: 'Amanda K.',
          avatar: '👩‍🏫',
          role: 'parent'
        },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        category: 'dyslexia',
        likes: 67,
        comments: 23,
        isPinned: false,
        isLiked: true,
        tags: ['celebration', 'reading', 'progress']
      }
    ]
    setPosts(mockPosts)
  }, [])

  const mockComments: Comment[] = [
    {
      id: '1',
      content: 'This is so helpful! We\'ve been struggling with similar sensory issues. Could you share more about the specific weighted blanket you mentioned?',
      author: {
        name: 'Lisa P.',
        avatar: '👩‍🎨',
        role: 'parent'
      },
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 5,
      isLiked: false
    },
    {
      id: '2',
      content: 'As an occupational therapist, I love seeing these success stories! The strategies you mentioned are evidence-based and really effective.',
      author: {
        name: 'Rachel OT',
        avatar: '👩‍⚕️',
        role: 'therapist'
      },
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      likes: 12,
      isLiked: true
    }
  ]

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes
      case 'commented':
        return b.comments - a.comments
      default: // recent
        return b.timestamp.getTime() - a.timestamp.getTime()
    }
  })

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ))
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'therapist':
        return 'bg-blue-100 text-blue-800'
      case 'educator':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-purple-100 text-purple-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Parent Community Forum</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with other parents, share experiences, and find support on your neurodiversity journey
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* New Post Button */}
              <button
                onClick={() => setNewPostOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Post
              </button>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className={category.color}>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Members</span>
                    <span className="font-semibold text-gray-900">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posts Today</span>
                    <span className="font-semibold text-gray-900">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Online Now</span>
                    <span className="font-semibold text-green-600">89</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Liked</option>
                  <option value="commented">Most Commented</option>
                </select>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {sortedPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{post.author.avatar}</div>
                    
                    <div className="flex-1">
                      {/* Post Header */}
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-medium text-gray-900">{post.author.name}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(post.author.role)}`}>
                          {post.author.role}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(post.timestamp)}
                        </span>
                      </div>

                      {/* Post Content Preview */}
                      <p className="text-gray-700 mb-4 line-clamp-2">{post.content}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center gap-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLike(post.id)
                          }}
                          className={`flex items-center gap-2 text-sm transition-colors ${
                            post.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </button>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </div>
                        
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm transition-colors">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start a conversation!'}
                </p>
                <button
                  onClick={() => setNewPostOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Create First Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Detail Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Post Content */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPost.title}</h2>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{selectedPost.author.avatar}</span>
                      <div>
                        <div className="font-medium text-gray-900">{selectedPost.author.name}</div>
                        <div className="text-sm text-gray-500">{formatTimeAgo(selectedPost.timestamp)}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">{selectedPost.content}</p>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Comments ({mockComments.length})
                    </h3>
                    
                    <div className="space-y-4">
                      {mockComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                          <span className="text-lg">{comment.author.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">{comment.author.name}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(comment.author.role)}`}>
                                {comment.author.role}
                              </span>
                              <span className="text-gray-500 text-sm">{formatTimeAgo(comment.timestamp)}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{comment.content}</p>
                            <button className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                              <Heart className="w-3 h-3 inline mr-1" />
                              {comment.likes}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comment Input */}
                    <div className="mt-6">
                      <textarea
                        placeholder="Add your comment..."
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
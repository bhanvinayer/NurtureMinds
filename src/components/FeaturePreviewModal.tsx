'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Clock, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface FeatureHighlight {
  title: string
  description: string
  benefits: string[]
  timeEstimate: string
  userCount?: string
  ctaText: string
  ctaHref: string
}

const featureHighlights: Record<string, FeatureHighlight> = {
  assessment: {
    title: "AI-Powered Assessments",
    description: "Our adaptive assessment system uses advanced AI to understand your child's unique cognitive patterns, learning style, and areas of strength.",
    benefits: [
      "Personalized to your child's pace",
      "Identifies learning preferences", 
      "Provides detailed insights",
      "Tracks progress over time"
    ],
    timeEstimate: "15-20 min",
    userCount: "1,200+ families",
    ctaText: "Start Assessment",
    ctaHref: "/assessment"
  },
  'video-analysis': {
    title: "Video Behavior Analysis",
    description: "Upload videos of your child to get AI-powered insights into their emotional states, engagement levels, and behavioral patterns using computer vision.",
    benefits: [
      "Emotion and engagement tracking",
      "Behavioral pattern analysis",
      "Privacy-focused processing",
      "Detailed visual reports"
    ],
    timeEstimate: "5-10 min",
    userCount: "800+ videos analyzed",
    ctaText: "Try Video Analysis",
    ctaHref: "/video-analysis"
  },
  dashboard: {
    title: "Progress Dashboard",
    description: "Get a comprehensive view of your child's development journey with interactive charts, milestone tracking, and personalized recommendations.",
    benefits: [
      "Visual progress tracking",
      "Milestone celebrations",
      "Personalized insights",
      "Shareable reports"
    ],
    timeEstimate: "Always available",
    userCount: "Real-time updates",
    ctaText: "View Dashboard",
    ctaHref: "/dashboard"
  },
  games: {
    title: "Cognitive Games",
    description: "Engaging, adaptive games designed by specialists to build memory, attention, language, and social-emotional skills in a fun environment.",
    benefits: [
      "Adaptive difficulty levels",
      "Skill-building focus",
      "Progress tracking",
      "Fun and engaging"
    ],
    timeEstimate: "10-30 min",
    userCount: "50+ games available",
    ctaText: "Play Games",
    ctaHref: "/games"
  },
  chatbot: {
    title: "AI Fact Checker",
    description: "Get instant, evidence-based answers about autism, ADHD, dyslexia, and child development from our trained AI assistant.",
    benefits: [
      "Evidence-based responses",
      "Available 24/7",
      "Personalized to your situation",
      "Trusted medical sources"
    ],
    timeEstimate: "Instant answers",
    userCount: "10,000+ questions answered",
    ctaText: "Ask a Question",
    ctaHref: "/chatbot"
  },
  forum: {
    title: "Parent Community",
    description: "Connect with other families on similar journeys. Share experiences, get support, and learn from a caring community of parents.",
    benefits: [
      "Peer support network",
      "Expert guidance",
      "Safe, moderated space",
      "Local connections"
    ],
    timeEstimate: "Join anytime",
    userCount: "500+ active families",
    ctaText: "Join Community",
    ctaHref: "/forum"
  }
}

interface FeaturePreviewModalProps {
  featureKey: string
  isOpen: boolean
  onClose: () => void
}

export default function FeaturePreviewModal({ featureKey, isOpen, onClose }: FeaturePreviewModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)
  const feature = featureHighlights[featureKey]

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!feature) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            transition={{ duration: 0.3 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {/* Header */}
              <div className="relative p-6 pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h2>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{feature.timeEstimate}</span>
                  </div>
                  {feature.userCount && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{feature.userCount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex space-x-3">
                  <Link
                    href={feature.ctaHref}
                    onClick={handleClose}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{feature.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
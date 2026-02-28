'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, CheckCircle, Brain, Camera, Users, MessageCircle, BarChart, Sparkles, Play } from 'lucide-react'
import Link from 'next/link'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: any
  href: string
  color: string
  longDescription: string
  benefits: string[]
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to NurtureMinds!",
    description: "Let's take a quick tour to show you how our platform can support your child's neurodivergent journey.",
    icon: CheckCircle,
    href: "",
    color: "bg-gradient-to-br from-blue-500 to-purple-500",
    longDescription: "NurtureMinds is designed to provide comprehensive support for families with neurodivergent children through AI-powered tools and community support.",
    benefits: ["Personalized insights", "Evidence-based approaches", "Supportive community", "Easy-to-use interface"]
  },
  {
    id: 2,
    title: "AI-Powered Assessments",
    description: "Start with personalized cognitive assessments that adapt to your child's unique learning style.",
    icon: Brain,
    href: "/assessment",
    color: "bg-blue-500",
    longDescription: "Our assessments use advanced AI to understand your child's cognitive patterns and provide detailed insights.",
    benefits: ["Adaptive testing", "Detailed reports", "Progress tracking", "Personalized recommendations"]
  },
  {
    id: 3,
    title: "Video Behavior Analysis",
    description: "Upload videos to analyze facial expressions, emotions, and engagement levels using advanced computer vision.",
    icon: Camera,
    href: "/video-analysis",
    color: "bg-green-500",
    longDescription: "Using OpenCV technology, we analyze video content to provide insights into emotional states and behavioral patterns.",
    benefits: ["Emotion detection", "Engagement analysis", "Behavioral insights", "Progress visualization"]
  },
  {
    id: 4,
    title: "Progress Dashboard",
    description: "Track your child's development over time with detailed analytics and visualizations.",
    icon: BarChart,
    href: "/dashboard",
    color: "bg-teal-500",
    longDescription: "Get a comprehensive view of your child's progress across all activities and assessments.",
    benefits: ["Visual progress tracking", "Detailed analytics", "Growth milestones", "Export reports"]
  },
  {
    id: 5,
    title: "Cognitive Games",
    description: "Engage your child with adaptive games that build memory, attention, language, and social skills.",
    icon: Sparkles,
    href: "/games",
    color: "bg-pink-500",
    longDescription: "Fun, educational games that adapt to your child's skill level and learning preferences.",
    benefits: ["Skill building", "Adaptive difficulty", "Progress tracking", "Fun & engaging"]
  },
  {
    id: 6,
    title: "AI Fact Checker",
    description: "Get verified, evidence-based answers about autism, ADHD, dyslexia, and child development.",
    icon: MessageCircle,
    href: "/chatbot",
    color: "bg-orange-500",
    longDescription: "Our AI assistant provides reliable information and answers to your questions about child development.",
    benefits: ["Evidence-based answers", "24/7 availability", "Personalized responses", "Trusted sources"]
  },
  {
    id: 7,
    title: "Parent Community",
    description: "Connect with other families, share experiences, and get support from a caring community.",
    icon: Users,
    href: "/forum",
    color: "bg-purple-500",
    longDescription: "Join a supportive community of families on similar journeys, sharing experiences and advice.",
    benefits: ["Peer support", "Expert advice", "Shared experiences", "Safe environment"]
  }
]

interface OnboardingProps {
  onComplete: () => void
  onSkip: () => void
}

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const currentStepData = onboardingSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === onboardingSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => {
      onComplete()
    }, 300)
  }

  const handleSkip = () => {
    setIsVisible(false)
    setTimeout(() => {
      onSkip()
    }, 300)
  }

  const progressPercentage = ((currentStep + 1) / onboardingSteps.length) * 100

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Onboarding Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {/* Header */}
              <div className="relative p-6 pb-0">
                <button
                  onClick={handleSkip}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
                    <span>{Math.round(progressPercentage)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 ${currentStepData.color} rounded-xl flex items-center justify-center mb-6`}>
                    <currentStepData.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title and Description */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {currentStepData.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-4">
                    {currentStepData.description}
                  </p>
                  
                  {currentStepData.longDescription && (
                    <p className="text-gray-600 mb-6">
                      {currentStepData.longDescription}
                    </p>
                  )}

                  {/* Benefits */}
                  {currentStepData.benefits.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {currentStepData.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Try It Button */}
                  {currentStepData.href && (
                    <div className="mb-6">
                      <Link
                        href={currentStepData.href}
                        onClick={handleSkip}
                        className={`inline-flex items-center space-x-2 ${currentStepData.color} text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity`}
                      >
                        <Play className="w-4 h-4" />
                        <span>Try This Feature</span>
                      </Link>
                    </div>
                  )}
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isFirstStep 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSkip}
                      className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Skip Tour
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      <span>{isLastStep ? 'Get Started' : 'Next'}</span>
                      {!isLastStep && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
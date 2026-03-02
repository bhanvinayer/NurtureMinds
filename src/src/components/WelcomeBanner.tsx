'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, ArrowRight } from 'lucide-react'
import { useOnboarding } from '@/contexts/OnboardingContext'

interface WelcomeBannerProps {
  showForReturningUsers?: boolean
}

export default function WelcomeBanner({ showForReturningUsers = false }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { restartOnboarding } = useOnboarding()

  const handleStartTour = () => {
    restartOnboarding()
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {showForReturningUsers ? 'Welcome back!' : 'Welcome to NurtureMinds!'}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {showForReturningUsers 
                      ? 'Take a quick refresher tour to discover new features and capabilities.'
                      : 'Take a 2-minute guided tour to discover all the amazing features we have for your family.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleStartTour}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <Play className="w-4 h-4" />
                <span>Start Tour</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart, Home, Brain, Video, Gamepad2, MessageSquare, Bot, BarChart3, User, LogOut, HelpCircle } from 'lucide-react'
import { useOnboarding } from '@/contexts/OnboardingContext'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { restartOnboarding } = useOnboarding()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/assessment', label: 'Assessment', icon: Brain },
    { href: '/video-analysis', label: 'Video Analysis', icon: Video },
    { href: '/games', label: 'Games', icon: Gamepad2 },
    { href: '/forum', label: 'Forum', icon: MessageSquare },
    { href: '/chatbot', label: 'AI Assistant', icon: Bot },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Nurture Minds</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-100 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
            
            {/* User Profile & Actions */}
            <div className="ml-4 flex items-center space-x-2">
              <button 
                onClick={restartOnboarding}
                className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Take Platform Tour"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button 
                  onClick={() => {
                    restartOnboarding()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors w-full"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Take Platform Tour</span>
                </button>
                <button className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors w-full">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors w-full">
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
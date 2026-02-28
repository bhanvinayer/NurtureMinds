'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart, Home, Brain, Video, Gamepad2, MessageSquare, Bot, BarChart3, User, LogOut, HelpCircle, Zap, Headset, Trophy, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { useSidebar } from '@/hooks/useSidebar'

export default function Navigation() {
  const { isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar()
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
    { href: '/learning-paths', label: 'Learning Paths', icon: Sparkles },
    { href: '/gamification', label: 'Achievements', icon: Trophy },
    { href: '/immersive', label: 'AR/VR', icon: Headset },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-7 w-7 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">Nurture Minds</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 z-40 bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-blue-600 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span 
                initial={false}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-gray-900"
              >
                Nurture Minds
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? 'text-blue-600 bg-blue-50 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${
                  active ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                }`} />
                {!isCollapsed && (
                  <motion.span
                    initial={false}
                    animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -10 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
                {active && (
                  <motion.div
                    layoutId="activeTabSidebar"
                    className="absolute inset-0 bg-blue-100 rounded-xl -z-10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button 
            onClick={restartOnboarding}
            className={`w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Take Platform Tour' : ''}
          >
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={false}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="ml-3"
              >
                Platform Tour
              </motion.span>
            )}
          </button>
          <button className={`w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <User className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={false}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="ml-3"
              >
                Profile
              </motion.span>
            )}
          </button>
          <button className={`w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={false}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="ml-3"
              >
                Sign Out
              </motion.span>
            )}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-50 bg-white"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-7 w-7 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">Nurture Minds</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl font-medium transition-colors ${
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
              
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <button 
                  onClick={() => {
                    restartOnboarding()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 px-4 py-4 rounded-xl font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors w-full"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Take Platform Tour</span>
                </button>
                <button className="flex items-center space-x-3 px-4 py-4 rounded-xl font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors w-full">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button className="flex items-center space-x-3 px-4 py-4 rounded-xl font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors w-full">
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
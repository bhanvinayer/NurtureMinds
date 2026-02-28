'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface OnboardingContextType {
  shouldShowOnboarding: boolean
  completeOnboarding: () => void
  restartOnboarding: () => void
  skipOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

interface OnboardingProviderProps {
  children: ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('nurture-minds-onboarding-completed')
    const isFirstVisit = !hasCompletedOnboarding

    setShouldShowOnboarding(isFirstVisit)
    setIsLoaded(true)
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem('nurture-minds-onboarding-completed', 'true')
    localStorage.setItem('nurture-minds-onboarding-completed-date', new Date().toISOString())
    setShouldShowOnboarding(false)
  }

  const skipOnboarding = () => {
    localStorage.setItem('nurture-minds-onboarding-completed', 'true')
    localStorage.setItem('nurture-minds-onboarding-skipped', 'true')
    localStorage.setItem('nurture-minds-onboarding-completed-date', new Date().toISOString())
    setShouldShowOnboarding(false)
  }

  const restartOnboarding = () => {
    localStorage.removeItem('nurture-minds-onboarding-completed')
    localStorage.removeItem('nurture-minds-onboarding-skipped')
    localStorage.removeItem('nurture-minds-onboarding-completed-date')
    setShouldShowOnboarding(true)
  }

  const value = {
    shouldShowOnboarding: shouldShowOnboarding && isLoaded,
    completeOnboarding,
    restartOnboarding,
    skipOnboarding,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}
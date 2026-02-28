'use client'

import { useOnboarding } from '@/contexts/OnboardingContext'
import Onboarding from './Onboarding'

export default function OnboardingWrapper() {
  const { shouldShowOnboarding, completeOnboarding, skipOnboarding } = useOnboarding()

  if (!shouldShowOnboarding) {
    return null
  }

  return (
    <Onboarding
      onComplete={completeOnboarding}
      onSkip={skipOnboarding}
    />
  )
}
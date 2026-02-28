import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from '@/components/Navigation'
import { OnboardingProvider } from '@/contexts/OnboardingContext'
import OnboardingWrapper from '@/components/OnboardingWrapper'
import VoiceNavigation from '@/components/VoiceNavigation'
import { SidebarProvider } from '@/hooks/useSidebar'
import MainContentArea from '@/components/MainContentArea'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nurture Minds - AI-Powered Platform for Neurodivergent Children',
  description: 'Comprehensive web application supporting neurodivergent children and families with AI assessments, video behavior analysis, cognitive games, and community support.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OnboardingProvider>
          <SidebarProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              
              <MainContentArea>
                {children}
              </MainContentArea>
            </div>
            
            <OnboardingWrapper />
            <VoiceNavigation />
          </SidebarProvider>
        </OnboardingProvider>
      </body>
    </html>
  );
}

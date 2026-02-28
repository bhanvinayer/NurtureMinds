'use client'

import { useSidebar } from '@/hooks/useSidebar'

export default function MainContentArea({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className={`main-content-area ${
      isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
    }`}>
      {/* Mobile top padding */}
      <div className="lg:hidden h-16"></div>
      
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}
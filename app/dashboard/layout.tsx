'use client'

import Header from '@/components/Header'
import { Authenticated } from 'convex/react'
import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-screen'>
      <Authenticated>
        Sidebar
      </Authenticated>

      <div className='flex flex-1'>
        <Header />
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

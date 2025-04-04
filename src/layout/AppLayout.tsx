import { Sidebar } from '@/components/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import React from 'react'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="flex h-full w-screen overflow-hidden bg-background-snk antialiased">
      <Sidebar />
      <div className="flex-1">
        <div className="px-4 py-2 min-h-full">
          <Outlet />
          <Toaster />
        </div>
      </div>
    </div>
  )
}

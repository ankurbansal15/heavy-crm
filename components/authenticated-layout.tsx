"use client"

import React from 'react'
import { useAuth } from './auth-provider'
import { AppSidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useRouter, usePathname } from 'next/navigation'
import { LoadingSpinner } from "@/components/loading-spinner"
import { Suspense } from 'react'
import { useDatabaseInit } from '@/hooks/use-database-init'

// Exact public routes (no auth required)
const publicRoutes = ['/', '/login', '/signup', '/pricing', '/contact', '/about', '/features', '/security', '/privacy', '/terms']
// Public route prefixes (any path starting with these stays public – future friendly)
const publicRoutePrefixes = ['/pricing', '/contact', '/about', '/features', '/security', '/privacy', '/terms']

function isPublicPath(path: string) {
  if (publicRoutes.includes(path)) return true
  return publicRoutePrefixes.some(prefix => path.startsWith(prefix))
}

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/messages", label: "Messages" },
  { href: "/compose", label: "Compose" },
  { href: "/contacts", label: "Contacts" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/templates", label: "Templates" },
  { href: "/chatbot", label: "Chatbot" },
  { href: "/analytics", label: "Analytics" },
  { href: "/integrations", label: "Integrations" },
  { href: "/help", label: "Help" },
]

// Removed header tabs + search for new sidebar-centric design.

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const publicAllowed = isPublicPath(pathname)

  // Show loading during auth initialization
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Handle authentication redirects after loading is complete
  React.useEffect(() => {
    if (!loading) {
      if (!user && !publicAllowed) {
        router.replace('/login')
      } else if (user && (pathname === '/login' || pathname === '/signup')) {
        router.replace('/dashboard')
      }
    }
  }, [user, loading, publicAllowed, pathname, router])

  // If route is public, just render it (even if user logged in we allow marketing pages)
  if (publicAllowed) return <>{children}</>

  // While deciding redirect (no user) show nothing to avoid flash
  if (!user) return null

  // Protected shell (contains heavy hooks)
  return <ProtectedShell pathname={pathname}>{children}</ProtectedShell>
}

function ProtectedShell({ children, pathname }: { children: React.ReactNode, pathname: string }) {
  const { isReady: dbReady, isLoading: dbLoading, error: dbError } = useDatabaseInit()

  // DB init states
  if (dbLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-sm text-muted-foreground">Initializing database...</p>
        </div>
      </div>
    )
  }

  if (dbError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Database Initialization Error</h2>
          <p className="text-sm text-muted-foreground mb-4">{dbError}</p>
          <p className="text-xs text-muted-foreground">Please check the browser console for the SQL commands to run in your Supabase SQL editor.</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto p-6 md:p-8 bg-gray-50 dark:bg-black relative">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}


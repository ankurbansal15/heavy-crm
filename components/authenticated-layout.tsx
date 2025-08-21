"use client"

import React, { useState, useCallback } from 'react'
import { useAuth } from './auth-provider'
import { AppSidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchPopup } from "@/components/search-popup"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

const getTabsForPath = (path: string) => {
  if (path.startsWith('/inbox')) {
    return {
      basePath: '/inbox',
      tabs: [
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' },
        { value: 'whatsapp', label: 'WhatsApp' }
      ]
    }
  }
  if (path.startsWith('/compose')) {
    return {
      basePath: '/compose',
      tabs: [
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' },
        { value: 'whatsapp', label: 'WhatsApp' }
      ]
    }
  }
  if (path.startsWith('/templates')) {
    return {
      basePath: '/templates',
      tabs: [
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' },
        { value: 'whatsapp', label: 'WhatsApp' }
      ]
    }
  }
  return null
}

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
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(navItems)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isReady: dbReady, isLoading: dbLoading, error: dbError } = useDatabaseInit()

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      setIsSearchOpen(false)
    } else {
      const filteredResults = navItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filteredResults)
      setIsSearchOpen(true)
    }
  }, [])

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
          <header className="flex h-16 items-center justify-between border-b px-4 bg-white dark:bg-black">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </SidebarTrigger>
            </div>
            <div className="flex-1 max-w-3xl mx-4 flex items-center gap-4">
              <div className="relative w-[240px]">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search features..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {getTabsForPath(pathname) && (
                <Tabs
                  defaultValue={pathname.split('/').pop()}
                  className="flex-1"
                  onValueChange={(value) => router.push(`${getTabsForPath(pathname)?.basePath}/${value}`)}
                >
                  <TabsList className="w-full">
                    {getTabsForPath(pathname)?.tabs.map((tab) => (
                      <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}
              <SearchPopup
                results={searchResults}
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-black relative">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}


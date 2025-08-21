"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Overview } from "@/components/overview"
import { MessageStatsGroup } from "@/components/dashboard/message-stats"
import { SalesStats } from "@/components/dashboard/sales-stats"
import { Notes } from "@/components/dashboard/notes"
import { Note } from "@/types/dashboard"
import { supabase } from '@/lib/supabase'
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Settings } from 'lucide-react'
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }

      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch notes. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNote = async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ 
          ...note, 
          user_id: user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) {
        throw error
      }

      if (data) {
        setNotes([data[0], ...notes])
        toast({
          title: "Success",
          description: "Note added successfully",
        })
      }
    } catch (error) {
      console.error('Error adding note:', error)
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditNote = async (id: string, updates: Partial<Note>) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) {
        throw error
      }

      setNotes(notes.map(note => 
        note.id === id ? { ...note, ...updates, updated_at: new Date().toISOString() } : note
      ))
      
      toast({
        title: "Success",
        description: "Note updated successfully",
      })
    } catch (error) {
      console.error('Error updating note:', error)
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) {
        throw error
      }

      setNotes(notes.filter(note => note.id !== id))
      toast({
        title: "Success",
        description: "Note deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting note:', error)
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Sample data - In a real app, this would come from your API
  const messageStats = {
    whatsapp: {
      total: 1500,
      delivered: 1450,
      read: 1200,
      failed: 50
    },
    email: {
      total: 5000,
      delivered: 4800,
      read: 2500,
      failed: 200
    },
    sms: {
      total: 2000,
      delivered: 1950,
      read: 1800,
      failed: 50
    }
  }

  const salesStats = {
    totalLeads: 250,
    totalDeals: 45,
    totalValue: 125000,
    conversionRate: 18
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-50"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 p-8 pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-fade-in">
            <div className="flex items-center space-x-6">
              <div className="relative hover-lift">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-xl">
                  <AvatarImage src={user?.user_metadata.avatar_url} />
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl font-semibold">
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-white dark:border-gray-800 bg-green-500 shadow-lg animate-pulse" />
              </div>
              <div className="space-y-2">
                <h1 className="text-heading-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                  Welcome back, {user?.email?.split('@')[0]}
                </h1>
                <p className="text-body text-muted-foreground">
                  Here's what's happening with your messaging and sales activities
                </p>
                <div className="flex items-center gap-2 text-caption text-primary">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  ONLINE NOW
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 animate-slide-in-right">
              <Button variant="ghost" size="icon" className="relative glass-effect rounded-full hover-lift">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white animate-pulse" />
              </Button>
              <Button variant="ghost" size="icon" className="glass-effect rounded-full hover-lift">
                <Calendar className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="glass-effect rounded-full hover-lift">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8 space-y-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="glass-effect border-0 shadow-lg hover-lift">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
              <Card className="card-elevated hover-lift bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    Total Messages
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                    {messageStats.whatsapp.total + messageStats.email.total + messageStats.sms.total}
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">+20.1% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="card-elevated hover-lift bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    Delivery Rate
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">98.7%</div>
                  <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">+2.4% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="card-elevated hover-lift bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-900 dark:text-green-100 flex items-center gap-2">
                    Read Rate
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">76.2%</div>
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">+5.2% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="card-elevated hover-lift bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-900 dark:text-orange-100 flex items-center gap-2">
                    Response Rate
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-2">12.5%</div>
                  <p className="text-orange-700 dark:text-orange-300 text-sm font-medium">+1.2% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 animate-slide-in-left">
              <Card className="card-elevated hover-lift md:col-span-4 glass-effect border-0 shadow-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-heading-4">Message Activity</CardTitle>
                  <CardDescription className="text-body-small">
                    Message delivery and engagement over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Overview />
                </CardContent>
              </Card>

              <Card className="card-elevated hover-lift md:col-span-3 glass-effect border-0 shadow-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-heading-4">Sales Overview</CardTitle>
                  <CardDescription className="text-body-small">
                    Your sales pipeline metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <SalesStats stats={salesStats} />
                </CardContent>
              </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-slide-in-right">
              <Card className="card-elevated hover-lift md:col-span-2 glass-effect border-0 shadow-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-heading-4">Message Stats by Channel</CardTitle>
                  <CardDescription className="text-body-small">
                    Detailed breakdown of message performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <MessageStatsGroup
                    whatsapp={messageStats.whatsapp}
                    email={messageStats.email}
                    sms={messageStats.sms}
                  />
                </CardContent>
              </Card>

              <Card className="card-elevated hover-lift md:col-span-1 glass-effect border-0 shadow-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-heading-4">Quick Notes</CardTitle>
                  <CardDescription className="text-body-small">
                    Your recent notes and reminders
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Notes
                    notes={notes}
                    onAddNote={handleAddNote}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <Card className="card-elevated glass-effect border-0 shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-heading-3">Analytics Dashboard</CardTitle>
                <CardDescription className="text-body max-w-md mx-auto">
                  Comprehensive analytics and insights for your messaging campaigns will be displayed here. Get detailed metrics and performance data.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="bg-gradient-to-br from-muted/50 to-muted rounded-xl p-12">
                  <p className="text-muted-foreground">Coming Soon - Advanced Analytics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 animate-fade-in">
            <Card className="card-elevated glass-effect border-0 shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-heading-3">Reports Center</CardTitle>
                <CardDescription className="text-body max-w-md mx-auto">
                  Generate and download detailed reports for your campaigns, messages, and customer interactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="bg-gradient-to-br from-muted/50 to-muted rounded-xl p-12">
                  <p className="text-muted-foreground">Coming Soon - Advanced Reports</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


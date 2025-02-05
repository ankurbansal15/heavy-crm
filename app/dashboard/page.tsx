"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={user?.user_metadata.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                {user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.email?.split('@')[0]}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your messaging and sales activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative rounded-full bg-background p-2 hover:bg-accent">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button className="rounded-full bg-background p-2 hover:bg-accent">
            <Calendar className="h-5 w-5" />
          </button>
          <button className="rounded-full bg-background p-2 hover:bg-accent">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Total Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{messageStats.whatsapp.total + messageStats.email.total + messageStats.sms.total}</div>
                <p className="text-blue-100">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Delivery Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">98.7%</div>
                <p className="text-purple-100">+2.4% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Read Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">76.2%</div>
                <p className="text-green-100">+5.2% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">12.5%</div>
                <p className="text-orange-100">+1.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Message Activity</CardTitle>
                <CardDescription>
                  Message delivery and engagement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Overview />
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Your sales pipeline metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesStats stats={salesStats} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Message Stats by Channel</CardTitle>
                <CardDescription>
                  Detailed breakdown of message performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessageStatsGroup
                  whatsapp={messageStats.whatsapp}
                  email={messageStats.email}
                  sms={messageStats.sms}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Quick Notes</CardTitle>
                <CardDescription>
                  Your recent notes and reminders
                </CardDescription>
              </CardHeader>
              <CardContent>
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

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Content</CardTitle>
              <CardDescription>
                Detailed analytics will be shown here
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports Content</CardTitle>
              <CardDescription>
                Detailed reports will be shown here
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


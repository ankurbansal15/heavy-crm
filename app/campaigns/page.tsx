"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, BarChart3, Send, Users, TrendingUp, Activity, MessageSquare, Mail, Smartphone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Campaign {
  id: string
  name: string
  status: string
  type: string
  sent: number
  delivered: number
  read: number
}

const initialCampaigns: Campaign[] = [
  { id: '1', name: "Summer Sale", status: "Active", type: "whatsapp", sent: 1000, delivered: 980, read: 750 },
  { id: '2', name: "New Product Launch", status: "Scheduled", type: "sms", sent: 0, delivered: 0, read: 0 },
  { id: '3', name: "Customer Feedback", status: "Completed", type: "email", sent: 500, delivered: 498, read: 400 },
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [newCampaign, setNewCampaign] = useState({ name: "", status: "Scheduled", type: "whatsapp" })
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCampaigns()
    }
  }, [user])

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching campaigns:', error)
      setError("Error fetching campaigns. Please try again.")
    } else {
      setCampaigns(data || [])
      setError(null)
    }
  }

  const addCampaign = async () => {
    if (!user) return
    setError(null)
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{ ...newCampaign, user_id: user.id, sent: 0, delivered: 0, read: 0 }])
      .select()
    if (error) {
      console.error('Error adding campaign:', error)
      setError("Error adding campaign. Please try again.")
    } else {
      setCampaigns([data[0], ...campaigns])
      setNewCampaign({ name: "", status: "Scheduled", type: "whatsapp" })
      setError(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'sms':
        return <Smartphone className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-heading-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                Campaign Management
              </h1>
              <p className="text-body text-muted-foreground">
                Create, manage, and track your messaging campaigns
              </p>
              <div className="flex items-center gap-2 text-caption text-primary">
                <BarChart3 className="w-4 h-4" />
                {campaigns.length} CAMPAIGNS TOTAL
              </div>
            </div>
            <div className="flex items-center gap-3 animate-slide-in-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="btn-primary hover-lift">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect border-0 shadow-2xl">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="text-heading-4">Create New Campaign</DialogTitle>
                    <DialogDescription className="text-body-small">
                      Set up a new messaging campaign to reach your audience
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Campaign Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter campaign name..."
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                        className="input-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-medium">Campaign Type</Label>
                      <Select
                        value={newCampaign.type}
                        onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value })}
                      >
                        <SelectTrigger id="type" className="input-primary">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              WhatsApp
                            </div>
                          </SelectItem>
                          <SelectItem value="sms">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4" />
                              SMS
                            </div>
                          </SelectItem>
                          <SelectItem value="email">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium">Initial Status</Label>
                      <Select
                        value={newCampaign.status}
                        onValueChange={(value) => setNewCampaign({ ...newCampaign, status: value })}
                      >
                        <SelectTrigger id="status" className="input-primary">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-3">
                      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button onClick={addCampaign} className="btn-primary">
                      Create Campaign
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 -mt-4 mb-8">
        <div className="grid gap-6 md:grid-cols-4 animate-slide-up">
          <Card className="card-elevated hover-lift bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Total Campaigns</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{campaigns.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated hover-lift bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{campaigns.filter(c => c.status === 'Active').length}</p>
                </div>
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated hover-lift bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Total Sent</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{campaigns.reduce((acc, c) => acc + c.sent, 0)}</p>
                </div>
                <Send className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated hover-lift bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 dark:text-orange-300 text-sm font-medium">Avg. Delivery</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {campaigns.length > 0 ? Math.round((campaigns.reduce((acc, c) => acc + c.delivered, 0) / Math.max(campaigns.reduce((acc, c) => acc + c.sent, 0), 1)) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <Card className="card-elevated glass-effect border-0 shadow-xl animate-fade-in">
          <CardHeader className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-heading-4">Campaign Overview</CardTitle>
                <CardDescription className="text-body-small">
                  Monitor and manage all your campaigns in one place
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Campaign</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Sent</TableHead>
                    <TableHead className="font-semibold">Delivered</TableHead>
                    <TableHead className="font-semibold">Read</TableHead>
                    <TableHead className="font-semibold">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign, index) => (
                      <TableRow 
                        key={campaign.id} 
                        className="hover:bg-muted/30 transition-colors animate-fade-in" 
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-primary text-white text-sm font-semibold flex items-center justify-center">
                              {campaign.name?.[0]?.toUpperCase() || 'C'}
                            </div>
                            {campaign.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(campaign.type)}
                            <span className="capitalize">{campaign.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{campaign.sent.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{campaign.delivered.toLocaleString()}</span>
                            <span className="text-muted-foreground text-sm">
                              ({campaign.sent > 0 ? Math.round((campaign.delivered / campaign.sent) * 100) : 0}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{campaign.read.toLocaleString()}</span>
                            <span className="text-muted-foreground text-sm">
                              ({campaign.delivered > 0 ? Math.round((campaign.read / campaign.delivered) * 100) : 0}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${campaign.sent > 0 ? Math.min((campaign.read / campaign.sent) * 100, 100) : 0}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                              {campaign.sent > 0 ? Math.round((campaign.read / campaign.sent) * 100) : 0}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          <BarChart3 className="w-12 h-12 opacity-50" />
                          <div>
                            <p className="text-lg font-medium">No campaigns found</p>
                            <p className="text-sm">Create your first campaign to get started</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


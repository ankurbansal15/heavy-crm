"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Create New Campaign</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={newCampaign.type}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value })}
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Button onClick={addCampaign}>Create Campaign</Button>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead>Delivered</TableHead>
            <TableHead>Read</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.name}</TableCell>
              <TableCell>{campaign.status}</TableCell>
              <TableCell>{campaign.type}</TableCell>
              <TableCell>{campaign.sent}</TableCell>
              <TableCell>{campaign.delivered}</TableCell>
              <TableCell>{campaign.read}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, CheckCircle2, XCircle } from 'lucide-react'

// Sample data for SMS messages
const initialMessages = [
  {
    id: 1,
    contact: "John Doe",
    phone: "+1234567890",
    message: "Your appointment is confirmed for tomorrow at 2 PM.",
    timestamp: "10:30 AM",
    status: "delivered",
    type: "outbound",
  },
  {
    id: 2,
    contact: "Alice Smith",
    phone: "+1987654321",
    message: "Yes, I'll be there. Thank you!",
    timestamp: "Yesterday",
    status: "received",
    type: "inbound",
  },
  // Add more sample messages...
]

export default function SMSInboxPage() {
  const [messages, setMessages] = useState(initialMessages)
  const { session } = useAuth()
  useEffect(() => {
    if (!session) return
    const load = async () => {
      const res = await fetch('/api/messages?channel=sms', { headers: { Authorization: `Bearer ${session.access_token}` } })
      const data = await res.json()
      if (data.messages) {
        setMessages(data.messages.map((m: any, idx: number) => ({
          id: idx + 1000,
          contact: m.to || m.from || 'Unknown',
          phone: m.to || m.from || '',
          message: m.body_text || '',
          timestamp: new Date(m.created_at).toLocaleTimeString(),
          status: m.status === 'received' ? 'received' : 'delivered',
          type: m.direction,
        })))
      }
    }
    load()
  }, [session])
  const [selectedMessage, setSelectedMessage] = useState<typeof initialMessages[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("all")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const filteredMessages = messages.filter(message =>
    (currentTab === "all" || message.type === currentTab) &&
    (message.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
     message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
     message.phone.includes(searchQuery))
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Tabs defaultValue="all" className="flex-1" onValueChange={setCurrentTab}>
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="inbound" className="flex-1">Inbound</TabsTrigger>
            <TabsTrigger value="outbound" className="flex-1">Outbound</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 border-b cursor-pointer hover:bg-accent ${
                  selectedMessage?.id === message.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`/avatars/${message.id}.png`} alt={message.contact} />
                      <AvatarFallback>{message.contact[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{message.contact}</div>
                      <div className="text-sm text-muted-foreground">{message.phone}</div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{message.timestamp}</span>
                </div>
                <div className="text-sm text-muted-foreground truncate mt-2">
                  {message.type === "outbound" && "You: "}{message.message}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {message.type === "inbound" ? "Received" : "Sent"}
                  </Badge>
                  {getStatusIcon(message.status)}
                </div>
              </div>
            ))}
          </ScrollArea>
        </Tabs>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedMessage ? (
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedMessage.contact}</h2>
                <p className="text-muted-foreground">{selectedMessage.phone}</p>
              </div>
              <Badge variant="outline">
                {selectedMessage.type === "inbound" ? "Received" : "Sent"}
              </Badge>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{selectedMessage.timestamp}</span>
                  {getStatusIcon(selectedMessage.status)}
                </div>
                <p className="text-lg">{selectedMessage.message}</p>
              </CardContent>
            </Card>
            <div className="mt-6 flex gap-4">
              <Button className="flex-1">Reply</Button>
              <Button variant="outline" className="flex-1">Forward</Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, StarOff, Archive, Trash2, Flag, Mail, Search } from 'lucide-react'

// Sample data for emails
const initialEmails = [
  {
    id: 1,
    from: "John Doe",
    email: "john.doe@example.com",
    subject: "Project Update Meeting",
    preview: "Hi team, I wanted to schedule a meeting to discuss the latest project updates...",
    timestamp: "10:30 AM",
    read: false,
    starred: true,
    folder: "inbox",
    hasAttachments: true,
  },
  {
    id: 2,
    from: "Alice Smith",
    email: "alice.smith@example.com",
    subject: "Q4 Report Review",
    preview: "Please find attached the Q4 report for your review. Key highlights include...",
    timestamp: "Yesterday",
    read: true,
    starred: false,
    folder: "inbox",
    hasAttachments: true,
  },
  // Add more sample emails...
]

export default function EmailInboxPage() {
  const [emails, setEmails] = useState(initialEmails)
  const [selectedEmail, setSelectedEmail] = useState<typeof initialEmails[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFolder, setCurrentFolder] = useState("inbox")

  const handleStarEmail = (emailId: number) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ))
  }

  const handleArchiveEmail = (emailId: number) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, folder: 'archived' } : email
    ))
  }

  const handleDeleteEmail = (emailId: number) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, folder: 'trash' } : email
    ))
  }

  const filteredEmails = emails.filter(email => 
    email.folder === currentFolder &&
    (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
     email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
     email.preview.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Tabs defaultValue="inbox" className="flex-1">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="inbox" className="flex-1">Inbox</TabsTrigger>
            <TabsTrigger value="starred" className="flex-1">Starred</TabsTrigger>
            <TabsTrigger value="sent" className="flex-1">Sent</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`p-4 border-b cursor-pointer hover:bg-accent ${
                  selectedEmail?.id === email.id ? 'bg-accent' : ''
                } ${!email.read ? 'font-semibold' : ''}`}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`/avatars/${email.id}.png`} alt={email.from} />
                      <AvatarFallback>{email.from[0]}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{email.from}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{email.timestamp}</span>
                </div>
                <div className="text-sm font-medium truncate">{email.subject}</div>
                <div className="text-sm text-muted-foreground truncate">{email.preview}</div>
                <div className="flex items-center gap-2 mt-2">
                  {email.hasAttachments && (
                    <Badge variant="secondary">
                      <Mail className="h-3 w-3 mr-1" />
                      Attachment
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </Tabs>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStarEmail(selectedEmail.id)}
                >
                  {selectedEmail.starred ? (
                    <Star className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <StarOff className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleArchiveEmail(selectedEmail.id)}
                >
                  <Archive className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteEmail(selectedEmail.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Flag className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/avatars/${selectedEmail.id}.png`} alt={selectedEmail.from} />
                <AvatarFallback>{selectedEmail.from[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{selectedEmail.from}</div>
                <div className="text-sm text-muted-foreground">{selectedEmail.email}</div>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {selectedEmail.timestamp}
              </div>
            </div>
            <div className="prose max-w-none">
              {selectedEmail.preview}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select an email to read
          </div>
        )}
      </div>
    </div>
  )
}


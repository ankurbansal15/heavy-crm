"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

// Placeholder data for chats
const initialChats = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Thanks for your help!",
    avatar: "/avatars/01.png",
    messages: [
      { id: 1, text: "Hello! How can I help you today?", sender: "agent" },
      { id: 2, text: "I have a question about my order", sender: "customer" },
      { id: 3, text: "Sure, I'd be happy to help. What's your order number?", sender: "agent" },
      { id: 4, text: "It's #12345", sender: "customer" },
      { id: 5, text: "Thank you. I've located your order. What's your question?", sender: "agent" },
      { id: 6, text: "When will it be delivered?", sender: "customer" },
      { id: 7, text: "Your order is scheduled for delivery tomorrow", sender: "agent" },
      { id: 8, text: "Thanks for your help!", sender: "customer" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Could you provide more details?",
    avatar: "/avatars/02.png",
    messages: [
      { id: 1, text: "Hi there! How may I assist you today?", sender: "agent" },
      { id: 2, text: "I'm interested in your premium plan", sender: "customer" },
      { id: 3, text: "That's great! I'd be happy to tell you more about our premium plan.", sender: "agent" },
      { id: 4, text: "Could you provide more details?", sender: "customer" },
    ],
  },
  // Add more chat entries as needed
]

export default function MessagesPage() {
  const [chats, setChats] = useState(initialChats)
  const { session } = useAuth()
  useEffect(() => {
    if (!session) return
    const load = async () => {
      const res = await fetch('/api/messages?channel=whatsapp', { headers: { Authorization: `Bearer ${session.access_token}` } })
      const data = await res.json()
      if (data.messages) {
        const groups: Record<string, any[]> = {}
        data.messages.forEach((m: any) => {
          const key = m.direction === 'inbound' ? m.from : m.to
            if (!groups[key]) groups[key] = []
          groups[key].push(m)
        })
        const chatList = Object.entries(groups).map(([k, msgs], idx) => ({
          id: idx + 1,
          name: k,
          lastMessage: (msgs as any)[0]?.body_text?.slice(0,60) || '',
          avatar: '/placeholder-user.jpg',
          messages: (msgs as any).map((m: any, midx: number) => ({ id: midx+1, text: m.body_text, sender: m.direction === 'inbound' ? 'customer' : 'agent' }))
        }))
        if (chatList.length) {
          setChats(chatList)
          setSelectedChat(chatList[0])
        }
      }
    }
    load()
  }, [session])
  const [selectedChat, setSelectedChat] = useState(chats[0])
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (newMessage.trim() === "") return

    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            { id: chat.messages.length + 1, text: newMessage, sender: "agent" },
          ],
          lastMessage: newMessage,
        }
      }
      return chat
    })

    setChats(updatedChats)
    setSelectedChat(updatedChats.find((chat) => chat.id === selectedChat.id)!)
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="flex flex-1 border rounded-lg overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/4 border-r">
          <ScrollArea className="h-full">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
                  selectedChat.id === chat.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{chat.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="hidden md:flex flex-1 flex-col">
          <ScrollArea className="flex-1 p-4">
            {selectedChat.messages.map((message) => (
              <Card
                key={message.id}
                className={`mb-4 max-w-[70%] ${
                  message.sender === "agent" 
                    ? "ml-auto bg-primary/10 dark:bg-primary/20" 
                    : "mr-auto bg-secondary/10 dark:bg-secondary/20"
                }`}
              >
                <CardContent className="p-3">
                  <p>{message.text}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="flex space-x-2"
            >
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


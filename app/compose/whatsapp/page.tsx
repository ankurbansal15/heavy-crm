"use client"

import { useState } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// This would typically come from an API or database
const templates = [
  { id: "1", name: "Welcome Message", content: "Welcome to our service! How can we help you today?" },
  { id: "2", name: "Order Confirmation", content: "Your order #{{order_id}} has been confirmed and is being processed." },
  { id: "3", name: "Appointment Reminder", content: "Reminder: You have an appointment scheduled for {{date}} at {{time}}." },
]

export default function ComposePage() {
  const [message, setMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setMessage(template.content)
    }
  }

  const { session } = useAuth()
  const handleSend = async () => {
    const res = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ channel: 'whatsapp', to: 'DEST_NUMBER', content: message })
    })
    const data = await res.json()
    console.log('Send result', data)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Compose Message</h1>
      <div className="space-y-6">
        <div>
          <Label htmlFor="template">Message Template</Label>
          <Select onValueChange={handleTemplateChange} value={selectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />
        </div>
        <div>
          <Label htmlFor="attachment">Attachment</Label>
          <Input id="attachment" type="file" />
        </div>
        <div>
          <Label htmlFor="schedule">Schedule</Label>
          <Input id="schedule" type="datetime-local" />
        </div>
        <Button onClick={handleSend}>Send Message</Button>
      </div>
    </div>
  )
}


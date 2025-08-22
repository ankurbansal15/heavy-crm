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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const templates = [
  { id: "1", name: "Welcome Email", subject: "Welcome to our service!", content: "Dear {{name}},\n\nWelcome to our service! We're excited to have you on board." },
  { id: "2", name: "Order Confirmation", subject: "Order #{{order_id}} Confirmed", content: "Dear {{name}},\n\nYour order #{{order_id}} has been confirmed." },
  { id: "3", name: "Meeting Request", subject: "Meeting Request: {{topic}}", content: "Hi {{name}},\n\nI would like to schedule a meeting to discuss {{topic}}." },
]

export default function ComposeEmailPage() {
  const [email, setEmail] = useState<{ to: string; subject: string; content: string; template: string; attachments: File[]; scheduledTime: string }>({
    to: "",
    subject: "",
    content: "",
    template: "",
    attachments: [],
    scheduledTime: "",
  })

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setEmail(prev => ({
        ...prev,
        subject: template.subject,
        content: template.content,
        template: templateId
      }))
    }
  }

  const { session } = useAuth()
  const handleSend = async () => {
    const res = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ channel: 'email', to: email.to, subject: email.subject, content: email.content, html: null, schedule_at: email.scheduledTime || null })
    })
    const data = await res.json()
    console.log('Send result', data)
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Compose Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose">
            <TabsList>
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="compose" className="space-y-6">
              <div>
                <Label htmlFor="template">Email Template</Label>
                <Select onValueChange={handleTemplateChange} value={email.template}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={email.to}
                  onChange={(e) => setEmail({ ...email, to: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={email.subject}
                  onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Type your email content here..."
                  value={email.content}
                  onChange={(e) => setEmail({ ...email, content: e.target.value })}
                  rows={12}
                />
              </div>
              <div>
                <Label htmlFor="attachments">Attachments</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={(e) => setEmail({ ...email, attachments: Array.from(e.target.files || []) })}
                />
              </div>
              <div>
                <Label htmlFor="schedule">Schedule Send</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={email.scheduledTime}
                  onChange={(e) => setEmail({ ...email, scheduledTime: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline">Save Draft</Button>
                <Button onClick={handleSend}>Send Email</Button>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold">To:</span> {email.to}
                    </div>
                    <div>
                      <span className="font-semibold">Subject:</span> {email.subject}
                    </div>
                    <div className="whitespace-pre-wrap border rounded-lg p-4 bg-background">
                      {email.content}
                    </div>
                    {email.attachments.length > 0 && (
                      <div>
                        <span className="font-semibold">Attachments:</span>
                        <ul className="list-disc list-inside">
                          {Array.from(email.attachments).map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"

const templates = [
  { id: "1", name: "Appointment Reminder", content: "Reminder: Your appointment is scheduled for {{time}} on {{date}}. Reply YES to confirm." },
  { id: "2", name: "Order Status", content: "Your order #{{order_id}} has been {{status}}. Track at: {{tracking_url}}" },
  { id: "3", name: "Payment Due", content: "Payment of {{amount}} is due for invoice #{{invoice_id}}. Pay now: {{payment_link}}" },
]

const MAX_SMS_LENGTH = 160

export default function ComposeSMSPage() {
  const [sms, setSMS] = useState({
    to: "",
    content: "",
    template: "",
    scheduledTime: "",
  })

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSMS(prev => ({
        ...prev,
        content: template.content,
        template: templateId
      }))
    }
  }

  const handleSend = () => {
    // Implement send logic here
    console.log("Sending SMS:", sms)
  }

  const messageCount = Math.ceil(sms.content.length / MAX_SMS_LENGTH)
  const charactersLeft = MAX_SMS_LENGTH - (sms.content.length % MAX_SMS_LENGTH)

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Compose SMS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="template">SMS Template</Label>
            <Select onValueChange={handleTemplateChange} value={sms.template}>
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
              type="tel"
              placeholder="+1234567890"
              value={sms.to}
              onChange={(e) => setSMS({ ...sms, to: e.target.value })}
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="content">Message</Label>
              <div className="space-x-2">
                <Badge variant="outline">
                  {charactersLeft} characters left
                </Badge>
                <Badge variant="outline">
                  {messageCount} message{messageCount !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
            <Textarea
              id="content"
              placeholder="Type your SMS message here..."
              value={sms.content}
              onChange={(e) => setSMS({ ...sms, content: e.target.value })}
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="schedule">Schedule Send</Label>
            <Input
              id="schedule"
              type="datetime-local"
              value={sms.scheduledTime}
              onChange={(e) => setSMS({ ...sms, scheduledTime: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleSend}>Send SMS</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


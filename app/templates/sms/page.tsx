"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"
import { supabase } from '@/lib/supabase'

interface SMSTemplate {
  id?: string
  name: string
  body_text: string
  category: string
  variables: string[]
  character_count: number
  message_segments: number
  user_id?: string
}

const MAX_SMS_LENGTH = 160

export default function SMSTemplatesPage() {
  const [templates, setTemplates] = useState<SMSTemplate[]>([])
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<SMSTemplate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTemplates()
    }
  }, [user])

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('type', 'sms')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching templates:', error)
      setError("Error fetching templates. Please try again.")
    } else {
      setTemplates(data || [])
      setError(null)
    }
  }

  const calculateMessageStats = (content: string) => {
    const length = content.length
    return {
      character_count: length,
      message_segments: Math.ceil(length / MAX_SMS_LENGTH)
    }
  }

  const handleSubmit = async (template: SMSTemplate) => {
    if (!user) return
    setError(null)

    const stats = calculateMessageStats(template.body_text)
    const { data, error } = await supabase
      .from('templates')
      .upsert({
        ...template,
        type: 'sms',
        user_id: user.id,
        variables: extractVariables(template.body_text),
        body_text: template.body_text,
        ...stats,
      })
      .select()

    if (error) {
      console.error('Error saving template:', error)
      setError("Error saving template. Please try again.")
    } else if (data) {
      setTemplates(prev => {
        const index = prev.findIndex(t => t.id === template.id)
        if (index >= 0) {
          return [...prev.slice(0, index), data[0], ...prev.slice(index + 1)]
        }
        return [data[0], ...prev]
      })
      setEditingTemplate(null)
      setError(null)
    }
  }

  const extractVariables = (text: string) => {
    const matches = text.match(/\{\{([^}]+)\}\}/g) || []
    return matches.map(match => match.replace(/\{\{|\}\}/g, ''))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">SMS Templates</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create SMS Template</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="Appointment Reminder"
                  value={editingTemplate?.name || ""}
                  onChange={(e) => setEditingTemplate(prev => ({ ...prev!, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Reminders"
                  value={editingTemplate?.category || ""}
                  onChange={(e) => setEditingTemplate(prev => ({ ...prev!, category: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content">Message Content</Label>
                  {editingTemplate && (
                    <div className="text-sm text-muted-foreground">
                      {calculateMessageStats(editingTemplate.body_text).character_count} characters |{' '}
                      {calculateMessageStats(editingTemplate.body_text).message_segments} message(s)
                    </div>
                  )}
                </div>
                <Textarea
                  id="content"
                  placeholder="Hi {{name}}, your appointment is scheduled for {{time}}. Reply Y to confirm."
                  value={editingTemplate?.body_text || ""}
                  onChange={(e) => setEditingTemplate(prev => ({ ...prev!, body_text: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleSubmit(editingTemplate!)}>
                Save Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Variables</TableHead>
            <TableHead>Length</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.category}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {template.variables.map((variable) => (
                    <Badge key={variable} variant="secondary">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {template.character_count} chars
                  <br />
                  {template.message_segments} segment(s)
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    Preview
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Message Content</Label>
              <div className="mt-1 whitespace-pre-wrap text-muted-foreground">
                {previewTemplate?.body_text}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {previewTemplate?.character_count} characters |{' '}
              {previewTemplate?.message_segments} message segment(s)
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/email-template/rich-text-editor"
import { supabase } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EmailTemplate {
  id?: string
  name: string
  subject: string
  content: string
  category: string
  variables: string[]
  user_id?: string
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTemplates()
    }
  }, [user])

  const fetchTemplates = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("type", "email")
      .order("created_at", { ascending: false })
    if (error) {
      console.error("Error fetching templates:", error)
      setError("Error fetching templates. Please try again.")
    } else {
      setTemplates(data || [])
      setError(null)
    }
    setIsLoading(false)
  }

  const handleSubmit = async (template: EmailTemplate) => {
    if (!user) return
    setError(null)

    const { data, error } = await supabase
      .from("templates")
      .upsert({
        ...template,
        type: "email",
        user_id: user.id,
        variables: extractVariables(template.content),
      })
      .select()

    if (error) {
      console.error("Error saving template:", error)
      setError("Error saving template. Please try again.")
    } else if (data) {
      setTemplates((prev) => {
        const index = prev.findIndex((t) => t.id === template.id)
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
    return matches.map((match) => match.replace(/\{\{|\}\}/g, ""))
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="Welcome Email"
                  value={editingTemplate?.name || ""}
                  onChange={(e) => setEditingTemplate((prev) => ({ ...prev!, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="Welcome to {{company_name}}!"
                  value={editingTemplate?.subject || ""}
                  onChange={(e) => setEditingTemplate((prev) => ({ ...prev!, subject: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingTemplate?.category || ""}
                  onValueChange={(value) => setEditingTemplate((prev) => ({ ...prev!, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Email Content</Label>
                <RichTextEditor
                  content={editingTemplate?.content || ""}
                  onChange={(content) => setEditingTemplate((prev) => ({ ...prev!, content }))}
                  placeholder="Compose your email content here..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleSubmit(editingTemplate!)}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Variables</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.subject}</TableCell>
              <TableCell className="capitalize">{template.category}</TableCell>
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingTemplate(template)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPreviewTemplate(template)}>
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
              <Label>Subject</Label>
              <p className="mt-1 text-muted-foreground">{previewTemplate?.subject}</p>
            </div>
            <div>
              <Label>Content</Label>
              <div
                className="mt-4 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: previewTemplate?.content || "" }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


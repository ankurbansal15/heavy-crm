"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { TemplateForm } from "@/components/template-form";
import { ShowTemplateModal } from "@/components/show-template-modal";
import { supabase } from '@/lib/supabase'

interface Template {
  id?: string;
  name: string;
  type: string;
  category: string;
  language: string;
  header_type: string;
  header_media: string | null;
  body_text: string;
  user_id?: string;
}

const initialTemplates: Template[] = [
  { id: '1', name: "Welcome Message", type: 'whatsapp', category: "Greeting", language: "English", header_type: "text", header_media: null, body_text: "Welcome to our service, {{1}}!", user_id: '1' },
  { id: '2', name: "Order Confirmation", type: 'whatsapp', category: "Transactional", language: "English", header_type: "text", header_media: null, body_text: "Your order #{{1}} has been confirmed and will be delivered on {{2}}.", user_id: '1' },
  { id: '3', name: "Appointment Reminder", type: 'whatsapp', category: "Reminder", language: "Spanish", header_type: "text", header_media: null, body_text: "Recordatorio: Tienes una cita programada para el {{1}} a las {{2}}.", user_id: '1' },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showingTemplate, setShowingTemplate] = useState<Template | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      .eq('type', 'whatsapp')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching templates:', error)
      setError("Error fetching templates. Please try again.")
    } else {
      setTemplates(data || [])
      setError(null)
    }
  }

  const addTemplate = async (newTemplate: Omit<Template, 'id' | 'user_id'>) => {
    if (!user) return
    setError(null)
    const { data, error } = await supabase
      .from('templates')
      .insert({
        ...newTemplate,
        type: 'whatsapp',
        user_id: user.id
      })
      .select()
    if (error) {
      console.error('Error adding template:', error)
      setError("Error adding template. Please try again.")
    } else if (data) {
      setTemplates([data[0], ...templates])
      setError(null)
    }
    setIsDialogOpen(false)
  };

  const editTemplate = async (updatedTemplate: Template) => {
    if (!user) return
    setError(null)
    const { error } = await supabase
      .from('templates')
      .update(updatedTemplate)
      .eq('id', updatedTemplate.id)
      .eq('user_id', user.id)
    if (error) {
      console.error('Error updating template:', error)
      setError("Error updating template. Please try again.")
    } else {
      setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t))
      setError(null)
    }
    setEditingTemplate(null)
  };

  const showTemplate = (template: Template) => {
    setShowingTemplate(template);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Templates</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
          <DialogTrigger asChild>
            <Button>Add New Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-2xl font-semibold">New WhatsApp Template</DialogTitle>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <TemplateForm onSubmit={addTemplate} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.type}</TableCell>
              <TableCell>{template.category}</TableCell>
              <TableCell>{template.language}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingTemplate(template)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-2xl font-semibold">Edit WhatsApp Template</DialogTitle>
                      </div>
                      {error && <p className="text-red-500 mt-2">{error}</p>}
                      <TemplateForm onSubmit={editTemplate} initialTemplate={editingTemplate} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => showTemplate(template)}>Show</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showingTemplate && (
        <ShowTemplateModal
          template={showingTemplate}
          onClose={() => setShowingTemplate(null)}
        />
      )}
    </div>
  );
}


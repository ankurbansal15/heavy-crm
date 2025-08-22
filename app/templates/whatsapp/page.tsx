"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { TemplateForm } from "@/components/template-form";
import { ShowTemplateModal } from "@/components/show-template-modal";
import { supabase } from '@/lib/supabase'
import { RefreshCcw, Loader2 } from 'lucide-react'

interface DbTemplate {
  id?: string;
  name: string;
  type: string;
  category: string;
  language: string;
  header_type: string | null;
  header_media: string | null;
  body_text: string;
  status?: string;
  user_id?: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<DbTemplate[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DbTemplate | null>(null);
  const [showingTemplate, setShowingTemplate] = useState<DbTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [search, setSearch] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchTemplates()
  }, [user])

  const fetchTemplates = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('type', 'whatsapp')
      .order('updated_at', { ascending: false })
    if (error) {
      console.error('Error fetching templates:', error)
      setError('Error fetching templates')
    } else {
      setTemplates(data as any || [])
      setError(null)
    }
    setLoading(false)
  }

  const handleSync = async () => {
    if (!user) return
    setSyncing(true)
    setError(null)
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/whatsapp/templates/sync', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Sync failed')
      else await fetchTemplates()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSyncing(false)
    }
  }

  const grouped = useMemo(() => {
    const g: Record<string, DbTemplate[]> = { approved: [], pending: [], draft: [], rejected: [] }
    templates.forEach(t => {
      const rawStatus = (t as any).status || 'draft'
      const normalized = rawStatus === 'failed' ? 'pending' : rawStatus
      if (g[normalized]) g[normalized].push(t); else g.pending.push(t)
    })
    const filter = (arr: DbTemplate[]) => arr.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category?.toLowerCase().includes(search.toLowerCase()))
    return {
      approved: filter(g.approved),
      draft: filter(g.draft),
      rejected: filter(g.rejected),
      pending: filter(g.pending)
    }
  }, [templates, search])

  const addTemplate = async (tpl: any) => {
    if (!user) return
    setError(null)
    const insertRow = {
      name: tpl.name,
      category: tpl.category,
      language: tpl.language,
      header_type: tpl.header_type,
      header_media: null,
      body_text: tpl.body_text,
      type: 'whatsapp',
      user_id: user.id
    }
    const { data, error } = await supabase.from('templates').insert(insertRow).select()
    if (error) { setError('Error adding template'); console.error(error) }
    else if (data) setTemplates([data[0], ...templates])
    setIsDialogOpen(false)
  }

  const editTemplate = async (tpl: any) => {
    if (!user || !editingTemplate) return
    setError(null)
    const updatedRow: DbTemplate = { ...editingTemplate, name: tpl.name, category: tpl.category, language: tpl.language, header_type: tpl.header_type, body_text: tpl.body_text }
    const { error } = await supabase.from('templates').update(updatedRow).eq('id', editingTemplate.id).eq('user_id', user.id)
    if (error) { setError('Error updating template'); console.error(error) }
    else {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? updatedRow : t))
      setEditingTemplate(null)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">WhatsApp Templates</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor template statuses. Refresh pulls from WhatsApp API.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Input placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} className="w-56" />
          <Button variant="outline" onClick={handleSync} disabled={syncing} className="flex items-center gap-2">
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>New Template</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <DialogTitle className="text-2xl font-semibold">New WhatsApp Template</DialogTitle>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <TemplateForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {loading && <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Loading templates...</div>}

      <Tabs defaultValue="approved" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-4">
          {['approved','draft','rejected','pending'].map(status => (
            <TabsTrigger key={status} value={status} className="capitalize">
              {status}
              <Badge variant="secondary" className="ml-2">{grouped[status as keyof typeof grouped].length}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        {(['approved','draft','rejected','pending'] as const).map(status => (
          <TabsContent key={status} value={status}>
            <TemplateTable
              rows={grouped[status]}
              onEdit={setEditingTemplate}
              onShow={setShowingTemplate}
              currentError={error}
              setEditingTemplate={setEditingTemplate}
            />
          </TabsContent>
        ))}
      </Tabs>

      {showingTemplate && (
        <ShowTemplateModal
          template={{
            id: (showingTemplate.id as any) || '',
            name: showingTemplate.name,
            category: showingTemplate.category,
            language: showingTemplate.language,
            headerType: showingTemplate.header_type || 'text',
            headerMedia: showingTemplate.header_media,
            bodyText: showingTemplate.body_text
          }}
          onClose={() => setShowingTemplate(null)}
        />
      )}

  {/* Editing existing templates not supported in new submission flow; could add separate modal here if needed. */}
    </div>
  )
}

function TemplateTable({ rows, onEdit, onShow, currentError }: { rows: DbTemplate[]; onEdit: (t: DbTemplate)=>void; onShow: (t: DbTemplate)=>void; currentError: string | null; setEditingTemplate?: any }) {
  if (!rows.length) return <div className="text-sm text-muted-foreground border rounded p-6">No templates in this status.</div>
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Language</TableHead>
          <TableHead>Preview</TableHead>
          <TableHead>Rejection Reason</TableHead>
          <TableHead className="w-40">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(t => (
          <TableRow key={t.id}>
            <TableCell>{t.name}</TableCell>
            <TableCell>{t.category}</TableCell>
            <TableCell>{t.language}</TableCell>
            <TableCell className="max-w-xs truncate">{t.body_text?.slice(0,80)}</TableCell>
            <TableCell className="max-w-xs text-xs text-red-600 truncate">{(t as any).rejection_reason || ''}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(t)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => onShow(t)}>Show</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


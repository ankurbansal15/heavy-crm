"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function TemplateForm() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("MARKETING")
  const [language, setLanguage] = useState("en_US")
  const [headerEnabled, setHeaderEnabled] = useState(false)
  const [headerText, setHeaderText] = useState("")
  const [body, setBody] = useState("Hello {{1}}, your order #{{2}} has been confirmed and will be delivered on {{3}}.")
  const [footer, setFooter] = useState("")
  const [sampleValues, setSampleValues] = useState<string[]>(["John","12345","Monday"])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [success, setSuccess] = useState<string|null>(null)

  const placeholders = Array.from(new Set([...body.matchAll(/\{\{(\d+)\}\}/g)].map(m => Number(m[1])))).sort((a,b)=>a-b)
  while (sampleValues.length < placeholders.length) sampleValues.push("")
  const previewBody = body.replace(/\{\{(\d+)\}\}/g,(m,n)=>{ const idx=Number(n)-1; return sampleValues[idx]||m })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true); setError(null); setSuccess(null)
    try {
      const { supabase } = await import('@/lib/supabase')
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/whatsapp/templates/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: name.trim(),
          category,
          language,
          header_type: headerEnabled ? 'text' : 'none',
          header_text: headerEnabled ? headerText : undefined,
          body_text: body,
          footer_text: footer || undefined,
          samples: placeholders.map((p,i)=> sampleValues[i] || `Sample ${p}`)
        })
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Creation failed')
      else setSuccess('Submitted for approval')
    } catch (e:any) {
      setError(e.message)
    } finally { setSubmitting(false) }
  }

  return (
  <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="grid gap-4">
            <div>
              <label htmlFor="templateName" className="text-sm font-medium mb-1 block">
                Template name
              </label>
        <Input id="templateName" placeholder="order_update" value={name} onChange={e=>setName(e.target.value)} />
        <p className="text-xs text-muted-foreground mt-1">Lowercase letters, digits, underscore. No spaces.</p>
            </div>

            {/* Category and Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="text-sm font-medium mb-1 block">
                  Select category
                </label>
        <Select value={category} onValueChange={v=>setCategory(v.toUpperCase())}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Alert/Update" />
                  </SelectTrigger>
                  <SelectContent>
          <SelectItem value="MARKETING">Marketing</SelectItem>
          <SelectItem value="UTILITY">Utility</SelectItem>
          <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="language" className="text-sm font-medium mb-1 block">
                  Select Language
                </label>
                <Select value={language} onValueChange={v=>setLanguage(v)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="English" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_US">English (US)</SelectItem>
                    <SelectItem value="en_GB">English (UK)</SelectItem>
                    <SelectItem value="es_ES">Spanish (ES)</SelectItem>
                    <SelectItem value="fr_FR">French (FR)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Format ll_CC e.g. en_US</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" checked={headerEnabled} onChange={e=>setHeaderEnabled(e.target.checked)} /> Header (text)
            </label>
            {headerEnabled && <Input placeholder="E.g. Order Update" value={headerText} onChange={e=>setHeaderText(e.target.value)} maxLength={60} />}
            <p className="text-xs text-muted-foreground">Optional short title (max 60 chars).</p>
          </div>

          <div>
            <label htmlFor="bodyText" className="text-sm font-medium mb-1 block">
              Body Text
            </label>
            <Textarea id="bodyText" value={body} onChange={e=>setBody(e.target.value)} rows={6} />
            <p className="text-xs text-muted-foreground mt-1">Use placeholders <code>{'{'}{'{'}1{'}'}{'}'}</code>, <code>{'{'}{'{'}2{'}'}{'}'}</code> etc. Provide sample values below for approval.</p>
          </div>
          {placeholders.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Placeholder Samples</p>
              <div className="grid gap-2" style={{gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))'}}>
                {placeholders.map((p,i)=>(
                  <Input key={p} placeholder={`{{${p}}} sample`} value={sampleValues[i]||''} onChange={e=>{ const next=[...sampleValues]; next[i]=e.target.value; setSampleValues(next) }} />
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1 block">Footer (optional)</label>
            <Input value={footer} onChange={e=>setFooter(e.target.value)} maxLength={60} placeholder="Customer Support: reply HELP" />
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:pl-6">
          <div className="sticky top-6">
            <h2 className="text-lg font-medium mb-4">Preview</h2>
            <div className="max-w-sm mx-auto">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <div className="bg-[#075E54] text-white p-4">
                  <div className="h-4 w-24 bg-white/20 rounded" />
                </div>
                <div className="bg-[#ECE5DD] p-4 min-h-[400px]">
                  <Card className="max-w-[85%] bg-white">
                    <CardContent className="p-4">
                      {headerEnabled && headerText && <p className="text-xs font-semibold mb-2">{headerText}</p>}
                      <p className="text-sm whitespace-pre-wrap">{previewBody}</p>
                      {footer && <p className="text-[11px] text-muted-foreground mt-3">{footer}</p>}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-4 mt-6 flex-wrap">
        <div className="text-xs flex-1 text-muted-foreground space-y-1">
          <p>Placeholders must be sequential starting at 1.</p>
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
        </div>
        <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Send for approval'}</Button>
      </div>
    </form>
  );
}


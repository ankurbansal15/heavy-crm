"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TriangleAlert, Info, CircleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Issue {
  code: string
  message: string
  severity: 'error' | 'warning' | 'info'
  action?: { label: string, route?: string, href?: string }
}

export function GlobalStatusBanner() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token
        if (!token) return
        const res = await fetch('/api/system/status', { headers: { Authorization: `Bearer ${token}` } })
        const json = await res.json()
        if (res.ok) setIssues(json.issues || [])
      } catch {}
    }
    load()
  }, [])

  const visible = issues.filter(i => !dismissed.has(i.code))
  if (!visible.length) return null

  const iconFor = (sev: string) => sev === 'error' ? <TriangleAlert className="h-4 w-4" /> : sev === 'warning' ? <CircleAlert className="h-4 w-4" /> : <Info className="h-4 w-4" />
  const variantClass = (sev: string) => sev === 'error' ? 'border-red-500/50 bg-red-50 dark:bg-red-950/30' : sev === 'warning' ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/30' : 'border-sky-500/50 bg-sky-50 dark:bg-sky-950/30'

  return (
    <div className="space-y-2 mb-4">
      {visible.map(issue => (
        <Alert key={issue.code} className={variantClass(issue.severity)}>
          <AlertTitle className="flex items-center gap-2">
            {iconFor(issue.severity)}
            {issue.severity.toUpperCase()}
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span>{issue.message}</span>
            <div className="flex gap-2 shrink-0">
              {issue.action?.route && (
                <Button variant="outline" size="sm" onClick={() => router.push(issue.action!.route!)}>{issue.action.label}</Button>
              )}
              {issue.action?.href && (
                <Button variant="outline" size="sm" asChild>
                  <a href={issue.action.href} target="_blank" rel="noreferrer">{issue.action.label}</a>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setDismissed(new Set([...dismissed, issue.code]))}>Dismiss</Button>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

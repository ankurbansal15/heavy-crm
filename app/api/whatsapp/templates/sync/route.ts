import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserIdFromAuthHeader } from '@/lib/messaging'
import { createServerSupabaseClient } from '@/lib/supabase-server'

function mapStatus(remoteStatus: string): string {
  const s = remoteStatus?.toUpperCase() || ''
  if (s === 'APPROVED') return 'approved'
  if (s === 'REJECTED') return 'rejected'
  if (s === 'PENDING' || s === 'IN_APPEAL') return 'draft'
  if (['PAUSED','DISABLED'].includes(s)) return 'failed'
  return s.toLowerCase() || 'draft'
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const user_id = await getUserIdFromAuthHeader(request)
  if (!user_id || !accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const serverClient = createServerSupabaseClient(accessToken)
  // Load WhatsApp API config with user RLS context
  const { data: waCfg, error: waErr } = await serverClient.from('api_config').select('*').eq('service_name', 'whatsapp').maybeSingle()
  if (waErr || !waCfg) return NextResponse.json({ error: 'WhatsApp configuration not found' }, { status: 400 })
  const token = waCfg.api_key
  const wabaId = waCfg.config_data?.waba_id
  if (!token) return NextResponse.json({ error: 'Missing WhatsApp API token' }, { status: 400 })
  if (!wabaId) return NextResponse.json({ error: 'Missing waba_id in WhatsApp config (config_data.waba_id)' }, { status: 400 })
  try {
    const url = `https://graph.facebook.com/v19.0/${wabaId}/message_templates?limit=250&fields=name,status,category,language,components`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: 'WhatsApp API error', detail: txt }, { status: 502 })
    }
    const json: any = await res.json()
    const rows = (json.data || []).map((t: any) => {
      const bodyComp = (t.components || []).find((c: any) => c.type === 'BODY')
      const buttonComps = (t.components || []).filter((c: any) => c.type === 'BUTTONS')
      const rejectionReason = (t?.rejection_reasons || t?.rejected_reason || t?.rejection_reason)?.toString() || null
      return {
        user_id,
        type: 'whatsapp',
        provider_template_id: t.id || `${t.name}:${t.language}`,
        name: t.name,
        category: t.category,
        language: t.language,
        body_text: bodyComp?.text || '',
        status: mapStatus(t.status),
        review_status: t.status,
        rejection_reason: rejectionReason,
        buttons: buttonComps.length ? buttonComps : null,
        raw: t,
        updated_at: new Date().toISOString()
      }
    })
    // Upsert in batches to avoid payload limits
    const chunkSize = 50
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize)
      // Use server client with user context so RLS passes
      let { error } = await serverClient.from('templates').upsert(chunk, { onConflict: 'user_id,provider_template_id' })
      if (error && /buttons|rejection_reason/i.test(error.message)) {
        // Retry without new columns if migration not applied yet
  const downgraded = chunk.map((r: any) => {
          const { buttons, rejection_reason, ...rest } = r as any
          return rest
        })
        const retry = await serverClient.from('templates').upsert(downgraded, { onConflict: 'user_id,provider_template_id' })
        if (retry.error) return NextResponse.json({ error: retry.error.message, partial: true, downgraded: true }, { status: 500 })
      } else if (error) {
        return NextResponse.json({ error: error.message, partial: true }, { status: 500 })
      }
    }
    return NextResponse.json({ synced: rows.length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

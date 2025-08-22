import { NextResponse } from 'next/server'
import { getUserIdFromAuthHeader } from '@/lib/messaging'
import { createServerSupabaseClient } from '@/lib/supabase-server'

interface CreateTemplatePayload {
  name: string
  category: string
  language: string
  header_type?: 'none' | 'text'
  header_text?: string
  body_text: string
  footer_text?: string
  samples?: string[]
}

function validateName(name: string) {
  return /^[a-z0-9_]{3,512}$/.test(name)
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const user_id = await getUserIdFromAuthHeader(request)
  if (!user_id || !token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const client = createServerSupabaseClient(token)

  // Load WA config
  const { data: waCfg, error: waErr } = await client.from('api_config').select('*').eq('service_name', 'whatsapp').maybeSingle()
  if (waErr || !waCfg) return NextResponse.json({ error: 'WhatsApp config missing' }, { status: 400 })
  if (!waCfg.api_key) return NextResponse.json({ error: 'WhatsApp token missing' }, { status: 400 })
  if (!waCfg.config_data?.waba_id) return NextResponse.json({ error: 'waba_id missing' }, { status: 400 })

  let payload: CreateTemplatePayload
  try { payload = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { name, category, language, header_type = 'none', header_text, body_text, footer_text, samples = [] } = payload

  if (!validateName(name)) return NextResponse.json({ error: 'Invalid name (lowercase, digits, underscore, >=3 chars)' }, { status: 400 })
  const allowedCategories = ['MARKETING','UTILITY','AUTHENTICATION']
  if (!allowedCategories.includes(category)) return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  if (!/^[a-z]{2}_[A-Z]{2}$/.test(language)) return NextResponse.json({ error: 'Language must be like en_US' }, { status: 400 })
  if (!body_text || body_text.length < 5) return NextResponse.json({ error: 'Body text too short' }, { status: 400 })

  // Extract placeholder indices
  const placeholderMatches = [...body_text.matchAll(/\{\{(\d+)\}\}/g)]
  const indices = Array.from(new Set(placeholderMatches.map(m => Number(m[1])))).sort((a,b)=>a-b)
  if (samples.length && samples.length < indices.length) {
    return NextResponse.json({ error: 'Not enough sample values for placeholders', needed: indices.length }, { status: 400 })
  }

  const bodyComponent: any = { type: 'BODY', text: body_text }
  if (indices.length) {
    const orderedSamples = indices.map((idx,i) => samples[i] || `Sample ${idx}`)
    bodyComponent.example = { body_text: [ orderedSamples ] }
  }

  const components: any[] = [bodyComponent]
  if (header_type === 'text' && header_text) {
    components.unshift({ type: 'HEADER', format: 'TEXT', text: header_text })
  }
  if (footer_text) components.push({ type: 'FOOTER', text: footer_text })

  const graphPayload = { name, category, language, components }

  try {
    const graphRes = await fetch(`https://graph.facebook.com/v19.0/${waCfg.config_data.waba_id}/message_templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${waCfg.api_key}` },
      body: JSON.stringify(graphPayload)
    })
    const detail = await graphRes.text()
    if (!graphRes.ok) return NextResponse.json({ error: 'WhatsApp API error', detail }, { status: 502 })

    // Optionally store provisional record (status pending); sync will update.
    const provider_template_id = name + ':' + language
    const insertRow = {
      user_id,
      type: 'whatsapp',
      provider_template_id,
      name,
      category: category.toLowerCase(),
      language,
      body_text,
      status: 'draft',
      review_status: 'PENDING',
      raw: graphPayload,
      updated_at: new Date().toISOString()
    }
    // Best-effort insert; ignore if schema missing columns
    await client.from('templates').upsert(insertRow as any, { onConflict: 'user_id,provider_template_id' })

    return NextResponse.json({ created: true, provider_template_id, detail: JSON.parse(detail) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

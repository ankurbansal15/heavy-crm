import { NextResponse } from 'next/server'
import { persistMessage } from '@/lib/messaging'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const entry = (body as any).entry?.[0]?.changes?.[0]?.value
  const messages = entry?.messages
  if (!messages) return NextResponse.json({ ok: true })
  for (const m of messages) {
    const waId = entry?.metadata?.phone_number_id
    const { data } = await supabase.from('api_config').select('user_id, config_data').eq('service_name', 'whatsapp')
    const match = data?.find(r => (r as any).config_data?.phone_number_id === waId)
    if (!match) continue
    await persistMessage((match as any).user_id, {
      channel: 'whatsapp',
      direction: 'inbound',
      from: (m as any).from,
      to: waId,
      body_text: (m as any).text?.body,
      status: 'received'
    })
  }
  return NextResponse.json({ ok: true })
}

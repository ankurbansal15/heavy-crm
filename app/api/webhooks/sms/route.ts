import { NextResponse } from 'next/server'
import { persistMessage } from '@/lib/messaging'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const body = await request.json().catch(async () => { const txt = await request.text(); return Object.fromEntries(new URLSearchParams(txt as any)) })
  const from = (body as any).from || (body as any).From || (body as any).source || (body as any).msisdn
  const to = (body as any).to || (body as any).To || (body as any).destination
  const text = (body as any).text || (body as any).Body || (body as any).message
  if (!from || !to || !text) return NextResponse.json({ ignored: true })
  const { data } = await supabase.from('api_config').select('user_id, service_name, config_data').eq('service_name', 'company_phone')
  const match = data?.find(r => (r as any).config_data?.number === to)
  if (!match) return NextResponse.json({ ok: true })
  await persistMessage((match as any).user_id, { channel: 'sms', direction: 'inbound', from, to, body_text: text, status: 'received' })
  return NextResponse.json({ ok: true })
}

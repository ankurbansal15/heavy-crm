import { NextResponse } from 'next/server'
import { getUserIdFromAuthHeader, persistMessage, sendEmail, sendSMS, sendWhatsApp } from '@/lib/messaging'

export async function POST(request: Request) {
  const user_id = await getUserIdFromAuthHeader(request)
  if (!user_id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const { channel, to, subject, content, html, schedule_at } = body || {}
  if (!channel || !to) return NextResponse.json({ error: 'channel & to required' }, { status: 400 })
  const base: any = { channel, direction: 'outbound', to, subject: subject || null, body_text: content, body_html: html, status: 'pending', scheduled_at: schedule_at || null }
  try {
    if (schedule_at && new Date(schedule_at) > new Date()) {
      base.status = 'queued'
      const rec = await persistMessage(user_id, base)
      return NextResponse.json({ message: rec, queued: true })
    }
    let result
    if (channel === 'email') result = await sendEmail(user_id, base)
    else if (channel === 'sms') result = await sendSMS(user_id, base)
    else if (channel === 'whatsapp') result = await sendWhatsApp(user_id, base)
    else return NextResponse.json({ error: 'Unsupported channel' }, { status: 400 })
    base.status = result.status
    base.error = result.error || null
    base.provider_message_id = result.provider_message_id || null
    if (result.status === 'sent') base.sent_at = new Date().toISOString()
    const rec = await persistMessage(user_id, base)
    return NextResponse.json({ message: rec })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

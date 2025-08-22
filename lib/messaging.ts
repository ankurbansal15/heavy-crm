import { supabase } from '@/lib/supabase'
import type { MessageInsert } from '@/types/messages'

let ResendPkg: any | null = null
let nodemailer: any | null = null

export async function getUserIdFromAuthHeader(request: Request): Promise<string | null> {
  const auth = request.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null
  const { data } = await supabase.auth.getUser(token)
  return data.user?.id || null
}

export async function fetchServiceConfig(user_id: string, service: string) {
  const { data } = await supabase
    .from('api_config')
    .select('*')
    .eq('user_id', user_id)
    .eq('service_name', service)
    .maybeSingle()
  return data
}

export async function sendEmail(user_id: string, msg: MessageInsert) {
  const resend = await fetchServiceConfig(user_id, 'resend_email')
  if (resend?.api_key) {
    if (!ResendPkg) {
      try { ResendPkg = (await import('resend')).Resend } catch {}
    }
    if (ResendPkg) {
      const client = new ResendPkg(resend.api_key)
      try {
        const result = await client.emails.send({
          from: (msg as any).from || 'no-reply@example.com',
          to: (msg as any).to!,
          subject: (msg as any).subject || '(no subject)',
          text: (msg as any).body_text || (msg as any).body_html || '',
          html: (msg as any).body_html,
        })
        return { provider_message_id: result?.id, status: 'sent' }
      } catch (e: any) {
        return { status: 'failed', error: e.message }
      }
    }
  }
  const smtp = await fetchServiceConfig(user_id, 'smtp')
  if (smtp?.config_data?.host) {
    if (!nodemailer) {
      try { nodemailer = await import('nodemailer') } catch {}
    }
    if (nodemailer) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtp.config_data.host,
          port: Number(smtp.config_data.port) || 587,
          secure: false,
          auth: smtp.config_data.username ? { user: smtp.config_data.username, pass: smtp.config_data.password } : undefined,
        })
        const info = await transporter.sendMail({
          from: (msg as any).from || smtp.config_data.username,
          to: (msg as any).to,
          subject: (msg as any).subject,
          text: (msg as any).body_text || (msg as any).body_html,
          html: (msg as any).body_html,
        })
        return { provider_message_id: info.messageId, status: 'sent' }
      } catch (e: any) {
        return { status: 'failed', error: e.message }
      }
    }
  }
  return { status: 'failed', error: 'No email provider configured' }
}

export async function sendSMS(user_id: string, msg: MessageInsert) {
  const fast2sms = await fetchServiceConfig(user_id, 'fast2sms')
  if (!fast2sms?.api_key) return { status: 'failed', error: 'Fast2SMS not configured' }
  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: fast2sms.api_key },
      body: JSON.stringify({ route: 'q', message: (msg as any).body_text, numbers: (msg as any).to })
    })
    if (!res.ok) return { status: 'failed', error: await res.text() }
    const data = await res.json()
    return { status: 'sent', provider_message_id: data?.request_id }
  } catch (e: any) {
    return { status: 'failed', error: e.message }
  }
}

export async function sendWhatsApp(user_id: string, msg: MessageInsert) {
  const wa = await fetchServiceConfig(user_id, 'whatsapp')
  const token = wa?.api_key
  const phoneNumberId = wa?.config_data?.phone_number_id
  if (!token || !phoneNumberId) return { status: 'failed', error: 'WhatsApp not configured' }
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ messaging_product: 'whatsapp', to: (msg as any).to, type: 'text', text: { body: (msg as any).body_text } })
    })
    if (!res.ok) return { status: 'failed', error: await res.text() }
    const data = await res.json()
    return { status: 'sent', provider_message_id: data?.messages?.[0]?.id }
  } catch (e: any) {
    return { status: 'failed', error: e.message }
  }
}

export async function persistMessage(user_id: string, partial: any) {
  const record = { ...partial, user_id, created_at: new Date().toISOString() }
  const { data, error } = await supabase.from('messages').insert(record).select('*').single()
  if (error) throw error
  return data
}

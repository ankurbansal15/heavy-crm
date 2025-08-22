import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserIdFromAuthHeader } from '@/lib/messaging'
import { createServerSupabaseClient } from '@/lib/supabase-server'

interface Issue {
  code: string
  message: string
  severity: 'error' | 'warning' | 'info'
  action?: { label: string, href?: string, route?: string }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const user_id = await getUserIdFromAuthHeader(request)
  if (!user_id || !token) return NextResponse.json({ issues: [{ code: 'unauthorized', message: 'Not authenticated', severity: 'error' }] }, { status: 401 })
  const client = createServerSupabaseClient(token)

  const issues: Issue[] = []

  const { data: configs, error } = await client.from('api_config').select('*').eq('user_id', user_id)
  if (error) {
    issues.push({ code: 'api_config_load_failed', message: 'Failed to load API configuration records', severity: 'error' })
    return NextResponse.json({ issues })
  }

  const getCfg = (service: string) => (configs as any)?.find((c: any) => c.service_name === service)

  const resend = getCfg('resend_email')
  const smtp = getCfg('smtp')
  if (!resend?.api_key && !(smtp?.config_data?.host && smtp?.config_data?.username)) {
    issues.push({ code: 'email_not_configured', message: 'No email provider configured (Resend or SMTP)', severity: 'warning', action: { label: 'Configure', route: '/account' } })
  }

  const sms = getCfg('fast2sms')
  if (!sms?.api_key) {
    issues.push({ code: 'sms_not_configured', message: 'SMS provider Fast2SMS not configured', severity: 'warning', action: { label: 'Configure', route: '/account' } })
  }

  const wa = getCfg('whatsapp')
  if (!wa?.api_key) {
    issues.push({ code: 'whatsapp_token_missing', message: 'WhatsApp API token not set', severity: 'error', action: { label: 'Configure', route: '/account' } })
  } else {
    const waba = (wa as any).config_data?.waba_id
    const phoneId = (wa as any).config_data?.phone_number_id
    if (!phoneId) {
      issues.push({ code: 'whatsapp_phone_id_missing', message: 'WhatsApp phone_number_id missing (cannot send messages)', severity: 'error', action: { label: 'Fix Config', route: '/account' } })
    }
    if (phoneId && !waba) {
      issues.push({ code: 'whatsapp_waba_id_missing', message: 'WhatsApp WABA ID missing (template sync unavailable)', severity: 'warning', action: { label: 'Add WABA ID', route: '/account' } })
    }
  }

  const companyPhone = getCfg('company_phone')
  if (!companyPhone?.config_data?.number) {
    issues.push({ code: 'company_phone_missing', message: 'Company phone number not set (inbound SMS may not route)', severity: 'info', action: { label: 'Add Number', route: '/account' } })
  }

  const { count } = await client.from('templates').select('*', { count: 'exact', head: true }).eq('type', 'whatsapp').eq('user_id', user_id) as any
  if (!count && wa?.api_key) {
    issues.push({ code: 'whatsapp_templates_empty', message: 'No WhatsApp templates synced yet', severity: 'info', action: { label: 'Sync Now', route: '/templates/whatsapp' } })
  }

  return NextResponse.json({ issues })
}

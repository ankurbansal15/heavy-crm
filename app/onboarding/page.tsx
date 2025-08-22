"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

type FormState = {
  resendEmailApiKey: string
  fast2smsApiKey: string
  whatsappApiKey: string
  whatsappPhoneNumberId: string
  smtpHost: string
  smtpPort: string
  smtpUsername: string
  smtpPassword: string
  companyPhoneNumber: string
}

const defaultState: FormState = {
  resendEmailApiKey: '',
  fast2smsApiKey: '',
  whatsappApiKey: '',
  whatsappPhoneNumberId: '',
  smtpHost: '',
  smtpPort: '',
  smtpUsername: '',
  smtpPassword: '',
  companyPhoneNumber: '',
}

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState<FormState>(defaultState)
  const [loading, setLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasAnyConfig, setHasAnyConfig] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchConfigs = async () => {
      const { data } = await supabase.from('api_config').select('*').eq('user_id', user.id)
      if (data && data.length) setHasAnyConfig(true)
    }
    fetchConfigs()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const buildRows = () => {
    if (!user) return []
    const rows: any[] = []
    if (form.resendEmailApiKey) {
      rows.push({ user_id: user.id, service_name: 'resend_email', api_key: form.resendEmailApiKey, is_active: true })
    }
    if (form.fast2smsApiKey) {
      rows.push({ user_id: user.id, service_name: 'fast2sms', api_key: form.fast2smsApiKey, is_active: true })
    }
    if (form.whatsappApiKey || form.whatsappPhoneNumberId) {
      rows.push({ user_id: user.id, service_name: 'whatsapp', api_key: form.whatsappApiKey, config_data: { phone_number_id: form.whatsappPhoneNumberId }, is_active: !!form.whatsappApiKey })
    }
    if (form.smtpHost || form.smtpUsername || form.smtpPassword) {
      rows.push({ user_id: user.id, service_name: 'smtp', api_key: form.smtpUsername, api_secret: form.smtpPassword, config_data: { host: form.smtpHost, port: form.smtpPort, username: form.smtpUsername, password: form.smtpPassword }, is_active: !!(form.smtpHost && form.smtpUsername && form.smtpPassword) })
    }
    if (form.companyPhoneNumber) {
      rows.push({ user_id: user.id, service_name: 'company_phone', config_data: { number: form.companyPhoneNumber }, is_active: true })
    }
    return rows
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const rows = buildRows()
    if (!rows.length) {
      router.replace('/dashboard')
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await supabase.from('api_config').upsert(rows)
    if (error) {
      console.error(error)
      setError('Failed to save configuration')
    } else {
      router.replace('/dashboard')
    }
    setLoading(false)
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Please sign in...</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Welcome! Let's configure your communication APIs</h1>
      <p className="text-muted-foreground mb-6">You can update these anytime later in Account &gt; API Settings. Provide what you have now or skip.</p>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Email (Resend)</CardTitle>
            <CardDescription>Resend Email API key for sending transactional emails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="resendEmailApiKey">Resend API Key</Label>
            <Input id="resendEmailApiKey" name="resendEmailApiKey" type={showSecrets ? 'text' : 'password'} value={form.resendEmailApiKey} onChange={handleChange} placeholder="re_..." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SMS (Fast2SMS)</CardTitle>
            <CardDescription>Configure SMS sending via Fast2SMS.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="fast2smsApiKey">Fast2SMS API Key</Label>
            <Input id="fast2smsApiKey" name="fast2smsApiKey" type={showSecrets ? 'text' : 'password'} value={form.fast2smsApiKey} onChange={handleChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Cloud API</CardTitle>
            <CardDescription>Configure your Meta WhatsApp credentials.</CardDescription>
          </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappApiKey">WhatsApp API Token</Label>
                <Input id="whatsappApiKey" name="whatsappApiKey" type={showSecrets ? 'text' : 'password'} value={form.whatsappApiKey} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappPhoneNumberId">Phone Number ID</Label>
                <Input id="whatsappPhoneNumberId" name="whatsappPhoneNumberId" value={form.whatsappPhoneNumberId} onChange={handleChange} />
              </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SMTP (Optional)</CardTitle>
            <CardDescription>Provide SMTP details if you prefer classic email relay.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="smtpHost">Host</Label><Input id="smtpHost" name="smtpHost" value={form.smtpHost} onChange={handleChange} placeholder="smtp.example.com" /></div>
            <div className="space-y-2"><Label htmlFor="smtpPort">Port</Label><Input id="smtpPort" name="smtpPort" value={form.smtpPort} onChange={handleChange} placeholder="587" /></div>
            <div className="space-y-2"><Label htmlFor="smtpUsername">Username</Label><Input id="smtpUsername" name="smtpUsername" value={form.smtpUsername} onChange={handleChange} /></div>
            <div className="space-y-2"><Label htmlFor="smtpPassword">Password</Label><Input id="smtpPassword" name="smtpPassword" type={showSecrets ? 'text' : 'password'} value={form.smtpPassword} onChange={handleChange} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Phone Number</CardTitle>
            <CardDescription>Number used for inbound SMS capture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="companyPhoneNumber">Phone Number</Label>
            <Input id="companyPhoneNumber" name="companyPhoneNumber" value={form.companyPhoneNumber} onChange={handleChange} placeholder="+1..." />
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save & Continue'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.replace('/dashboard')}>Skip for now</Button>
          <Button type="button" variant="ghost" onClick={() => setShowSecrets(s => !s)} className="ml-auto flex gap-2">
            {showSecrets ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            {showSecrets ? 'Hide Keys' : 'Show Keys'}
          </Button>
        </div>
        {!hasAnyConfig && <p className="text-xs text-muted-foreground">You can proceed without adding keys; features will be limited until configured.</p>}
        <Separator />
        <p className="text-xs text-muted-foreground">Data is stored in your Supabase project. For production, consider encrypting secrets at rest.</p>
      </form>
    </div>
  )
}

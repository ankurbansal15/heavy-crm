"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeIcon, EyeOffIcon, Save as SaveIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type ApiConfigMap = {
  resend_email: { api_key: string } | null
  fast2sms: { api_key: string } | null
  whatsapp: { api_key: string, phone_number_id?: string, waba_id?: string } | null
  smtp: { host: string, port: string, username: string, password: string } | null
  company_phone: { number: string } | null
}

export default function AccountPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    password: "",
  })
  const [apiConfigs, setApiConfigs] = useState<ApiConfigMap>({
    resend_email: null,
    fast2sms: null,
    whatsapp: null,
    smtp: null,
    company_phone: null,
  })
  const [showSecrets, setShowSecrets] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      setPersonalInfo({ email: user.email || "", password: "" })
      fetchApiConfigs()
    }
  }, [user])

  const fetchApiConfigs = async () => {
    if (!user) return
    const { data, error } = await supabase.from('api_config').select('*').eq('user_id', user.id)
    if (error) {
      console.error('Error fetching API configs', error)
      return
    }
    if (dirty) return // don't clobber unsaved user edits
    const map: ApiConfigMap = { resend_email: null, fast2sms: null, whatsapp: null, smtp: null, company_phone: null }
    data?.forEach((row: any) => {
      if (row.service_name === 'resend_email') map.resend_email = { api_key: row.api_key || '' }
      if (row.service_name === 'fast2sms') map.fast2sms = { api_key: row.api_key || '' }
      if (row.service_name === 'whatsapp') map.whatsapp = { api_key: row.api_key || '', phone_number_id: row.config_data?.phone_number_id, waba_id: row.config_data?.waba_id }
      if (row.service_name === 'smtp') map.smtp = { host: row.config_data?.host || '', port: row.config_data?.port || '', username: row.config_data?.username || '', password: row.config_data?.password || '' }
      if (row.service_name === 'company_phone') map.company_phone = { number: row.config_data?.number || '' }
    })
    setApiConfigs(map)
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
  }

  const updateApiConfig = (service: keyof ApiConfigMap, field: string, value: string) => {
    setApiConfigs(prev => ({
      ...prev,
      [service]: { ...(prev[service] || {} as any), [field]: value }
    }))
  setDirty(true)
  }

  const handleSubmitPersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { error } = await supabase.auth.updateUser({
      email: personalInfo.email,
      password: personalInfo.password,
    })

    if (error) {
      console.error('Error updating personal info:', error)
      setError("Error updating personal information. Please try again.")
    } else {
      setError(null)
      alert("Personal information updated successfully!")
    }
  }

  const handleSaveApiConfigs = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const rows: any[] = []
    if (apiConfigs.resend_email?.api_key) rows.push({ user_id: user.id, service_name: 'resend_email', api_key: apiConfigs.resend_email.api_key, is_active: true })
    if (apiConfigs.fast2sms?.api_key) rows.push({ user_id: user.id, service_name: 'fast2sms', api_key: apiConfigs.fast2sms.api_key, is_active: true })
    if (apiConfigs.whatsapp && (apiConfigs.whatsapp.api_key || apiConfigs.whatsapp.phone_number_id || apiConfigs.whatsapp.waba_id)) {
      rows.push({
        user_id: user.id,
        service_name: 'whatsapp',
        api_key: apiConfigs.whatsapp.api_key,
        config_data: {
          phone_number_id: apiConfigs.whatsapp.phone_number_id,
          waba_id: apiConfigs.whatsapp.waba_id,
        },
        is_active: !!apiConfigs.whatsapp.api_key && !!apiConfigs.whatsapp.phone_number_id
      })
    }
    if (apiConfigs.smtp && (apiConfigs.smtp.host || apiConfigs.smtp.username || apiConfigs.smtp.password)) rows.push({ user_id: user.id, service_name: 'smtp', api_key: apiConfigs.smtp.username, api_secret: apiConfigs.smtp.password, config_data: { ...apiConfigs.smtp }, is_active: !!(apiConfigs.smtp.host && apiConfigs.smtp.username && apiConfigs.smtp.password) })
    if (apiConfigs.company_phone?.number) rows.push({ user_id: user.id, service_name: 'company_phone', config_data: { number: apiConfigs.company_phone.number }, is_active: true })
    if (!rows.length) {
      alert('Nothing to save')
      return
    }
    // Ensure undefined values removed from config_data objects
    rows.forEach(r => { if (r.config_data) { Object.keys(r.config_data).forEach(k => { if (r.config_data[k] === undefined) delete r.config_data[k] }) } })
    const { error } = await supabase.from('api_config').upsert(rows, { onConflict: 'user_id,service_name' })
    if (error) {
      console.error('API config upsert error', error)
      setError(`Failed to save API settings: ${error.message}`)
    } else {
      setError(null)
      alert('API settings saved')
      setDirty(false)
      fetchApiConfigs()
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
        </TabsList>
  <TabsContent value="personal" forceMount>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPersonalInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={personalInfo.password}
                    onChange={handlePersonalInfoChange}
                    placeholder="Enter new password"
                  />
                </div>
                <Button type="submit">Update Personal Information</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
    <TabsContent value="api" forceMount>
          <form onSubmit={handleSaveApiConfigs} className="space-y-6">
            {error && <p className="text-sm text-red-500">{error}</p>}
      {dirty && <p className="text-xs text-amber-600">You have unsaved changes.</p>}
            <Card>
              <CardHeader>
                <CardTitle>Email (Resend)</CardTitle>
                <CardDescription>Resend API key for sending emails.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="resend_email_key">Resend API Key</Label>
                <div className="flex gap-2">
                  <Input id="resend_email_key" type={showSecrets ? 'text' : 'password'} value={apiConfigs.resend_email?.api_key || ''} onChange={e => updateApiConfig('resend_email', 'api_key', e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS (Fast2SMS)</CardTitle>
                <CardDescription>Fast2SMS API configuration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="fast2sms_key">Fast2SMS API Key</Label>
                <Input id="fast2sms_key" type={showSecrets ? 'text' : 'password'} value={apiConfigs.fast2sms?.api_key || ''} onChange={e => updateApiConfig('fast2sms', 'api_key', e.target.value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Cloud API</CardTitle>
                <CardDescription>Meta WhatsApp token, phone number ID & WABA ID (for template sync).</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>API Token</Label>
                  <Input type={showSecrets ? 'text' : 'password'} value={apiConfigs.whatsapp?.api_key || ''} onChange={e => updateApiConfig('whatsapp', 'api_key', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number ID</Label>
                  <Input value={apiConfigs.whatsapp?.phone_number_id || ''} onChange={e => updateApiConfig('whatsapp', 'phone_number_id', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>WABA ID</Label>
                  <Input value={apiConfigs.whatsapp?.waba_id || ''} onChange={e => updateApiConfig('whatsapp', 'waba_id', e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMTP</CardTitle>
                <CardDescription>Classic email relay settings (optional).</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Host</Label><Input value={apiConfigs.smtp?.host || ''} onChange={e => updateApiConfig('smtp', 'host', e.target.value)} /></div>
                <div className="space-y-2"><Label>Port</Label><Input value={apiConfigs.smtp?.port || ''} onChange={e => updateApiConfig('smtp', 'port', e.target.value)} /></div>
                <div className="space-y-2"><Label>Username</Label><Input value={apiConfigs.smtp?.username || ''} onChange={e => updateApiConfig('smtp', 'username', e.target.value)} /></div>
                <div className="space-y-2"><Label>Password</Label><Input type={showSecrets ? 'text' : 'password'} value={apiConfigs.smtp?.password || ''} onChange={e => updateApiConfig('smtp', 'password', e.target.value)} /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Phone</CardTitle>
                <CardDescription>Number used for inbound SMS capture.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={apiConfigs.company_phone?.number || ''} onChange={e => updateApiConfig('company_phone', 'number', e.target.value)} placeholder="+1..." />
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <Button type="submit" className="flex gap-2"><SaveIcon className="h-4 w-4" /> Save All</Button>
              <Button type="button" variant="outline" onClick={() => setShowSecrets(s => !s)}>{showSecrets ? 'Hide Keys' : 'Show Keys'}</Button>
            </div>
            <p className="text-xs text-muted-foreground">Secrets are stored in plain text in Supabase for now. For production add encryption/edge functions.</p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}


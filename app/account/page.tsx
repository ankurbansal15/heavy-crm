"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ApiInfo {
  api_key: string;
  phone_number_id: string;
}

export default function AccountPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    password: "",
  })
  const [apiInfo, setApiInfo] = useState<ApiInfo>({
    api_key: "",
    phone_number_id: "",
  })
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      setPersonalInfo({ email: user.email || "", password: "" })
      fetchApiInfo()
    }
  }, [user])

  const fetchApiInfo = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('api_config')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, this is fine for new users
        console.log('No API configuration found for this user')
      } else {
        console.error('Error fetching API info:', error)
        setError("Error fetching API configuration. Please try again.")
      }
    } else if (data) {
      setApiInfo(data)
    }
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
  }

  const handleApiInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiInfo({ ...apiInfo, [e.target.name]: e.target.value })
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

  const handleSubmitApiInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { error } = await supabase
      .from('api_config')
      .upsert({ user_id: user.id, ...apiInfo })

    if (error) {
      console.error('Error updating API info:', error)
      setError("Error updating API configuration. Please try again.")
    } else {
      setError(null)
      alert("API configuration updated successfully!")
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
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
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp API Configuration</CardTitle>
              <CardDescription>Manage your WhatsApp Official Cloud API settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitApiInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key</Label>
                  <div className="flex">
                    <Input
                      id="api_key"
                      name="api_key"
                      type={showApiKey ? "text" : "password"}
                      value={apiInfo.api_key}
                      onChange={handleApiInfoChange}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      <span className="sr-only">{showApiKey ? "Hide API Key" : "Show API Key"}</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number_id">Phone Number ID</Label>
                  <Input
                    id="phone_number_id"
                    name="phone_number_id"
                    value={apiInfo.phone_number_id}
                    onChange={handleApiInfoChange}
                  />
                </div>
                <Button type="submit">Update API Configuration</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DatabaseStatus } from "@/components/database-status"
import { Settings as SettingsIcon, Database, Bell, Shield, Globe, User, Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    senderName: "Your Business",
    language: "en",
    notifications: true,
    twoFactor: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setSettings({ ...settings, [field]: value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-heading-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                Settings
              </h1>
              <p className="text-body text-muted-foreground">
                Manage your application preferences and configurations
              </p>
              <div className="flex items-center gap-2 text-caption text-primary">
                <SettingsIcon className="w-4 h-4" />
                SYSTEM CONFIGURATION
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8 space-y-8">
        {/* Database Management Section */}
        <Card className="card-elevated hover-lift glass-effect border-0 shadow-xl animate-fade-in">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-heading-4">Database Management</CardTitle>
                <CardDescription>Monitor and manage your database connection</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DatabaseStatus />
          </CardContent>
        </Card>

        {/* Application Settings */}
        <div className="grid gap-8 md:grid-cols-2 animate-slide-up">
          {/* Profile Settings */}
          <Card className="card-elevated hover-lift glass-effect border-0 shadow-xl">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-heading-4">Profile Settings</CardTitle>
                  <CardDescription>Configure your business profile</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="senderName" className="text-sm font-medium">Sender Name</Label>
                <Input
                  id="senderName"
                  value={settings.senderName}
                  onChange={(e) => handleChange("senderName", e.target.value)}
                  className="glass-effect border-0 shadow-sm"
                  placeholder="Enter your business name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium">Default Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleChange("language", value)}
                >
                  <SelectTrigger className="glass-effect border-0 shadow-sm">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        English
                      </div>
                    </SelectItem>
                    <SelectItem value="es">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Spanish
                      </div>
                    </SelectItem>
                    <SelectItem value="fr">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        French
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security & Notifications */}
          <Card className="card-elevated hover-lift glass-effect border-0 shadow-xl">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-heading-4">Security & Notifications</CardTitle>
                  <CardDescription>Manage your security and notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="notifications" className="text-sm font-medium">Enable Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive alerts for important events</p>
                  </div>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleChange("notifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="twoFactor" className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch
                  id="twoFactor"
                  checked={settings.twoFactor}
                  onCheckedChange={(checked) => handleChange("twoFactor", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-center animate-slide-in-bottom">
          <Button className="btn-primary px-8 py-3 text-lg shadow-lg hover-lift">
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}


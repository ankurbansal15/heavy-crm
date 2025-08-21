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
import { Separator } from "@/components/ui/separator"
import { DatabaseStatus } from "@/components/database-status"

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
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      {/* Database Management Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Database Management</h2>
        <DatabaseStatus />
      </div>

      <Separator />

      {/* Application Settings */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Application Settings</h2>
        
        <div>
          <Label htmlFor="senderName">Sender Name</Label>
          <Input
            id="senderName"
            value={settings.senderName}
            onChange={(e) => handleChange("senderName", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="language">Default Language</Label>
          <Select
            value={settings.language}
            onValueChange={(value) => handleChange("language", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={(checked) => handleChange("notifications", checked)}
          />
          <Label htmlFor="notifications">Enable Notifications</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="twoFactor"
            checked={settings.twoFactor}
            onCheckedChange={(checked) => handleChange("twoFactor", checked)}
          />
          <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
        </div>
        
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}


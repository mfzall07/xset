"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Globe, Lock, Moon, Save, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useNotifications } from "@/components/notification-provider"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { addNotification } = useNotifications()

  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Acme Corporation",
    companyLogo: "",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    timezone: "UTC-5",
    language: "en",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    loanReminders: true,
    approvalAlerts: true,
    systemUpdates: false,
    dailyDigest: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    sessionTimeout: "30",
    loginAttempts: "5",
  })

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (name: string) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityToggle = (name: string) => {
    setSecuritySettings((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const saveSettings = (settingType: string) => {
    addNotification({
      title: "Settings Saved",
      message: `Your ${settingType} settings have been updated successfully`,
      type: "success",
    })

    // Jika menyimpan pengaturan tampilan, pastikan tema disimpan
    if (settingType === "appearance") {
      // Tema sudah disimpan oleh next-themes, tapi kita bisa menambahkan logika tambahan di sini
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Sun className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={generalSettings.companyName}
                  onChange={handleGeneralChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo URL</Label>
                <Input
                  id="companyLogo"
                  name="companyLogo"
                  value={generalSettings.companyLogo}
                  onChange={handleGeneralChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) => handleSelectChange("dateFormat", value)}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={generalSettings.timeFormat}
                    onValueChange={(value) => handleSelectChange("timeFormat", value)}
                  >
                    <SelectTrigger id="timeFormat">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => handleSelectChange("timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => handleSelectChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => saveSettings("general")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-muted-foreground" />
                    <Switch
                      id="darkMode"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Theme Selection</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("system")}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>
              <Button onClick={() => saveSettings("appearance")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={() => handleNotificationToggle("pushNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="loanReminders">Loan Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive reminders about upcoming loan returns</p>
                  </div>
                  <Switch
                    id="loanReminders"
                    checked={notificationSettings.loanReminders}
                    onCheckedChange={() => handleNotificationToggle("loanReminders")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="approvalAlerts">Approval Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for pending approvals</p>
                  </div>
                  <Switch
                    id="approvalAlerts"
                    checked={notificationSettings.approvalAlerts}
                    onCheckedChange={() => handleNotificationToggle("approvalAlerts")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemUpdates">System Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about system updates</p>
                  </div>
                  <Switch
                    id="systemUpdates"
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={() => handleNotificationToggle("systemUpdates")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dailyDigest">Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive a daily summary of activities</p>
                  </div>
                  <Switch
                    id="dailyDigest"
                    checked={notificationSettings.dailyDigest}
                    onCheckedChange={() => handleNotificationToggle("dailyDigest")}
                  />
                </div>
              </div>
              <Button onClick={() => saveSettings("notification")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleSecurityToggle("twoFactorAuth")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    name="passwordExpiry"
                    type="number"
                    min="0"
                    value={securitySettings.passwordExpiry}
                    onChange={handleSecurityChange}
                  />
                  <p className="text-xs text-muted-foreground">Number of days before passwords expire (0 for never)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    name="sessionTimeout"
                    type="number"
                    min="5"
                    value={securitySettings.sessionTimeout}
                    onChange={handleSecurityChange}
                  />
                  <p className="text-xs text-muted-foreground">Time of inactivity before automatic logout</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Failed Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    name="loginAttempts"
                    type="number"
                    min="1"
                    value={securitySettings.loginAttempts}
                    onChange={handleSecurityChange}
                  />
                  <p className="text-xs text-muted-foreground">Number of failed attempts before account lockout</p>
                </div>
              </div>
              <Button onClick={() => saveSettings("security")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

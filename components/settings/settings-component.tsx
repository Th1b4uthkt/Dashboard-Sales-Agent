'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { APIKeySettings } from './api-key-settings'
import { PasswordChangeSettings } from './password-change-settings'
import { ProfileSettings } from './profile-settings'

export function SettingsComponent() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="apiKeys">API Keys</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSettings />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="apiKeys">
        <Card>
          <CardHeader>
            <CardTitle>API Key Management</CardTitle>
            <CardDescription>Manage your API keys for various services</CardDescription>
          </CardHeader>
          <CardContent>
            <APIKeySettings />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Change your password and manage security options</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordChangeSettings />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

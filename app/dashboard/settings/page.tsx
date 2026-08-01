"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pt-4 md:pt-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="instructor@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" defaultValue="Senior Developer & Instructor" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the dashboard looks on your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue={theme} onValueChange={(val) => setTheme(val)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="light" id="light" className="peer sr-only" />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="w-full space-y-2">
                      <div className="p-2 bg-[#ecf0f1] rounded-md h-20 w-full flex flex-col gap-2">
                        <div className="h-4 w-1/3 bg-white rounded shadow-sm" />
                        <div className="h-2 w-full bg-white rounded shadow-sm" />
                        <div className="h-2 w-4/5 bg-white rounded shadow-sm" />
                      </div>
                      <span className="block w-full text-center font-medium">Light</span>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="w-full space-y-2">
                      <div className="p-2 bg-[#171923] rounded-md h-20 w-full flex flex-col gap-2 border border-zinc-800">
                        <div className="h-4 w-1/3 bg-[#2A2D3A] rounded shadow-sm" />
                        <div className="h-2 w-full bg-[#2A2D3A] rounded shadow-sm" />
                        <div className="h-2 w-4/5 bg-[#2A2D3A] rounded shadow-sm" />
                      </div>
                      <span className="block w-full text-center font-medium">Dark</span>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="system" id="system" className="peer sr-only" />
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="w-full space-y-2">
                      <div className="p-2 bg-gradient-to-r from-[#ecf0f1] to-[#171923] rounded-md h-20 w-full flex flex-col gap-2">
                        <div className="h-4 w-1/3 bg-white/50 rounded shadow-sm mix-blend-overlay" />
                        <div className="h-2 w-full bg-white/50 rounded shadow-sm mix-blend-overlay" />
                        <div className="h-2 w-4/5 bg-white/50 rounded shadow-sm mix-blend-overlay" />
                      </div>
                      <span className="block w-full text-center font-medium">System</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="email-notifs">Email Notifications</Label>
                  <span className="text-[13px] text-muted-foreground">Receive a daily summary of class activity.</span>
                </div>
                <Switch id="email-notifs" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="submission-notifs">New Submissions</Label>
                  <span className="text-[13px] text-muted-foreground">Get notified when a student submits an assignment.</span>
                </div>
                <Switch id="submission-notifs" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="message-notifs">Direct Messages</Label>
                  <span className="text-[13px] text-muted-foreground">Receive a notification for new messages.</span>
                </div>
                <Switch id="message-notifs" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

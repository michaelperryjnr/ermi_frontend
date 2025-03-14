"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell } from "lucide-react"

export default function AdminNotifications() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "all",
    url: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setSendResult(null)

    try {
      // In a real app, you would send this to your backend
      // which would then send notifications to all subscribed users

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSendResult({
        success: true,
        message: `Notification sent successfully to ${formData.type === "all" ? "all users" : formData.type + " subscribers"}`,
      })

      // Reset form
      setFormData({
        title: "",
        message: "",
        type: "all",
        url: "",
      })
    } catch (error) {
      setSendResult({
        success: false,
        message: "Failed to send notification. Please try again.",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Push Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter notification title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Notification Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter notification message"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Recipient Group</Label>
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscribers</SelectItem>
                  <SelectItem value="youth">Youth Department</SelectItem>
                  <SelectItem value="women">Women's Fellowship</SelectItem>
                  <SelectItem value="men">Men's Fellowship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Destination URL (Optional)</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="e.g., /events/youth-conference"
              />
              <p className="text-sm text-muted-foreground">
                Where users will be directed when they click the notification
              </p>
            </div>

            {sendResult && (
              <div
                className={`p-4 rounded-md ${sendResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
              >
                {sendResult.message}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSending}>
                <Bell className="h-4 w-4 mr-2" />
                {isSending ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


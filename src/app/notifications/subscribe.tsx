"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { subscribeUser, unsubscribeUser } from "./actions"

export default function NotificationSubscribe() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()
      setSubscription(existingSubscription)
    } catch (error) {
      console.error("Error checking subscription:", error)
    }
  }

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true)

      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        throw new Error("Notification permission denied")
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready

      // Create subscription
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BLBz5TJWGxrKD9TdP-OB-Tid9-UGbTm0JUghQEXEZcLOiNQdj-Yk6XkLRcF_4JWZX0PQSBPkDo_U6gvUWJ6YbCg",
        ),
      })

      // Save subscription on server
      await subscribeUser(newSubscription)

      setSubscription(newSubscription)
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleUnsubscribe = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe()
        await unsubscribeUser(subscription.endpoint)
        setSubscription(null)
      }
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
    }
  }

  // Helper function to convert base64 to Uint8Array
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }

  if (!isSupported) {
    return null
  }

  return (
    <div>
      {subscription ? (
        <Button variant="outline" size="sm" onClick={handleUnsubscribe} className="flex items-center gap-2">
          <BellOff className="h-4 w-4" />
          Unsubscribe from Notifications
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSubscribe}
          disabled={isSubscribing}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          {isSubscribing ? "Subscribing..." : "Subscribe to Notifications"}
        </Button>
      )}
    </div>
  )
}


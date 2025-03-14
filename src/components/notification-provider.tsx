"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { subscribeToNotifications, unsubscribeFromNotifications } from "@/lib/notifications"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

type NotificationContextType = {
  isSubscribed: boolean
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  isSubscribed: false,
  subscribe: async () => {},
  unsubscribe: async () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isPWAInstalled, setIsPWAInstalled] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      return
    }

    // Check if already subscribed
    if (Notification.permission === "granted") {
      setIsSubscribed(true)
    }

    // Check if app is installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsPWAInstalled(true)
    }

    // Show notification prompt after 5 seconds if not subscribed and not shown before
    const hasPromptBeenShown = localStorage.getItem("notificationPromptShown")
    if (!hasPromptBeenShown && Notification.permission !== "granted" && Notification.permission !== "denied") {
      const timer = setTimeout(() => {
        setShowPrompt(true)
        localStorage.setItem("notificationPromptShown", "true")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const subscribe = async () => {
    try {
      await subscribeToNotifications()
      setIsSubscribed(true)
      setShowPrompt(false)
    } catch (error) {
      console.error("Failed to subscribe to notifications:", error)
    }
  }

  const unsubscribe = async () => {
    try {
      await unsubscribeFromNotifications()
      setIsSubscribed(false)
    } catch (error) {
      console.error("Failed to unsubscribe from notifications:", error)
    }
  }

  return (
    <NotificationContext.Provider value={{ isSubscribed, subscribe, unsubscribe }}>
      {children}

      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stay Updated</DialogTitle>
            <DialogDescription>
              Would you like to receive notifications about new sermons, events, and devotionals?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrompt(false)}>
              Not Now
            </Button>
            <Button onClick={subscribe}>Enable Notifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NotificationContext.Provider>
  )
}


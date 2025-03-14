import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

// In a real application, you would store these in environment variables
const vapidKeys = {
  publicKey: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U",
  privateKey: "UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTWKs-ls",
}

// Configure web-push with VAPID details
webpush.setVapidDetails("mailto:info@eternalredemption.org", vapidKeys.publicKey, vapidKeys.privateKey)

export async function POST(request: NextRequest) {
  try {
    const { subscription, title, body, url } = await request.json()

    if (!subscription || !title || !body) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Prepare the notification payload
    const payload = JSON.stringify({
      title,
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-96x96.png",
      url: url || "/",
    })

    // Send the notification
    await webpush.sendNotification(subscription, payload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}


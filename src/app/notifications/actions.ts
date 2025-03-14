"use server"

import webpush from "web-push"

// In a real app, you would store these in environment variables
const vapidPublicKey = "BLBz5TJWGxrKD9TdP-OB-Tid9-UGbTm0JUghQEXEZcLOiNQdj-Yk6XkLRcF_4JWZX0PQSBPkDo_U6gvUWJ6YbCg"
const vapidPrivateKey = "Xt5o5vOlxW5JFJcdhQBBvyUZPVqQJfwbmm5KzN_W-UA"

webpush.setVapidDetails("mailto:info@eternalredemption.org", vapidPublicKey, vapidPrivateKey)

// In a real app, you would store subscriptions in a database
let subscriptions: PushSubscription[] = []

export async function subscribeUser(subscription: PushSubscription) {
  // Check if subscription already exists
  const exists = subscriptions.some((sub) => sub.endpoint === subscription.endpoint)

  if (!exists) {
    subscriptions.push(subscription)
  }

  return { success: true }
}

export async function unsubscribeUser(endpoint: string) {
  subscriptions = subscriptions.filter((sub) => sub.endpoint !== endpoint)
  return { success: true }
}

export async function sendNotification(title: string, body: string, url = "/") {
  if (subscriptions.length === 0) {
    return { success: false, error: "No subscriptions available" }
  }

  const payload = JSON.stringify({
    title,
    body,
    icon: "/icon-192x192.png",
    url,
  })

  const results = await Promise.allSettled(
    subscriptions.map((subscription) => webpush.sendNotification(subscription, payload)),
  )

  const successful = results.filter((r) => r.status === "fulfilled").length
  const failed = results.filter((r) => r.status === "rejected").length

  return {
    success: successful > 0,
    stats: { successful, failed, total: subscriptions.length },
  }
}


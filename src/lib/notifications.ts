// This file handles the subscription to push notifications

export async function subscribeToNotifications() {
  // Check if service workers and push messaging are supported
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications are not supported in this browser")
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
      throw new Error("Permission not granted for notifications")
    }

    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    })

    // Get push subscription
    const existingSubscription = await registration.pushManager.getSubscription()
    if (existingSubscription) {
      return existingSubscription
    }

    // Subscribe to push notifications
    // In a real app, you would get this from your environment variables
    const vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"

    // Convert the public key to the format expected by the browser
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey)

    // Create a new subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })

    // Send the subscription to your server
    await saveSubscription(subscription)

    return subscription
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    throw error
  }
}

export async function unsubscribeFromNotifications() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported in this browser")
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      // Unsubscribe from push notifications
      await subscription.unsubscribe()

      // Remove the subscription from your server
      await deleteSubscription(subscription)
    }
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error)
    throw error
  }
}

// Helper function to convert base64 to Uint8Array
// (Required for the applicationServerKey)
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

// Save subscription to server
async function saveSubscription(subscription: PushSubscription) {
  // In a real app, you would send this to your backend
  // Example:
  // await fetch('/api/notifications/subscribe', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(subscription),
  // });

  console.log("Subscription saved:", subscription)
  return true
}

// Delete subscription from server
async function deleteSubscription(subscription: PushSubscription) {
  // In a real app, you would send this to your backend
  // Example:
  // await fetch('/api/notifications/unsubscribe', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(subscription),
  // });

  console.log("Subscription deleted:", subscription)
  return true
}


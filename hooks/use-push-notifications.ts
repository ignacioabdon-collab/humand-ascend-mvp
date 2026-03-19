"use client"

import { useState, useEffect, useCallback } from "react"

type PermissionState = "default" | "granted" | "denied" | "unsupported"

export function usePushNotifications() {
  const [permission, setPermission] = useState<PermissionState>("default")
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported")
      return
    }
    setPermission(Notification.permission as PermissionState)
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (permission === "unsupported") {
      console.warn("Push notifications not supported in this browser")
      return false
    }

    if (permission === "granted") {
      await subscribeToPush()
      return true
    }

    if (permission === "denied") {
      console.warn("Push notifications were previously denied by the user")
      return false
    }

    const result = await Notification.requestPermission()
    setPermission(result as PermissionState)

    if (result === "granted") {
      await subscribeToPush()
      return true
    }

    return false
  }, [permission])

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existing = await registration.pushManager.getSubscription()

      if (existing) {
        setSubscription(existing)
        await sendSubscriptionToServer(existing)
        return
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      setSubscription(sub)
      await sendSubscriptionToServer(sub)
    } catch (err) {
      console.error("Failed to subscribe to push:", err)
    }
  }

  const sendSubscriptionToServer = async (sub: PushSubscription) => {
    try {
      await fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      })
    } catch (err) {
      console.error("Failed to send subscription to server:", err)
    }
  }

  return { permission, subscription, requestPermission }
}

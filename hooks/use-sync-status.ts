"use client"

import { useEffect, useState } from "react"
import { getSyncManager, type SyncStatus } from "@/lib/sync-manager"

export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    isSyncing: false,
    queueLength: 0,
  })

  useEffect(() => {
    const manager = getSyncManager()
    if (!manager) return

    const unsubscribe = manager.subscribe((newStatus) => {
      setStatus(newStatus)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return status
}

export function useSyncToast() {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  })

  useEffect(() => {
    const handleSyncToast = (event: Event) => {
      const customEvent = event as CustomEvent
      setToast({
        message: customEvent.detail.message,
        visible: true,
      })

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    }

    window.addEventListener("sync-toast", handleSyncToast)
    return () => {
      window.removeEventListener("sync-toast", handleSyncToast)
    }
  }, [])

  return toast
}

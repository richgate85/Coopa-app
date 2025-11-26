"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowIndicator(true)
      setIsSyncing(true)

      // Hide indicator after 3 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false)
        setIsSyncing(false)
      }, 3000)

      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
      setIsSyncing(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Listen for sync messages from service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "SYNC_SUCCESS") {
          console.log("[v0] Sync successful:", event.data.url)
        }
      })
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showIndicator) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOnline ? "bg-green-50 border-b border-green-200" : "bg-red-50 border-b border-red-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {isOnline ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium text-green-800">
              {isSyncing ? "Back online! Syncing your changes..." : "Back online"}
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-sm font-medium text-red-800">
              You're offline. Changes will sync when you're back online.
            </span>
          </>
        )}
      </div>
    </div>
  )
}

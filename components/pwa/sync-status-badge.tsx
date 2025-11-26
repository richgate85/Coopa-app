"use client"

import { useEffect, useState } from "react"
import { getQueuedRequests } from "@/lib/offline-storage"
import { Badge } from "@/components/ui/badge"

interface SyncStatusBadgeProps {
  itemId: string
  status?: "synced" | "pending" | "online-only"
}

export function SyncStatusBadge({ itemId, status = "synced" }: SyncStatusBadgeProps) {
  const [queuedCount, setQueuedCount] = useState(0)

  useEffect(() => {
    const checkQueuedRequests = async () => {
      try {
        const queued = await getQueuedRequests()
        setQueuedCount(queued.length)
      } catch (error) {
        console.error("[v0] Error checking queued requests:", error)
      }
    }

    checkQueuedRequests()

    // Check every 5 seconds
    const interval = setInterval(checkQueuedRequests, 5000)
    return () => clearInterval(interval)
  }, [])

  if (status === "synced") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Synced ✓
      </Badge>
    )
  }

  if (status === "pending") {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        Pending Sync ⏱
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
      Online Only
    </Badge>
  )
}

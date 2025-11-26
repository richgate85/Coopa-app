// Utility functions for sync operations, data freshness, and conflict resolution

export interface DataFreshness {
  data: unknown
  lastUpdated: number
  isStale: boolean
  timeAgoText: string
}

export function getTimeAgoText(timestamp: number): string {
  const now = Date.now()
  const diffMs = now - timestamp
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "just now"
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`

  return new Date(timestamp).toLocaleDateString()
}

export function isDataStale(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp > ttl
}

export function getDataFreshness(data: unknown, timestamp: number, ttl: number): DataFreshness {
  const stale = isDataStale(timestamp, ttl)
  const timeAgoText = getTimeAgoText(timestamp)

  return {
    data,
    lastUpdated: timestamp,
    isStale: stale,
    timeAgoText,
  }
}

export function mergeDataIntelligently(
  localData: Record<string, unknown>,
  remoteData: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...remoteData }

  // Preserve local changes that don't conflict
  Object.keys(localData).forEach((key) => {
    if (!(key in remoteData)) {
      merged[key] = localData[key]
    }
  })

  return merged
}

export function detectConflicts(localData: Record<string, unknown>, remoteData: Record<string, unknown>): string[] {
  const conflicts: string[] = []

  Object.keys(localData).forEach((key) => {
    if (key in remoteData && JSON.stringify(localData[key]) !== JSON.stringify(remoteData[key])) {
      conflicts.push(key)
    }
  })

  return conflicts
}

export function createConflictModalData(
  localData: Record<string, unknown>,
  remoteData: Record<string, unknown>,
  conflicts: string[],
) {
  return {
    title: "Data Changed Remotely",
    message: "Your local changes conflict with remote data. Choose how to proceed:",
    conflicts: conflicts.map((key) => ({
      field: key,
      local: localData[key],
      remote: remoteData[key],
    })),
    options: [
      { label: "Keep Local", value: "local" },
      { label: "Use Remote", value: "remote" },
      { label: "Merge", value: "merge" },
    ],
  }
}

export function validateSyncQueueItem(item: {
  method: string
  url: string
  data?: unknown
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!item.method || !["GET", "POST", "PUT", "DELETE", "PATCH"].includes(item.method)) {
    errors.push("Invalid HTTP method")
  }

  if (!item.url || !item.url.startsWith("/")) {
    errors.push("Invalid URL")
  }

  if (item.method !== "GET" && !item.data) {
    errors.push("Data required for non-GET requests")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

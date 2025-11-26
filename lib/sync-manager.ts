// Sync manager for handling queue processing, network monitoring, and conflict resolution
import { processQueue, getQueueLength, clearExpiredCache } from "./offline-storage"

export interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  queueLength: number
  lastSyncTime?: number
  syncError?: string
}

export interface ConflictResolution {
  strategy: "server-wins" | "merge" | "user-choice"
  localData?: unknown
  remoteData?: unknown
  mergedData?: unknown
}

class SyncManager {
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    isSyncing: false,
    queueLength: 0,
  }

  private syncInterval: NodeJS.Timeout | null = null
  private listeners: Set<(status: SyncStatus) => void> = new Set()

  constructor() {
    this.initNetworkMonitoring()
  }

  private initNetworkMonitoring(): void {
    window.addEventListener("online", () => this.handleOnline())
    window.addEventListener("offline", () => this.handleOffline())

    // Check network status every 10 seconds
    this.syncInterval = setInterval(() => {
      this.checkNetworkStatus()
    }, 10000)
  }

  private handleOnline(): void {
    console.log("[v0] App is online")
    this.syncStatus.isOnline = true
    this.notifyListeners()
    this.processSyncQueue()
  }

  private handleOffline(): void {
    console.log("[v0] App is offline")
    this.syncStatus.isOnline = false
    this.notifyListeners()
  }

  private async checkNetworkStatus(): Promise<void> {
    const wasOnline = this.syncStatus.isOnline
    this.syncStatus.isOnline = navigator.onLine

    if (!wasOnline && this.syncStatus.isOnline) {
      console.log("[v0] Connection restored, processing queue")
      await this.processSyncQueue()
    }

    this.notifyListeners()
  }

  async processSyncQueue(): Promise<void> {
    if (this.syncStatus.isSyncing || !this.syncStatus.isOnline) {
      return
    }

    this.syncStatus.isSyncing = true
    this.notifyListeners()

    try {
      const queueLength = await getQueueLength()
      if (queueLength > 0) {
        console.log(`[v0] Syncing ${queueLength} items...`)
        this.showToast(`Syncing ${queueLength} items...`)

        const result = await processQueue()
        this.syncStatus.lastSyncTime = Date.now()
        this.syncStatus.syncError = undefined

        if (result.failed > 0) {
          this.syncStatus.syncError = `${result.failed} items failed to sync`
          console.warn(`[v0] Sync completed: ${result.synced} synced, ${result.failed} failed`)
        } else {
          console.log(`[v0] Sync completed: ${result.synced} items synced`)
        }
      }

      // Clear expired cache
      await clearExpiredCache()
    } catch (error) {
      this.syncStatus.syncError = "Sync failed"
      console.error("[v0] Sync error:", error)
    } finally {
      this.syncStatus.isSyncing = false
      this.notifyListeners()
    }
  }

  async retryWithBackoff(fn: () => Promise<Response>, maxRetries = 3): Promise<Response | null> {
    const delays = [1000, 5000, 15000] // 1s, 5s, 15s

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fn()
        if (response.ok) {
          return response
        }

        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delays[attempt]))
        }
      } catch (error) {
        console.error(`[v0] Attempt ${attempt + 1} failed:`, error)

        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delays[attempt]))
        }
      }
    }

    return null
  }

  resolveConflict(
    localData: unknown,
    remoteData: unknown,
    strategy: "server-wins" | "merge" | "user-choice" = "server-wins",
  ): ConflictResolution {
    switch (strategy) {
      case "server-wins":
        return {
          strategy: "server-wins",
          localData,
          remoteData,
          mergedData: remoteData,
        }

      case "merge":
        return {
          strategy: "merge",
          localData,
          remoteData,
          mergedData: this.mergeData(localData, remoteData),
        }

      case "user-choice":
        return {
          strategy: "user-choice",
          localData,
          remoteData,
        }

      default:
        return {
          strategy: "server-wins",
          mergedData: remoteData,
        }
    }
  }

  private mergeData(local: unknown, remote: unknown): unknown {
    if (typeof local !== "object" || typeof remote !== "object") {
      return remote
    }

    return {
      ...local,
      ...remote,
      _merged: true,
      _mergedAt: Date.now(),
    }
  }

  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.add(listener)
    listener(this.syncStatus)

    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.syncStatus))
  }

  getStatus(): SyncStatus {
    return { ...this.syncStatus }
  }

  private showToast(message: string): void {
    // Dispatch custom event for toast notification
    window.dispatchEvent(
      new CustomEvent("sync-toast", {
        detail: { message },
      }),
    )
  }

  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
    this.listeners.clear()
  }
}

let _syncManager: SyncManager | null = null

export function getSyncManager(): SyncManager | null {
  // Only initialize in a browser environment where `window` and `navigator` exist.
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return null
  if (!_syncManager) _syncManager = new SyncManager()
  return _syncManager
}

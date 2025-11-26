// Enhanced IndexedDB wrapper for offline data persistence with comprehensive sync support
// This module requires a browser environment (indexedDB, window). When imported
// during SSR the functions will throw early with a helpful message instead of
// causing unpredictable runtime errors.
const DB_NAME = "CoopaOfflineDB"
const DB_VERSION = 1

// TTL constants (in milliseconds)
const TTL = {
  DASHBOARD: 60 * 60 * 1000, // 1 hour
  BULK_REQUESTS: 30 * 60 * 1000, // 30 minutes
  REQUEST_DETAILS: 60 * 60 * 1000, // 1 hour
  PAYMENT_TRACKER: 5 * 60 * 1000, // 5 minutes
  USER_PROFILE: 24 * 60 * 60 * 1000, // 24 hours
  DRAFTS: null, // No TTL - persist until submitted
}

interface QueuedRequest {
  id?: number
  method: string
  url: string
  data?: unknown
  timestamp: number
  retries: number
  status: "pending" | "failed" | "synced"
}

interface CachedData {
  // Different stores use different key names (id, key, requestId). Make them optional
  key?: string
  id?: number
  requestId?: string | number
  data: unknown
  timestamp: number
  ttl?: number
}

interface SyncQueueItem {
  id?: number
  method: string
  url: string
  data?: unknown
  timestamp: number
  retries: number
  status: "pending" | "failed" | "synced"
}

let db: IDBDatabase | null = null

const isBrowser = typeof window !== 'undefined' && typeof indexedDB !== 'undefined'

export async function initDB(): Promise<IDBDatabase> {
  if (!isBrowser) {
    return Promise.reject(new Error('IndexedDB is not available in this environment. initDB must be called in a browser (client) environment.'))
  }

  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error("[v0] IndexedDB error:", request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      db = request.result
      console.log("[v0] IndexedDB initialized")
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // Store 1: Dashboard stats and active purchases
      if (!database.objectStoreNames.contains("dashboard")) {
        database.createObjectStore("dashboard", { keyPath: "id" })
      }

      // Store 2: Bulk buy request list
      if (!database.objectStoreNames.contains("bulk_requests")) {
        database.createObjectStore("bulk_requests", { keyPath: "id" })
      }

      // Store 3: Individual request details
      if (!database.objectStoreNames.contains("request_details")) {
        database.createObjectStore("request_details", { keyPath: "requestId" })
      }

      // Store 4: Member payment lists
      if (!database.objectStoreNames.contains("payment_tracker")) {
        database.createObjectStore("payment_tracker", { keyPath: "requestId" })
      }

      // Store 5: Sync queue for failed requests
      if (!database.objectStoreNames.contains("sync_queue")) {
        database.createObjectStore("sync_queue", { keyPath: "id", autoIncrement: true })
      }

      // Store 6: User/co-op profile
      if (!database.objectStoreNames.contains("user_profile")) {
        database.createObjectStore("user_profile", { keyPath: "userId" })
      }

      // Store 7: Auto-saved form drafts
      if (!database.objectStoreNames.contains("drafts")) {
        database.createObjectStore("drafts", { keyPath: "draftId" })
      }

      console.log("[v0] IndexedDB schema created with 7 stores")
    }
  })
}

export async function saveData(store: string, data: unknown, ttl?: number): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], "readwrite")
    const objectStore = transaction.objectStore(store)
    const request = objectStore.put({
      ...(typeof data === "object" && data !== null ? data : { data }),
      timestamp: Date.now(),
      ttl,
    })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      console.log(`[v0] Data saved to ${store}`)
      resolve()
    }
  })
}

export async function getData(store: string, key: string | number): Promise<unknown | null> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], "readonly")
    const objectStore = transaction.objectStore(store)
    const request = objectStore.get(key)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const result = request.result as CachedData | undefined

      if (!result) {
        resolve(null)
        return
      }

      // Check if cache has expired
      if (result.ttl && Date.now() - result.timestamp > result.ttl) {
        // key is the lookup key provided by the caller and is guaranteed
        // to be a string | number (IDBValidKey) so this is safe.
        objectStore.delete(key as IDBValidKey)
        resolve(null)
        return
      }

      resolve(result.data || result)
    }
  })
}

export async function getAllData(store: string): Promise<unknown[]> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], "readonly")
    const objectStore = transaction.objectStore(store)
    const request = objectStore.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const results = request.result as CachedData[]
      const now = Date.now()

      // Filter out expired items
      const validResults = results.filter((item) => {
        if (item.ttl && now - item.timestamp > item.ttl) {
          // Different stores use different key names. Compute a deletion key
          // and only call delete when we have a defined IDBValidKey.
          const keyToDelete = (item.key ?? item.id ?? item.requestId) as IDBValidKey | undefined
          if (typeof keyToDelete !== 'undefined') {
            objectStore.delete(keyToDelete)
          }
          return false
        }
        return true
      })

      resolve(validResults)
    }
  })
}

export async function deleteData(store: string, key: string | number): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([store], "readwrite")
    const objectStore = transaction.objectStore(store)
    const request = objectStore.delete(key)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      console.log(`[v0] Data deleted from ${store}`)
      resolve()
    }
  })
}

export async function clearExpiredCache(): Promise<number> {
  const database = await initDB()
  const stores = ["dashboard", "bulk_requests", "request_details", "payment_tracker", "user_profile"]
  let deletedCount = 0
  const now = Date.now()

  for (const store of stores) {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction([store], "readwrite")
      const objectStore = transaction.objectStore(store)
      const request = objectStore.getAll()

      request.onsuccess = () => {
        const results = request.result as CachedData[]
        results.forEach((item) => {
          if (item.ttl && now - item.timestamp > item.ttl) {
            const keyToDelete = (item.key ?? item.id ?? item.requestId) as IDBValidKey | undefined
            if (typeof keyToDelete !== 'undefined') {
              objectStore.delete(keyToDelete)
              deletedCount++
            }
          }
        })
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  console.log(`[v0] Cleared ${deletedCount} expired cache items`)
  return deletedCount
}

export async function queueSync(method: string, url: string, data?: unknown): Promise<number> {
  const database = await initDB()

  const queueItem: SyncQueueItem = {
    method,
    url,
    data,
    timestamp: Date.now(),
    retries: 0,
    status: "pending",
  }

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["sync_queue"], "readwrite")
    const store = transaction.objectStore("sync_queue")
    const request = store.add(queueItem)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      console.log(`[v0] Request queued for sync: ${method} ${url}`)
      resolve(request.result as number)

      // Register background sync (guarded and typed)
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready
          .then((registration) => {
            // Some TS DOM lib configurations don't include 'sync' on the
            // ServiceWorkerRegistration type. Narrow at runtime and cast for
            // the call so that projects without the optional lib still work.
            if (registration && 'sync' in registration && (registration as any).sync) {
              ;(registration as any).sync.register('sync-queue').catch((err: unknown) => {
                if (err instanceof Error) console.error('[v0] Background sync registration failed:', err.message)
                else console.error('[v0] Background sync registration failed:', err)
              })
            }
          })
          .catch((err: unknown) => {
            if (err instanceof Error) console.error('[v0] serviceWorker.ready failed:', err.message)
            else console.error('[v0] serviceWorker.ready failed:', err)
          })
      }
    }
  })
}

export async function processQueue(): Promise<{ synced: number; failed: number }> {
  const database = await initDB()
  let synced = 0
  let failed = 0

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["sync_queue"], "readonly")
    const store = transaction.objectStore("sync_queue")
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = async () => {
      const items = request.result as SyncQueueItem[]
      const pendingItems = items.filter((item) => item.status === "pending")

      for (const item of pendingItems) {
        try {
          const response = await fetch(item.url, {
            method: item.method,
            headers: { "Content-Type": "application/json" },
            body: item.data ? JSON.stringify(item.data) : undefined,
          })

          if (response.ok) {
            if (typeof item.id !== 'undefined') {
              await deleteData("sync_queue", item.id as string | number)
            }
            synced++
          } else {
            failed++
          }
        } catch (err: unknown) {
          if (err instanceof Error) console.error(`[v0] Sync failed for ${item.url}:`, err.message)
          else console.error(`[v0] Sync failed for ${item.url}:`, err)
          failed++
        }
      }

      resolve({ synced, failed })
    }
  })
}

export async function getQueueLength(): Promise<number> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["sync_queue"], "readonly")
    const store = transaction.objectStore("sync_queue")
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const items = request.result as SyncQueueItem[]
      const pendingCount = items.filter((item) => item.status === "pending").length
      resolve(pendingCount)
    }
  })
}

// Utility: return all queued sync items (used by UI components)
export async function getQueuedRequests(): Promise<SyncQueueItem[]> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["sync_queue"], "readonly")
    const store = transaction.objectStore("sync_queue")
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const items = request.result as SyncQueueItem[]
      resolve(items)
    }
  })
}

export async function saveDraft(formId: string, data: unknown): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["drafts"], "readwrite")
    const store = transaction.objectStore("drafts")
    const request = store.put({
      draftId: formId,
      data,
      timestamp: Date.now(),
    })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      console.log(`[v0] Draft saved: ${formId}`)
      resolve()
    }
  })
}

export async function getDraft(formId: string): Promise<unknown | null> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["drafts"], "readonly")
    const store = transaction.objectStore("drafts")
    const request = store.get(formId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const result = request.result as { data: unknown } | undefined
      resolve(result?.data || null)
    }
  })
}

export async function clearDraft(formId: string): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["drafts"], "readwrite")
    const store = transaction.objectStore("drafts")
    const request = store.delete(formId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      console.log(`[v0] Draft cleared: ${formId}`)
      resolve()
    }
  })
}

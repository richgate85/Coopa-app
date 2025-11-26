const STATIC_CACHE = "coopa-static-v1"
const IMAGE_CACHE = "coopa-images-v1"
const API_CACHE = "coopa-api-v1"
const OFFLINE_URL = "/offline.html"

const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/opportunities",
  "/post-request",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

const NETWORK_TIMEOUT = 3000

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[v0] Service Worker installing...")
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("[v0] Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      }),
      caches.open(IMAGE_CACHE),
      caches.open(API_CACHE),
    ]),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("[v0] Service Worker activating...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, IMAGE_CACHE, API_CACHE].includes(cacheName)) {
              console.log("[v0] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return Promise.all([getCacheSize(STATIC_CACHE), getCacheSize(IMAGE_CACHE), getCacheSize(API_CACHE)]).then(
          ([staticSize, imageSize, apiSize]) => {
            console.log(`[v0] Cache sizes - Static: ${staticSize}KB, Images: ${imageSize}KB, API: ${apiSize}KB`)
          },
        )
      }),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests for mutation operations
  if (request.method !== "GET") {
    if (["POST", "PUT", "DELETE"].includes(request.method)) {
      event.respondWith(queueRequestForSync(request))
    }
    return
  }

  // Skip chrome extensions and external requests
  if (url.protocol === "chrome-extension:") {
    return
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request, API_CACHE, NETWORK_TIMEOUT))
    return
  }

  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i) || url.pathname.includes("/icons/")) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE))
    return
  }

  // HTML pages - stale while revalidate
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(staleWhileRevalidateStrategy(request, STATIC_CACHE))
    return
  }

  if (url.pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/i)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE))
    return
  }

  // Default - network first
  event.respondWith(networkFirstStrategy(request, STATIC_CACHE, NETWORK_TIMEOUT))
})

async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    console.log("[v0] Cache hit:", request.url)
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error("[v0] Fetch failed:", error)
    return new Response("Offline - resource not available", { status: 503 })
  }
}

async function networkFirstStrategy(request, cacheName, timeout) {
  const cache = await caches.open(cacheName)

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(request, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log("[v0] Network failed or timed out, using cache:", request.url)
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }

    // If it's an HTML page and we have no cache, return offline page
    if (request.headers.get("accept")?.includes("text/html")) {
      return caches.match(OFFLINE_URL)
    }

    return new Response(JSON.stringify({ error: "Offline - resource not available" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  }
}

async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => {
      // If fetch fails and we have cached version, return it
      return cached || caches.match(OFFLINE_URL)
    })

  return cached || fetchPromise
}

async function queueRequestForSync(request) {
  try {
    const db = await openDB()
    const body = await request.clone().text()

    await new Promise((resolve, reject) => {
      const transaction = db.transaction(["queued-requests"], "readwrite")
      const store = transaction.objectStore("queued-requests")
      const queuedRequest = {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers),
        body: body,
        timestamp: Date.now(),
      }
      const req = store.add(queuedRequest)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => resolve()
    })

    // Register background sync
    if (self.registration.sync) {
      await self.registration.sync.register("sync-requests")
    }

    return new Response(JSON.stringify({ queued: true }), {
      status: 202,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[v0] Failed to queue request:", error)
    return new Response(JSON.stringify({ error: "Failed to queue request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// Background sync for queued requests
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-requests") {
    event.waitUntil(syncQueuedRequests())
  }
})

async function syncQueuedRequests() {
  try {
    const db = await openDB()
    const requests = await getAllQueuedRequests(db)

    for (const queuedRequest of requests) {
      try {
        const response = await fetch(queuedRequest.url, {
          method: queuedRequest.method,
          headers: queuedRequest.headers,
          body: queuedRequest.body || undefined,
        })

        if (response.ok) {
          await deleteQueuedRequest(db, queuedRequest.id)
          console.log("[v0] Synced request:", queuedRequest.url)

          // Notify clients of successful sync
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "SYNC_SUCCESS",
                url: queuedRequest.url,
              })
            })
          })
        }
      } catch (error) {
        console.error("[v0] Sync failed for:", queuedRequest.url, error)
      }
    }
  } catch (error) {
    console.error("[v0] Background sync error:", error)
  }
}

// IndexedDB helpers
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("coopa-db", 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains("queued-requests")) {
        db.createObjectStore("queued-requests", { keyPath: "id", autoIncrement: true })
      }
    }
  })
}

function getAllQueuedRequests(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["queued-requests"], "readonly")
    const store = transaction.objectStore("queued-requests")
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

function deleteQueuedRequest(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["queued-requests"], "readwrite")
    const store = transaction.objectStore("queued-requests")
    const request = store.delete(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

async function getCacheSize(cacheName) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  let size = 0

  for (const request of keys) {
    const response = await cache.match(request)
    if (response) {
      const blob = await response.blob()
      size += blob.size
    }
  }

  return Math.round(size / 1024) // Convert to KB
}

// Push notification handler
self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    tag: data.tag || "coopa-notification",
    requireInteraction: data.requireInteraction || false,
    data: data.data || {},
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || "/")
      }
    }),
  )
})

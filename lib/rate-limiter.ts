import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || ''
let redis: Redis | null = null
if (REDIS_URL) {
  redis = new Redis(REDIS_URL)
}

type InMemoryEntry = { count: number; timer?: NodeJS.Timeout }
;(global as any)._inMemoryRateLimit = (global as any)._inMemoryRateLimit || new Map<string, InMemoryEntry>()

export async function isAllowed(key: string, limit: number, windowMs: number) {
  // Redis-backed limiter
  if (redis) {
    try {
      const count = await redis.incr(key)
      if (count === 1) {
        await redis.pexpire(key, windowMs)
      }
      return count <= limit
    } catch (err) {
      // on redis error, fall back to in-memory
      console.warn('Redis rate limiter failed, falling back to memory', err)
    }
  }

  // In-memory fallback (single-process only)
  const map: Map<string, InMemoryEntry> = (global as any)._inMemoryRateLimit
  const entry = map.get(key) || { count: 0 }
  if (entry.count >= limit) return false
  entry.count = entry.count + 1
  if (!entry.timer) {
    entry.timer = setTimeout(() => map.delete(key), windowMs)
  }
  map.set(key, entry)
  return true
}

export function shutdownRateLimiter() {
  if (redis) {
    redis.quit().catch(() => {})
  }
}

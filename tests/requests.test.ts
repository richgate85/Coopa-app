import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '../app/api/requests/route'

// Mock firebase-admin helper used by the route
vi.mock('@/lib/firebase-admin', () => {
  return {
    verifyIdToken: vi.fn(async (token: string) => ({ uid: 'test-uid' })),
    adminFirestore: {
      collection: (name: string) => ({
        add: async (payload: any) => ({
          id: 'req1',
          get: async () => ({ data: () => payload }),
        }),
      }),
    },
    adminSdk: {
      firestore: {
        FieldValue: { serverTimestamp: () => 'server-ts' },
      },
    },
  }
})

beforeEach(() => {
  // clear in-memory limiter between tests
  const map: Map<string, any> = (global as any)._inMemoryRateLimit
  if (map && typeof map.clear === 'function') map.clear()
})

describe('POST /api/requests', () => {
  it('returns 401 when missing Authorization', async () => {
    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({}) })
    const res: any = await POST(req as any)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Missing Authorization')
  })

  it('returns 400 when itemName missing', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { Authorization: 'Bearer token' },
      body: JSON.stringify({}),
    })
    const res: any = await POST(req as any)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/itemName is required/)
  })

  it('creates a request successfully', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { Authorization: 'Bearer token' },
      body: JSON.stringify({ itemName: 'Rice', quantity: 2 }),
    })
    const res: any = await POST(req as any)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.data).toBeDefined()
    expect(json.data.id).toBe('req1')
  })

  it('enforces rate limit', async () => {
    const headers = { Authorization: 'Bearer token' }
    // 20 allowed
    for (let i = 0; i < 20; i++) {
      const req = new Request('http://localhost', {
        method: 'POST',
        headers,
        body: JSON.stringify({ itemName: 'X', quantity: 1 }),
      })
      const res: any = await POST(req as any)
      expect(res.status).toBe(200)
    }

    // 21st should be rate-limited
    const req21 = new Request('http://localhost', {
      method: 'POST',
      headers,
      body: JSON.stringify({ itemName: 'X', quantity: 1 }),
    })
    const res21: any = await POST(req21 as any)
    expect(res21.status).toBe(429)
    const json = await res21.json()
    expect(json.error).toMatch(/Rate limit exceeded/)
  })
})

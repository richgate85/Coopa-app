import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '../app/api/cooperatives/register/route'

vi.mock('@/lib/firebase-admin', () => {
  return {
    verifyIdToken: vi.fn(async (token: string) => ({ uid: 'coop-admin' })),
    adminFirestore: {
      collection: (name: string) => ({
        add: async (payload: any) => ({
          id: 'coop1',
          get: async () => ({ data: () => payload }),
        }),
        doc: (id: string) => ({ set: async () => ({}) }),
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
  const map: Map<string, any> = (global as any)._inMemoryRateLimit
  if (map && typeof map.clear === 'function') map.clear()
})

describe('POST /api/cooperatives/register', () => {
  it('returns 401 when missing Authorization', async () => {
    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({}) })
    const res: any = await POST(req as any)
    expect(res.status).toBe(401)
  })

  it('returns 400 when name missing', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { Authorization: 'Bearer t' },
      body: JSON.stringify({}),
    })
    const res: any = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('creates cooperative and updates user role', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { Authorization: 'Bearer t' },
      body: JSON.stringify({ name: 'My Coop', address: '123' }),
    })
    const res: any = await POST(req as any)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.data.id).toBe('coop1')
  })

  it('enforces rate limit', async () => {
    const headers = { Authorization: 'Bearer t' }
    for (let i = 0; i < 5; i++) {
      const req = new Request('http://localhost', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: `C${i}` }),
      })
      const res: any = await POST(req as any)
      expect(res.status).toBe(200)
    }
    const req6 = new Request('http://localhost', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: 'C6' }),
    })
    const res6: any = await POST(req6 as any)
    expect(res6.status).toBe(429)
  })
})

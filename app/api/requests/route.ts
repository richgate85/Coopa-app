import { NextResponse } from 'next/server'
import { verifyIdToken, adminFirestore, adminSdk } from '@/lib/firebase-admin'
import { isAllowed } from '@/lib/rate-limiter'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const match = authHeader.match(/^Bearer (.*)$/)
    if (!match) return NextResponse.json({ error: 'Missing Authorization' }, { status: 401 })
    const idToken = match[1]

    // If Admin SDK isn't configured, return 503 early—server cannot verify tokens.
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Firebase Admin SDK not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY.' }, { status: 503 })
    }

    const decoded = await verifyIdToken(idToken)
    const body = await req.json()

    // basic validation
    if (!body || typeof body.itemName !== 'string' || !body.itemName.trim()) {
      return NextResponse.json({ error: 'itemName is required' }, { status: 400 })
    }

    const quantity = Number(body.quantity || 1)
    if (!Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json({ error: 'quantity must be a positive number' }, { status: 400 })
    }

    if (body.targetPrice != null && isNaN(Number(body.targetPrice))) {
      return NextResponse.json({ error: 'targetPrice must be a number' }, { status: 400 })
    }

    if (!adminFirestore) {
      // Admin SDK not configured (local dev). Return a clear 503 so callers can
      // distinguish between a server config issue and an application error.
      return NextResponse.json({ error: 'Firebase Admin SDK not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY.' }, { status: 503 })
    }

    // rate limit: max 20 requests per minute (uses Redis if REDIS_URL set, else in-memory)
    const uid = decoded.uid
    const bucketKey = `requests:${uid}`
    const allowed = await isAllowed(bucketKey, 20, 60_000)
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const payload: any = {
      itemName: body.itemName.trim(),
      quantity,
      targetPrice: body.targetPrice != null ? Number(body.targetPrice) : null,
      coopId: body.coopId || null,
      createdBy: uid,
      createdAt: adminSdk.firestore.FieldValue.serverTimestamp(),
    }

    const ref = await adminFirestore.collection('requests').add(payload)
    const snap = await ref.get()
    return NextResponse.json({ ok: true, data: { id: ref.id, ...(snap.data() || {}) } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

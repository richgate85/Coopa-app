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

    if (!body || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: 'Cooperative name is required' }, { status: 400 })
    }

    if (!adminFirestore) {
      return NextResponse.json({ error: 'Firebase Admin SDK not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY.' }, { status: 503 })
    }

    // rate limit for register attempts: max 5 per 10 minutes
    const uid = decoded.uid
    const bucketKey = `coop-register:${uid}`
    const allowed = await isAllowed(bucketKey, 5, 10 * 60_000)
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const payload: any = {
      name: body.name.trim(),
      address: body.address || null,
      adminId: decoded.uid,
      status: 'pending',
      createdAt: adminSdk.firestore.FieldValue.serverTimestamp(),
    }
    const ref = await adminFirestore.collection('cooperatives').add(payload)
    // update user doc to coop_admin and link coop
    await adminFirestore.collection('users').doc(decoded.uid).set({ coopId: ref.id, role: 'coop_admin' }, { merge: true })

    const snap = await ref.get()
    return NextResponse.json({ ok: true, data: { id: ref.id, ...(snap.data() || {}) } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

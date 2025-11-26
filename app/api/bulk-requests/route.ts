import { NextResponse } from 'next/server'
import { verifyIdToken, adminFirestore, adminSdk } from '@/lib/firebase-admin'

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

    // Use Admin Firestore to write the request server-side
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Firebase Admin SDK not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY.' }, { status: 503 })
    }
    const payload: any = {
      coopId: body.coopId || null,
      createdBy: decoded.uid,
      itemName: body.itemName,
      quantity: Number(body.quantity) || 1,
      targetPrice: body.targetPrice || null,
      createdAt: adminSdk.firestore.FieldValue.serverTimestamp(),
    }
    const ref = await adminFirestore.collection('requests').add(payload)
    const snap = await ref.get()
    return NextResponse.json({ ok: true, data: { id: ref.id, ...(snap.data() || {}) } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

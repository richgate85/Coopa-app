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

    // Check user's role
    const userDoc = await adminFirestore.collection('users').doc(decoded.uid).get()
    const profile = userDoc.exists ? (userDoc.data() as any) : null
    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const coopId = body.coopId
    const action = body.action // 'approve' | 'reject'
    if (!coopId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const status = action === 'approve' ? 'approved' : 'rejected'

    const ref = adminFirestore.collection('cooperatives').doc(coopId)
    await ref.update({ status })
    if (status === 'approved') {
      // optionally set approvedAt
      await ref.update({ approvedAt: adminSdk.firestore.FieldValue.serverTimestamp() })
    }
    const snap = await ref.get()
    return NextResponse.json({ ok: true, data: { id: snap.id, ...(snap.data() || {}) } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

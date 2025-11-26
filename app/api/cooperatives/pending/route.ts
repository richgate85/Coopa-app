import { NextResponse } from 'next/server'
import { verifyIdToken, adminFirestore } from '@/lib/firebase-admin'

export async function GET(req: Request) {
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

    // Check user's role from server-side users collection
    const userDoc = await adminFirestore.collection('users').doc(decoded.uid).get()
    const profile = userDoc.exists ? (userDoc.data() as any) : null
    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Query pending cooperatives
    const q = adminFirestore.collection('cooperatives').where('status', '==', 'pending')
    const snap = await q.get()
  const pending = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) }))

    return NextResponse.json({ ok: true, data: pending })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

import { db } from './firebase.js'
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'

/**
 * Firestore service helpers for users, cooperatives and requests.
 * Keep logic central here so UI and API routes can reuse.
 */

export type UserProfile = {
  uid: string
  displayName?: string
  email?: string
  photoURL?: string
  role: 'super_admin' | 'coop_admin' | 'member' | 'invited'
  coopId?: string | null
  createdAt?: any
}

export type Cooperative = {
  id?: string
  name: string
  address?: string
  adminId: string
  status?: 'pending' | 'approved' | 'rejected'
  createdAt?: any
}

export type BulkRequest = {
  id?: string
  coopId?: string | null
  createdBy: string
  itemName: string
  quantity: number
  targetPrice?: number
  createdAt?: any
}

const usersCol = collection(db, 'users')
const coopsCol = collection(db, 'cooperatives')
const requestsCol = collection(db, 'requests')

export async function createUserProfile(profile: UserProfile) {
  if (!profile.uid) throw new Error('uid required')
  const ref = doc(usersCol, profile.uid)
  const payload = {
    ...profile,
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, payload, { merge: true })
  return { id: profile.uid, ...payload }
}

export async function getUserProfile(uid: string) {
  const ref = doc(usersCol, uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { uid: snap.id, ...(snap.data() as any) }
}

export async function createCooperative(coop: Cooperative) {
  const payload = {
    name: coop.name,
    address: coop.address || null,
    adminId: coop.adminId,
    status: coop.status || 'pending',
    createdAt: serverTimestamp(),
  }
  const docRef = await addDoc(coopsCol, payload)
  return { id: docRef.id, ...payload }
}

export async function listPendingCooperatives() {
  const q = query(coopsCol, where('status', '==', 'pending'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
}

export async function updateCooperativeStatus(coopId: string, status: 'approved' | 'rejected') {
  const ref = doc(coopsCol, coopId)
  await updateDoc(ref, { status })
  const snap = await getDoc(ref)
  return { id: snap.id, ...(snap.data() as any) }
}

export async function createBulkRequest(request: BulkRequest) {
  const payload = {
    coopId: request.coopId || null,
    createdBy: request.createdBy,
    itemName: request.itemName,
    quantity: request.quantity,
    targetPrice: request.targetPrice || null,
    createdAt: serverTimestamp(),
  }
  const ref = await addDoc(requestsCol, payload)
  return { id: ref.id, ...payload }
}

export async function listRequestsByCoop(coopId: string) {
  const q = query(requestsCol, where('coopId', '==', coopId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
}

export async function inviteMember(email: string, displayName: string, coopId: string, invitedBy: string) {
  // This creates a user document with role 'invited'. Actual sign-up flow should be
  // handled via Firebase Auth; this record can be used to track invites.
  const id = email.toLowerCase()
  const payload: any = {
    uid: id,
    email,
    displayName,
    role: 'invited',
    coopId,
    invitedBy,
    createdAt: serverTimestamp(),
  }
  const ref = doc(usersCol, id)
  await setDoc(ref, payload, { merge: true })
  return { id, ...payload }
}

export async function addMemberToCoop(uid: string, coopId: string, role: 'member' | 'coop_admin' = 'member') {
  const ref = doc(usersCol, uid)
  await setDoc(ref, { coopId, role }, { merge: true })
  const snap = await getDoc(ref)
  return { uid: snap.id, ...(snap.data() as any) }
}

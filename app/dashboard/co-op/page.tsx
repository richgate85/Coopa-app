"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAuthClient } from '@/lib/firebase.js'

export default function MyCoopPage() {
  const [hasCoop, setHasCoop] = useState<boolean | null>(null)

  useEffect(() => {
    // best-effort: try to read currentUser and see if profile indicates coop
    const check = async () => {
      try {
        const auth = getAuthClient()
        if (!auth || !auth.currentUser) {
          setHasCoop(false)
          return
        }
        const token = await auth.currentUser.getIdToken(true)
        // we don't have a /api/me endpoint, so rely on client profile stored in Firestore is not fetched here.
        // For now, navigate users to register page to continue.
        // A future improvement: fetch /api/users/me to get real coopId.
        setHasCoop(false)
      } catch (err) {
        setHasCoop(false)
      }
    }
    check()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold mb-4">My Co‑op</h1>
        <p className="text-gray-600 mb-6">This is your cooperative area. If you haven't created or joined a co‑op yet, register one below.</p>

        {hasCoop === null && <div>Checking account...</div>}

        {hasCoop === false && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <p>You don't appear to be part of a cooperative yet.</p>
            <div className="flex gap-3">
              <Link href="/dashboard/co-op/register" className="px-5 py-2 bg-[#22A65B] text-white rounded">Register a Co‑op</Link>
              <Link href="/opportunities" className="px-5 py-2 border rounded">Browse opportunities</Link>
            </div>
          </div>
        )}

        {hasCoop === true && (
          <div className="bg-white p-6 rounded shadow">
            <p>Loading your cooperative...</p>
          </div>
        )}
      </div>
    </div>
  )
}

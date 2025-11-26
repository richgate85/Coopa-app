"use client"

import React, { useEffect, useState } from 'react'
import { getAuthClient } from '@/lib/firebase.js'

type Coop = { id: string; name: string; address?: string }

export default function AdminApprovalsPage() {
  const [pending, setPending] = useState<Coop[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  const fetchPending = async () => {
    setLoading(true)
    setError(null)
    setAccessDenied(false)
    try {
      const auth = getAuthClient()
      if (!auth || !auth.currentUser) {
        setAccessDenied(true)
        return
      }
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('/api/cooperatives/pending', {
        headers: { authorization: `Bearer ${token}` },
      })
      const payload = await res.json().catch(() => ({}))
      if (res.status === 401 || res.status === 403) {
        setAccessDenied(true)
        return
      }
      if (!res.ok) throw new Error(payload?.error || 'Failed to load')
      setPending(payload.data || [])
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // fetch pending when component mounts
    fetchPending()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const takeAction = async (coopId: string, action: 'approve' | 'reject') => {
    setError(null)
    setProcessingIds((s) => new Set(s).add(coopId))
    try {
      const auth = getAuthClient()
      if (!auth || !auth.currentUser) throw new Error('Not authenticated')
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('/api/cooperatives/approve', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ coopId, action }),
      })
      const payload = await res.json().catch(() => ({}))
      if (res.status === 401 || res.status === 403) {
        setAccessDenied(true)
        return
      }
      if (!res.ok) throw new Error(payload?.error || 'Action failed')
      // refresh list
      await fetchPending()
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setProcessingIds((s) => {
        const n = new Set(s)
        n.delete(coopId)
        return n
      })
    }
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Access denied</h2>
          <p className="text-gray-600">You must be a Super Admin to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold mb-6">Pending Cooperative Approvals</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="space-y-4">
          {pending.length === 0 && !loading && <div>No pending cooperatives</div>}
          {pending.map((c) => {
            const processing = processingIds.has(c.id)
            return (
              <div key={c.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.address}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => takeAction(c.id, 'approve')}
                    className="px-4 py-2 bg-[#22A65B] text-white rounded"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Approve'}
                  </button>
                  <button onClick={() => takeAction(c.id, 'reject')} className="px-4 py-2 border rounded" disabled={processing}>
                    {processing ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

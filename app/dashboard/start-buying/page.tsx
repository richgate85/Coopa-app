"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { getAuthClient } from '@/lib/firebase.js'
import { useToast } from '@/hooks/use-toast'

export default function StartBuyingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState<number | ''>('')
  const [targetPrice, setTargetPrice] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const auth = getAuthClient()
      if (!auth || !auth.currentUser) throw new Error('Not authenticated')
      const token = await auth.currentUser.getIdToken()

      const body = {
        itemName,
        quantity: Number(quantity),
        targetPrice: Number(targetPrice),
        description,
      }

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.error || 'Failed to create request')

      toast({ title: 'Request posted', description: 'Your bulk buy request was posted.' })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-6">Start Buying in Bulk</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          {error && <div className="text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <Input value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <Input type="number" value={quantity as any} onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Price</label>
            <Input type="number" step="0.01" value={targetPrice as any} onChange={(e) => setTargetPrice(e.target.value === '' ? '' : Number(e.target.value))} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-[#22A65B]" disabled={loading}>
              {loading ? 'Posting...' : 'Post Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthClient } from '@/lib/firebase.js'

export default function StartBuyingPage() {
  const router = useRouter()
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [targetPrice, setTargetPrice] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const auth = getAuthClient()
      if (!auth || !auth.currentUser) throw new Error('Not authenticated')
      const token = await auth.currentUser.getIdToken()

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({
          itemName: itemName.trim(),
          quantity: Number(quantity) || 1,
          targetPrice: targetPrice ? Number(targetPrice) : undefined,
          description: description || null,
        }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload?.error || 'Failed to create request')
      }

      setSuccess('Request created — redirecting to dashboard...')
      setTimeout(() => router.push('/dashboard'), 800)
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold mb-4">Create Bulk Request</h1>
        <p className="text-gray-600 mb-6">Create a request to start a bulk purchase opportunity.</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full mt-1 p-3 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-48 mt-1 p-3 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Price (optional)</label>
            <input value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} className="w-48 mt-1 p-3 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-3 border rounded min-h-[100px]" />
          </div>

          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}

          <div className="flex justify-end">
            <button disabled={isLoading} className="px-6 py-2 bg-[#22A65B] text-white rounded">
              {isLoading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

// import React, { useState } from 'react'
// import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
// import { getAuthClient } from '@/lib/firebase.js'
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

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthClient } from '@/lib/firebase.js'



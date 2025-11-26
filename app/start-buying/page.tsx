import Link from 'next/link'

export default function StartBuyingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20">
      <div className="max-w-2xl w-full bg-white p-10 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Start Buying in Bulk</h1>
        <p className="text-gray-600 mb-6">Create a bulk purchase request to invite cooperatives to join your order.</p>
        <div className="flex gap-4">
          <Link href="/post-request" className="px-6 py-3 bg-[#22A65B] text-white rounded-md">Create Request</Link>
          <Link href="/dashboard/co-op/register" className="px-6 py-3 border rounded-md">Register a Cooperative</Link>
        </div>
      </div>
    </div>
  )
}

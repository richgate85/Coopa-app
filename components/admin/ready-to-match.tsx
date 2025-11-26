"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Droplet } from "lucide-react"

interface ReadyToMatchProps {
  onMatchClick: (request: any) => void
}

const requests = [
  {
    id: 1,
    name: "Rice - 50kg Bags",
    icon: Package,
    coops: 5,
    quantity: 400,
    value: "₦14.4M",
    deadline: "2 days",
    progress: 80,
    minReached: true,
  },
  {
    id: 2,
    name: "Cooking Oil - 25L Drums",
    icon: Droplet,
    coops: 3,
    quantity: 90,
    value: "₦2.25M",
    deadline: "5 days",
    progress: 112,
    minReached: true,
  },
]

export default function ReadyToMatch({ onMatchClick }: ReadyToMatchProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Ready for Supplier Matching</h2>
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{requests.length} requests</Badge>
      </div>
      <p className="text-gray-600 text-sm mb-6">These requests have reached minimum quantity</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request) => {
          const Icon = request.icon
          return (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow border-l-4 border-green-600 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Icon size={24} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{request.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span>{request.coops} co-ops</span>
                    <span>•</span>
                    <span>{request.quantity} units</span>
                    <span>•</span>
                    <span>{request.value}</span>
                    <span>•</span>
                    <span className="text-amber-600 font-medium">Deadline: {request.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    {request.quantity}/{request.progress > 100 ? request.quantity : 500} units
                  </span>
                  {request.minReached && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">✓ Min. qty reached</Badge>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min(request.progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              <Button
                onClick={() => onMatchClick(request)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Match with Supplier →
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

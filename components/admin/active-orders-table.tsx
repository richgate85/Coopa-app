"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "#ORD-042",
    item: "Rice (400 bags)",
    coops: 5,
    value: "₦14.4M",
    status: "Payment Collecting",
    statusColor: "bg-amber-100 text-amber-800",
    actions: ["View", "Email Co-ops"],
  },
  {
    id: "#ORD-041",
    item: "Palm Oil (120 drums)",
    coops: 3,
    value: "₦3.2M",
    status: "In Transit",
    statusColor: "bg-blue-100 text-blue-800",
    actions: ["Track Shipment", "Email"],
  },
  {
    id: "#ORD-040",
    item: "Fertilizer (950 bags)",
    coops: 7,
    value: "₦8.1M",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-800",
    actions: ["Close Order", "View Report"],
  },
  {
    id: "#ORD-039",
    item: "Cement (600 bags)",
    coops: 4,
    value: "₦2.7M",
    status: "Payment Collecting",
    statusColor: "bg-amber-100 text-amber-800",
    actions: ["View", "Remind"],
  },
  {
    id: "#ORD-038",
    item: "Garri (2000 bags)",
    coops: 6,
    value: "₦12M",
    status: "Paid - Awaiting Supplier",
    statusColor: "bg-green-100 text-green-800",
    actions: ["Contact Supplier"],
  },
]

export default function ActiveOrdersTable() {
  const [sortBy, setSortBy] = useState("recent")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Active Orders</h2>
          <Badge className="mt-2 bg-gray-100 text-gray-800 hover:bg-gray-100">{orders.length} orders</Badge>
        </div>
        <button className="text-green-600 hover:text-green-700 font-medium text-sm">View All Orders →</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Item & Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Co-ops
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.coops} co-ops</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${order.statusColor} hover:${order.statusColor}`}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {order.actions.map((action) => (
                        <button key={action} className="text-green-600 hover:text-green-700 font-medium text-xs">
                          {action}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

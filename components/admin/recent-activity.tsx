"use client"

import { Users, UserPlus, Package, CheckCircle } from "lucide-react"

const activities = [
  {
    time: "5 mins ago",
    message: "Unity Co-op joined Rice request",
    icon: Users,
  },
  {
    time: "2 hours ago",
    message: "Payment confirmed for Order #ORD-040",
    icon: CheckCircle,
  },
  {
    time: "Today",
    message: "New supplier registered - Fresh Foods Ltd",
    icon: UserPlus,
  },
  {
    time: "Yesterday",
    message: "Order #ORD-038 shipped",
    icon: Package,
  },
]

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                  <Icon size={20} className="text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
      <button className="mt-6 text-green-600 hover:text-green-700 font-medium text-sm">View All Activity →</button>
    </div>
  )
}

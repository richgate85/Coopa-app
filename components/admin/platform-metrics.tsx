"use client"

import { TrendingUp, DollarSign, Building2, CheckCircle } from "lucide-react"

const metrics = [
  {
    title: "Active Requests",
    value: "12",
    trend: "↑ 3 this week",
    icon: TrendingUp,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Total Value in Pipeline",
    value: "₦45.2M",
    trend: "↑ ₦8M this month",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Active Cooperatives",
    value: "38",
    trend: "5 new this month",
    icon: Building2,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Successful Completion Rate",
    value: "87%",
    trend: "↑ 5% vs last month",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  },
]

export default function PlatformMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div key={metric.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                <p className="text-green-600 text-sm font-medium mt-2">{metric.trend}</p>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

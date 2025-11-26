import type React from "react"
import { ShoppingCart, ShoppingBag, Clock, Users, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  number: string
  label: string
  subtext: React.ReactNode
  iconColor: string
}

function StatCard({ icon, number, label, subtext, iconColor }: StatCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900">{number}</p>
          <p className="text-gray-600 font-medium mt-1">{label}</p>
          <div className="mt-3">{subtext}</div>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>{icon}</div>
      </div>
    </Card>
  )
}

export function QuickStatsCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<ShoppingCart size={24} className="text-[#22A65B]" />}
        number="3"
        label="Active Purchases"
        subtext={
          <div className="flex items-center gap-1 text-sm text-[#22A65B] font-medium">
            <TrendingUp size={16} />↑ 2 this week
          </div>
        }
        iconColor="bg-green-50"
      />

      <StatCard
        icon={<ShoppingBag size={24} className="text-[#22A65B]" />}
        number="₦124,500"
        label="Bulk Purchase Value"
        subtext={
          <div className="inline-block px-2 py-1 bg-green-100 text-[#22A65B] text-xs font-semibold rounded-full">
            🎯 Wholesale prices accessed
          </div>
        }
        iconColor="bg-green-50"
      />

      <StatCard
        icon={<Clock size={24} className="text-[#F59E0B]" />}
        number="₦45,000"
        label="Pending Payments"
        subtext={
          <div className="inline-block px-2 py-1 bg-amber-100 text-[#F59E0B] text-xs font-semibold rounded-full">
            ⚠️ 2 overdue
          </div>
        }
        iconColor="bg-amber-50"
      />

      <StatCard
        icon={<Users size={24} className="text-[#22A65B]" />}
        number="18/25"
        label="Members Paid"
        subtext={
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#22A65B] h-2 rounded-full" style={{ width: "72%" }}></div>
            </div>
            <p className="text-xs text-gray-500">72% complete</p>
          </div>
        }
        iconColor="bg-green-50"
      />
    </div>
  )
}

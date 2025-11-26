import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface PurchaseCardProps {
  item: string
  status: "Active" | "Pending"
  details: string
  membersPaid: number
  totalMembers: number
}

function PurchaseCard({ item, status, details, membersPaid, totalMembers }: PurchaseCardProps) {
  const percentage = Math.round((membersPaid / totalMembers) * 100)
  const statusColor = status === "Active" ? "bg-green-100 text-[#22A65B]" : "bg-gray-100 text-gray-600"

  return (
    <Card className="p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{item}</h3>
          <p className="text-sm text-gray-600 mt-1">{details}</p>
        </div>
        <Badge className={`${statusColor} border-0`}>{status}</Badge>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {membersPaid}/{totalMembers} members paid
          </span>
          <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#22A65B] h-2 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 bg-transparent">
          View Details
        </Button>
        <Button className="flex-1 bg-[#22A65B] hover:bg-[#1B8A4A] text-white">Track Payments</Button>
      </div>
    </Card>
  )
}

export function ActivePurchases() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Active Purchases</h2>
        <a href="#" className="text-[#22A65B] hover:text-[#1B8A4A] font-medium flex items-center gap-1">
          View All <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PurchaseCard
          item="Rice - 50kg Bags"
          status="Active"
          details="100 bags committed • ₦36,000/bag • Closes in 3 days"
          membersPaid={18}
          totalMembers={25}
        />

        <PurchaseCard
          item="Cooking Oil - 25L Drums"
          status="Pending"
          details="30 drums committed • ₦25,000/drum • Waiting for others"
          membersPaid={8}
          totalMembers={25}
        />
      </div>
    </div>
  )
}

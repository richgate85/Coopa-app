import { DollarSign, CheckCircle, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Collected Card */}
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Collected</p>
            <p className="text-3xl font-bold text-gray-900">₦2,520,000</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign size={24} className="text-[#22A65B]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-[#22A65B]">70%</span>
          </div>
          <Progress value={70} className="h-2" />
        </div>
      </div>

      {/* Members Paid Card */}
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Members Paid</p>
            <p className="text-3xl font-bold text-gray-900">18/25</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle size={24} className="text-[#22A65B]" />
          </div>
        </div>
        <p className="text-sm text-gray-600">72% of members have paid</p>
      </div>

      {/* Overdue Payments Card */}
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Overdue Payments</p>
            <p className="text-3xl font-bold text-gray-900">2</p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <AlertTriangle size={24} className="text-[#F59E0B]" />
          </div>
        </div>
        <p className="text-sm text-gray-600">₦216,000 pending</p>
      </div>
    </div>
  )
}

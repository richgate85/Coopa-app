import { ChevronLeft, ShoppingCart } from "lucide-react"

export function PaymentTrackerHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <button className="flex items-center gap-1 text-[#22A65B] hover:text-[#1B8A4A] font-medium">
          <ChevronLeft size={20} />
          Back to Dashboard
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Payment Tracker</h1>
      <div className="flex items-center gap-2 text-gray-600">
        <ShoppingCart size={18} />
        <span>Rice - 50kg Bags • 100 bags committed • ₦3,600,000 total</span>
      </div>
    </div>
  )
}

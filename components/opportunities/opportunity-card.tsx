"use client"

import { MapPin, Clock } from "lucide-react"

interface OpportunityCardProps {
  opportunity: {
    id: number
    title: string
    image: string
    status: string
    category: string
    categoryIcon: string
    postedBy: string
    targetPrice: number
    retailPrice: number
    savings: number
    savingsPercent: number
    committed: number
    total: number
    coopsJoined: number
    closesIn: string
    isNew?: boolean
  }
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-[#22A65B] text-white"
      case "Almost Full":
        return "bg-[#F59E0B] text-white"
      case "In Progress":
        return "bg-[#3B82F6] text-white"
      case "Closed":
        return "bg-[#9CA3AF] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getCloseInColor = (closesIn: string) => {
    if (closesIn.includes("2 days") || closesIn.includes("1 day")) {
      return "text-[#F59E0B]"
    }
    return "text-gray-600"
  }

  const progressPercent = (opportunity.committed / opportunity.total) * 100

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={opportunity.image || "/placeholder.svg"}
          alt={opportunity.title}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(opportunity.status)}`}
        >
          {opportunity.status}
        </div>
        {/* New Badge */}
        {opportunity.isNew && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
            Just posted
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Tag */}
        <div className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
            {opportunity.categoryIcon} {opportunity.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{opportunity.title}</h3>

        {/* Posted By */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin size={16} />
          <span>{opportunity.postedBy}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Pricing Section */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-gray-900">₦{opportunity.targetPrice.toLocaleString()}</span>
            <span className="text-sm text-gray-500 line-through">₦{opportunity.retailPrice.toLocaleString()}</span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded px-2 py-1 inline-block">
            <span className="text-sm font-semibold text-[#22A65B]">
              💰 Save ₦{opportunity.savings.toLocaleString()} ({opportunity.savingsPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-[#22A65B] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            {opportunity.committed.toLocaleString()} of {opportunity.total.toLocaleString()} bags committed
          </p>

          {/* Co-ops and Time */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <span>🏢</span>
              <span className="font-medium">{opportunity.coopsJoined} co-ops joined</span>
            </div>
            <div className={`flex items-center gap-1 ${getCloseInColor(opportunity.closesIn)}`}>
              <Clock size={16} />
              <span className="font-medium">⏰ {opportunity.closesIn}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            View Details
          </button>
          <button
            disabled={opportunity.status === "Closed"}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              opportunity.status === "Closed"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#22A65B] text-white hover:bg-[#1B8A4A]"
            }`}
          >
            Join Purchase →
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PlatformAdminApprovalCardProps {
  escrowId: string
  requestName: string
  coopName: string
  totalAmount: number
  collectedAmount: number
  moniePointBalance: number
  groupAdminName: string
  onApprove: () => void
  onFlag: () => void
}

export default function PlatformAdminApprovalCard({
  escrowId,
  requestName,
  coopName,
  totalAmount,
  collectedAmount,
  moniePointBalance,
  groupAdminName,
  onApprove,
  onFlag,
}: PlatformAdminApprovalCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const balanceMatches = moniePointBalance >= collectedAmount

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await onApprove()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 border-2 border-[#22A65B]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{requestName}</h3>
          <p className="text-sm text-gray-600">Co-op: {coopName}</p>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-[#F59E0B] text-xs font-bold rounded-full">Pending Review</span>
      </div>

      {/* Request Details */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">₦{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Amount Collected</p>
          <p className="text-2xl font-bold text-[#22A65B]">₦{collectedAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Balance Verification */}
      <div
        className={`rounded-lg p-4 mb-6 flex gap-3 ${balanceMatches ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
      >
        {balanceMatches ? (
          <CheckCircle2 size={20} className="text-[#22A65B] flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className="font-medium text-gray-900">Moniepoint Balance Verification</p>
          <p className="text-sm text-gray-700">
            Balance: ₦{moniePointBalance.toLocaleString()}{" "}
            {balanceMatches ? "✓ Matches collected amount" : "✗ Does not match"}
          </p>
        </div>
      </div>

      {/* Group Admin Approval */}
      <div className="bg-[#E8F5E9] rounded-lg p-4 mb-6 flex gap-3">
        <CheckCircle2 size={20} className="text-[#22A65B] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">Group Admin Approval</p>
          <p className="text-sm text-gray-700">Approved by {groupAdminName}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onFlag}
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2 border-amber-300 text-[#F59E0B] hover:bg-amber-50 bg-transparent"
        >
          <Flag size={18} />
          Flag for Review
        </Button>
        <Button
          onClick={handleApprove}
          disabled={!balanceMatches || isLoading}
          className="flex-1 bg-[#22A65B] hover:bg-[#1B8A4A] text-white disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? "Processing..." : "Approve & Release"}
        </Button>
      </div>
    </Card>
  )
}

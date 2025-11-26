"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface Deposit {
  memberId: string
  memberName: string
  amount: number
  verified: boolean
  timestamp: string
}

interface GroupAdminApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
  deposits: Deposit[]
  totalAmount: number
  collectedAmount: number
}

export default function GroupAdminApprovalModal({
  isOpen,
  onClose,
  onApprove,
  deposits,
  totalAmount,
  collectedAmount,
}: GroupAdminApprovalModalProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const verifiedCount = deposits.filter((d) => d.verified).length
  const percentage = (collectedAmount / totalAmount) * 100

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await onApprove()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Approve Payment Release</h2>

          {/* Summary */}
          <div className="bg-[#E8F5E9] rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600">Members Paid</p>
                <p className="text-2xl font-bold text-[#22A65B]">{verifiedCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Amount Collected</p>
                <p className="text-2xl font-bold text-[#22A65B]">₦{collectedAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-[#22A65B]">{percentage.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          {/* Deposits Table */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Payment Verification</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {deposits.map((deposit) => (
                <div key={deposit.memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {deposit.verified ? (
                      <CheckCircle2 size={20} className="text-[#22A65B]" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{deposit.memberName}</p>
                      <p className="text-xs text-gray-600">{deposit.timestamp}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">₦{deposit.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle size={20} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Important</p>
              <p className="text-sm text-gray-700">
                This action cannot be undone. Ensure all payments are verified before approving.
              </p>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <Checkbox id="confirm" checked={confirmed} onCheckedChange={(c) => setConfirmed(c === true)} />
            <label htmlFor="confirm" className="text-sm font-medium text-gray-900 cursor-pointer">
              I confirm all verified payments are correct and ready for platform admin review
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={!confirmed || isLoading}
              className="flex-1 bg-[#22A65B] hover:bg-[#1B8A4A] text-white disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Approve & Send for Review"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

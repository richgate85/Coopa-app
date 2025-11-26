"use client"

import { useState } from "react"
import { Copy, Share2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PaymentCollectionCardProps {
  escrowId: string
  accountNumber: string
  accountName: string
  bankName: string
  totalAmount: number
  collectedAmount: number
  memberCount: number
}

export default function PaymentCollectionCard({
  escrowId,
  accountNumber,
  accountName,
  bankName,
  totalAmount,
  collectedAmount,
  memberCount,
}: PaymentCollectionCardProps) {
  const [copied, setCopied] = useState(false)
  const amountPerMember = totalAmount / memberCount
  const progress = (collectedAmount / totalAmount) * 100

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaWhatsApp = () => {
    const message = `Coopa Payment Details:\n\nAccount Name: ${accountName}\nAccount Number: ${accountNumber}\nBank: ${bankName}\nAmount: ₦${amountPerMember.toLocaleString()}\n\nPlease transfer your share to complete the bulk purchase.`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank")
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-[#E8F5E9] to-white border-2 border-[#22A65B]">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Collection</h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Collection Progress</span>
          <span className="text-sm font-bold text-[#22A65B]">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-[#22A65B] h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          ₦{collectedAmount.toLocaleString()} of ₦{totalAmount.toLocaleString()} collected
        </p>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
        <p className="text-xs text-gray-600 mb-2">Account Name</p>
        <p className="text-lg font-bold text-gray-900 mb-4">{accountName}</p>

        <p className="text-xs text-gray-600 mb-2">Account Number</p>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-2xl font-mono font-bold text-[#22A65B]">{accountNumber}</p>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Copy account number"
          >
            <Copy size={18} className="text-gray-600" />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-2">Bank</p>
        <p className="text-sm font-medium text-gray-900">{bankName}</p>
      </div>

      {/* Amount Per Member */}
      <div className="bg-[#22A65B]/10 rounded-lg p-4 mb-6">
        <p className="text-xs text-gray-600 mb-1">Your Share</p>
        <p className="text-3xl font-bold text-[#22A65B]">₦{amountPerMember.toLocaleString()}</p>
        <p className="text-xs text-gray-600 mt-2">{memberCount} members participating</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={shareViaWhatsApp}
          className="flex-1 bg-[#22A65B] hover:bg-[#1B8A4A] text-white flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          Share via WhatsApp
        </Button>
        <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 bg-transparent">
          <QrCode size={18} />
          QR Code
        </Button>
      </div>

      {copied && <p className="text-xs text-[#22A65B] font-medium mt-3 text-center">Copied to clipboard!</p>}
    </Card>
  )
}

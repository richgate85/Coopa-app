"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface JoinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinModal({ open, onOpenChange }: JoinModalProps) {
  const [quantity, setQuantity] = useState("")
  const [phone, setPhone] = useState("0803 456 7890")
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const unitPrice = 36000
  const retailPrice = 45000
  const savingsPerBag = retailPrice - unitPrice

  const quantityNum = Number.parseInt(quantity) || 0
  const totalCost = quantityNum * unitPrice
  const totalSavings = quantityNum * savingsPerBag

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!quantity || quantityNum <= 0) {
      newErrors.quantity = "Quantity must be greater than 0"
    }
    if (quantityNum > 100) {
      newErrors.quantity = "Cannot exceed available quantity (100 bags)"
    }
    if (!phone || !/^\d{10,}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }
    if (!confirmed) {
      newErrors.confirmed = "You must confirm the commitment"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", { quantity: quantityNum, phone, confirmed })
      onOpenChange(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Join: Rice - 50kg Bags</h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              How many bags does your co-op need? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="Enter quantity (e.g., 100)"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value)
                  if (errors.quantity) {
                    setErrors({ ...errors, quantity: "" })
                  }
                }}
                className={`text-lg py-3 pr-16 ${errors.quantity ? "border-red-500" : ""}`}
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                bags
              </span>
            </div>
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          {/* Pre-filled Info */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 uppercase font-bold">Your Co-op</label>
              <div className="bg-gray-100 px-3 py-2 rounded text-gray-700 text-sm">Unity Cooperative Society</div>
            </div>
            <div>
              <label className="text-xs text-gray-600 uppercase font-bold">Contact</label>
              <div className="bg-gray-100 px-3 py-2 rounded text-gray-700 text-sm">Adewale Johnson</div>
            </div>
            <div>
              <label className="text-xs text-gray-600 uppercase font-bold">
                Phone <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (errors.phone) {
                    setErrors({ ...errors, phone: "" })
                  }
                }}
                className={`text-sm ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Live Summary */}
          <div className="bg-green-50 border-2 border-[#22A65B] rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Quantity:</span>
              <span className="font-bold text-gray-900">{quantityNum} bags</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Unit Price:</span>
              <span className="font-bold text-gray-900">₦{unitPrice.toLocaleString()}</span>
            </div>
            <div className="border-t border-[#22A65B] pt-2 flex justify-between text-sm">
              <span className="text-gray-700">Total Cost:</span>
              <span className="font-bold text-gray-900">₦{totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Total Savings:</span>
              <span className="font-bold text-[#22A65B]">₦{totalSavings.toLocaleString()}</span>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => {
                setConfirmed(checked as boolean)
                if (errors.confirmed) {
                  setErrors({ ...errors, confirmed: "" })
                }
              }}
              className="mt-1"
            />
            <label htmlFor="confirm" className="text-sm text-gray-700 cursor-pointer">
              I confirm our co-op can commit to this purchase and collect payment from members
            </label>
          </div>
          {errors.confirmed && <p className="text-red-500 text-sm">{errors.confirmed}</p>}
          <p className="text-xs text-gray-600">You'll be able to track member payments after joining</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!confirmed || !quantity}
            className="flex-1 bg-[#22A65B] hover:bg-[#1B8A4A] text-white font-bold"
          >
            Confirm Commitment →
          </Button>
        </div>
      </div>
    </div>
  )
}

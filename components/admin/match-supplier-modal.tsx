"use client"

import { useState } from "react"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MatchSupplierModalProps {
  isOpen: boolean
  onClose: () => void
  request: any
}

export default function MatchSupplierModal({ isOpen, onClose, request }: MatchSupplierModalProps) {
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [unitPrice, setUnitPrice] = useState("36000")
  const [deliveryDate, setDeliveryDate] = useState("2025-11-05")
  const [location, setLocation] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("50-50")
  const [instructions, setInstructions] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !request) return null

  const suppliers = [
    { id: 1, name: "ABC Wholesale Ltd", location: "Lagos", specialty: "Rice specialist" },
    { id: 2, name: "XYZ Grains Supply", location: "Kano", specialty: "Grains" },
    { id: 3, name: "Premium Foods Co.", location: "Ogun", specialty: "Premium foods" },
  ]

  const selectedSupplierData = suppliers.find((s) => s.id === Number.parseInt(selectedSupplier))
  const totalValue = Number.parseInt(unitPrice.replace(/,/g, "")) * request.quantity

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Match Request with Supplier</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Request Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-gray-900">Request Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Request</p>
                <p className="font-medium text-gray-900">{request.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Quantity</p>
                <p className="font-medium text-gray-900">{request.quantity} units</p>
              </div>
              <div>
                <p className="text-gray-600">Participating Co-ops</p>
                <p className="font-medium text-gray-900">{request.coops}</p>
              </div>
              <div>
                <p className="text-gray-600">Combined Value</p>
                <p className="font-medium text-gray-900">{request.value}</p>
              </div>
            </div>
          </div>

          {/* Select Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Select Supplier*</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            >
              <option value="">Search suppliers...</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.location}) - {supplier.specialty}
                </option>
              ))}
            </select>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium mt-2">+ Add New Supplier</button>
          </div>

          {/* Supplier Info */}
          {selectedSupplierData && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contact:</span> 0803-456-7890
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> sales@abcwholesale.com
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Rating:</span> ⭐⭐⭐⭐⭐ (5 stars)
              </p>
            </div>
          )}

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Final Unit Price*</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">₦</span>
              <input
                type="text"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <span className="text-gray-600">per unit</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">Original target: ₦36,000</p>
            <p className="text-sm font-bold text-gray-900 mt-2">Total order value: ₦{totalValue.toLocaleString()}</p>
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Expected Delivery Date*</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Delivery/Pickup Location*</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., ABC Warehouse, 15 Ikeja Way, Lagos"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Payment Terms*</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="full"
                  checked={paymentTerms === "full"}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Full Payment Upfront</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="50-50"
                  checked={paymentTerms === "50-50"}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">50% Deposit, 50% on Delivery</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="custom"
                  checked={paymentTerms === "custom"}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Custom</span>
              </label>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Special Instructions (Optional)</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any special delivery notes, quality requirements, etc..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-2">This action will:</p>
              <ul className="space-y-1 text-xs">
                <li>• Email all {request.coops} participating co-ops with final pricing</li>
                <li>• Generate Purchase Order PDF for supplier</li>
                <li>• Lock the request (no new co-ops can join)</li>
                <li>• Enable payment collection tracking</li>
                <li>• Update request status to 'In Progress'</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedSupplier}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Processing..." : "Confirm Match & Send Emails →"}
          </Button>
        </div>
      </div>
    </div>
  )
}

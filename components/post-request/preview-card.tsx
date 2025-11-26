"use client"

interface PreviewCardProps {
  formData: Record<string, any>
  validationStates: Record<string, boolean | null>
}

export function PreviewCard({ formData, validationStates }: PreviewCardProps) {
  const calculateSavings = () => {
    if (!formData.targetPrice || !formData.retailPrice) return null
    const target = Number.parseFloat(formData.targetPrice)
    const retail = Number.parseFloat(formData.retailPrice)
    if (target <= 0 || retail <= 0) return null
    return {
      amount: retail - target,
      percentage: Math.round(((retail - target) / retail) * 100),
    }
  }

  const calculateDaysToClose = () => {
    if (!formData.deadline) return null
    const deadline = new Date(formData.deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft
  }

  const savings = calculateSavings()
  const daysToClose = calculateDaysToClose()
  const isComplete = validationStates.itemName === true && validationStates.category === true

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Preview</h3>
      <p className="text-gray-600 text-sm mb-6">How your request will appear:</p>

      {/* Preview Card */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        {/* Image Placeholder */}
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
          {formData.itemName ? (
            <span className="text-gray-500 text-sm">{formData.itemName}</span>
          ) : (
            <span className="text-gray-400 text-sm">Image preview</span>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          {/* Status Badge */}
          {isComplete && (
            <div className="flex gap-2">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Active
              </span>
              {formData.category && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {formData.category}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h4 className="font-bold text-gray-900 text-sm">{formData.itemName || "Item name will appear here"}</h4>

          {/* Posted By */}
          <p className="text-gray-600 text-xs">Posted by Unity Co-op, Lagos</p>

          {/* Pricing Section */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">Target Price:</span>
              <span className="font-bold text-gray-900 text-sm">
                {formData.targetPrice ? `₦${Number.parseFloat(formData.targetPrice).toLocaleString()}` : "—"}
              </span>
            </div>

            {formData.retailPrice && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">Retail Price:</span>
                <span className="text-gray-600 text-xs">
                  ₦{Number.parseFloat(formData.retailPrice).toLocaleString()}
                </span>
              </div>
            )}

            {savings && (
              <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                <p className="text-green-700 font-bold text-xs">
                  Save ₦{savings.amount.toLocaleString()} ({savings.percentage}%)
                </p>
              </div>
            )}
          </div>

          {/* Quantity Section */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-gray-600 text-xs">
              Seeking {formData.quantity || "—"} {formData.unit || "units"}
            </p>
          </div>

          {/* Timeline Section */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-gray-600 text-xs">
              {daysToClose ? `Closes in ${daysToClose} day${daysToClose !== 1 ? "s" : ""}` : "Closes in — days"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 opacity-50">
            <button className="flex-1 px-3 py-2 border border-gray-300 rounded text-gray-600 text-xs font-medium">
              View Details
            </button>
            <button className="flex-1 px-3 py-2 bg-gray-300 text-gray-600 rounded text-xs font-medium">Join Now</button>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-xs mt-4 text-center">This is how other cooperatives will see your request</p>
    </div>
  )
}

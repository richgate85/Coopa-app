"use client"

import { useState, type ChangeEvent } from "react"
import { Check, AlertCircle, Upload } from "lucide-react"

interface PostRequestFormProps {
  formData: Record<string, any>
  validationStates: Record<string, boolean | null>
  onFormChange: (field: string, value: string) => void
  onValidationChange: (field: string, state: boolean | null) => void
}

export function PostRequestForm({ formData, validationStates, onFormChange, onValidationChange }: PostRequestFormProps) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const validateField = (field: string, value: string) => {
    let isValid = null

    switch (field) {
      case "itemName":
        isValid = value.trim().length > 0 ? true : false
        break
      case "category":
        isValid = value.length > 0 ? true : false
        break
      case "description":
        isValid = value.trim().length > 0 ? true : false
        break
      case "quantity":
        isValid = value.length > 0 && Number.parseInt(value) > 0 ? true : false
        break
      case "targetPrice":
        isValid = value.length > 0 && Number.parseFloat(value) > 0 ? true : false
        break
      case "minimumQuantity":
        isValid = value.length > 0 && Number.parseInt(value) > 0 ? true : false
        break
      case "deadline":
        if (!value) {
          isValid = false
        } else {
          const selectedDate = new Date(value)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const minDate = new Date(today)
          minDate.setDate(minDate.getDate() + 3)
          isValid = selectedDate >= minDate ? true : false
        }
        break
      default:
        isValid = null
    }

    onValidationChange(field, isValid)
  }

  const handleChange = (field: string, value: string) => {
    onFormChange(field, value)
    validateField(field, value)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
    }
  }

  const getFieldBorderClass = (field: string) => {
    const state = validationStates[field]
    if (state === true) return "border-green-500 focus:ring-green-500"
    if (state === false) return "border-red-500 focus:ring-red-500"
    return "border-gray-300 focus:ring-[#22A65B]"
  }

  const getFieldBgClass = (field: string) => {
    const state = validationStates[field]
    if (state === true) return "bg-green-50"
    if (state === false) return "bg-red-50"
    return "bg-white"
  }

  const isFormValid = Object.values(validationStates).every((state) => state === true)

  return (
    <form className="space-y-8">
      {/* Section 1: Item Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Item Information</h2>
        </div>

        <div className="space-y-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Rice - 50kg Bags"
                value={formData.itemName}
                onChange={(e) => handleChange("itemName", e.target.value)}
                onBlur={() => validateField("itemName", formData.itemName)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${getFieldBorderClass("itemName")} ${getFieldBgClass("itemName")}`}
              />
              {validationStates.itemName === true && (
                <Check className="absolute right-3 top-3.5 text-green-500" size={20} />
              )}
              {validationStates.itemName === false && (
                <AlertCircle className="absolute right-3 top-3.5 text-red-500" size={20} />
              )}
            </div>
            {validationStates.itemName === false && <p className="text-red-500 text-sm mt-1">This field is required</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                onBlur={() => validateField("category", formData.category)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none appearance-none ${getFieldBorderClass("category")} ${getFieldBgClass("category")}`}
              >
                <option value="">Select a category</option>
                <option value="Food & Grains">Food & Grains</option>
                <option value="Cooking Supplies">Cooking Supplies</option>
                <option value="Agricultural Inputs">Agricultural Inputs</option>
                <option value="Equipment">Equipment</option>
                <option value="Household Items">Household Items</option>
              </select>
              {validationStates.category === true && (
                <Check className="absolute right-3 top-3.5 text-green-500 pointer-events-none" size={20} />
              )}
              {validationStates.category === false && (
                <AlertCircle className="absolute right-3 top-3.5 text-red-500 pointer-events-none" size={20} />
              )}
            </div>
            {validationStates.category === false && <p className="text-red-500 text-sm mt-1">This field is required</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                placeholder="Describe the specifications, quality, brand, and any specific requirements..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => validateField("description", formData.description)}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none resize-none ${getFieldBorderClass("description")} ${getFieldBgClass("description")}`}
              />
              {validationStates.description === true && (
                <Check className="absolute right-3 top-3 text-green-500" size={20} />
              )}
              {validationStates.description === false && (
                <AlertCircle className="absolute right-3 top-3 text-red-500" size={20} />
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">Be specific to help other co-ops understand what you need</p>
            {validationStates.description === false && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          {/* Upload Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Upload Photo (optional)</label>
            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#22A65B] hover:bg-green-50 transition-all">
              <div className="flex items-center gap-2">
                <Upload size={20} className="text-gray-600" />
                <span className="text-gray-700 font-medium">Choose File</span>
              </div>
              <input type="file" accept="image/jpeg,image/png" onChange={handleFileUpload} className="hidden" />
            </label>
            {uploadedFile && <p className="text-green-600 text-sm mt-1">✓ {uploadedFile}</p>}
            {!uploadedFile && <p className="text-gray-600 text-sm mt-1">No file chosen</p>}
            <p className="text-gray-500 text-xs mt-1">Max 5MB, JPG/PNG format</p>
          </div>
        </div>
      </div>

      {/* Section 2: Quantity & Pricing */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Quantity & Pricing</h2>
        </div>

        <div className="space-y-6">
          {/* Quantity Needed */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Quantity Needed <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  placeholder="100"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  onBlur={() => validateField("quantity", formData.quantity)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${getFieldBorderClass("quantity")} ${getFieldBgClass("quantity")}`}
                />
                {validationStates.quantity === true && (
                  <Check className="absolute right-3 top-3.5 text-green-500" size={20} />
                )}
                {validationStates.quantity === false && (
                  <AlertCircle className="absolute right-3 top-3.5 text-red-500" size={20} />
                )}
              </div>
              <select
                value={formData.unit}
                onChange={(e) => onFormChange("unit", e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#22A65B] focus:ring-[#22A65B] focus:outline-none"
              >
                <option>Bags</option>
                <option>Kg</option>
                <option>Liters</option>
                <option>Pieces</option>
                <option>Cartons</option>
                <option>Drums</option>
              </select>
            </div>
            {validationStates.quantity === false && <p className="text-red-500 text-sm mt-1">This field is required</p>}
          </div>

          {/* Target Unit Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Target Unit Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-600 font-medium">₦</span>
              <input
                type="text"
                placeholder="36,000"
                value={formData.targetPrice}
                onChange={(e) => handleChange("targetPrice", e.target.value)}
                onBlur={() => validateField("targetPrice", formData.targetPrice)}
                className={`w-full pl-8 pr-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${getFieldBorderClass("targetPrice")} ${getFieldBgClass("targetPrice")}`}
              />
              {validationStates.targetPrice === true && (
                <Check className="absolute right-3 top-3.5 text-green-500" size={20} />
              )}
              {validationStates.targetPrice === false && (
                <AlertCircle className="absolute right-3 top-3.5 text-red-500" size={20} />
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">The price per unit you're aiming for</p>
            {validationStates.targetPrice === false && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          {/* Typical Retail Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Typical Retail Price (optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-600 font-medium">₦</span>
              <input
                type="text"
                placeholder="45,000"
                value={formData.retailPrice}
                onChange={(e) => onFormChange("retailPrice", e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#22A65B] focus:ring-[#22A65B] focus:outline-none"
              />
            </div>
            <p className="text-gray-600 text-sm mt-1">💡 This helps show potential savings to other co-ops</p>

            {/* Savings Calculation */}
            {formData.targetPrice &&
              formData.retailPrice &&
              Number.parseFloat(formData.targetPrice) > 0 &&
              Number.parseFloat(formData.retailPrice) > 0 && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium text-sm">
                    ✓ Potential savings: ₦
                    {(
                      Number.parseFloat(formData.retailPrice) - Number.parseFloat(formData.targetPrice)
                    ).toLocaleString()}{" "}
                    per {formData.unit.toLowerCase()} (
                    {Math.round(
                      ((Number.parseFloat(formData.retailPrice) - Number.parseFloat(formData.targetPrice)) /
                        Number.parseFloat(formData.retailPrice)) *
                        100,
                    )}
                    %)
                  </p>
                </div>
              )}
          </div>

          {/* Minimum Order Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Minimum Order Quantity</label>
            <div className="relative">
              <input
                type="number"
                placeholder="300"
                value={formData.minimumQuantity}
                onChange={(e) => handleChange("minimumQuantity", e.target.value)}
                onBlur={() => validateField("minimumQuantity", formData.minimumQuantity)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${getFieldBorderClass("minimumQuantity")} ${getFieldBgClass("minimumQuantity")}`}
              />
              {validationStates.minimumQuantity === true && (
                <Check className="absolute right-3 top-3.5 text-green-500" size={20} />
              )}
              {validationStates.minimumQuantity === false && (
                <AlertCircle className="absolute right-3 top-3.5 text-red-500" size={20} />
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">Minimum units needed to get bulk pricing from supplier</p>
            {validationStates.minimumQuantity === false && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Timeline */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Timeline</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Request Deadline <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleChange("deadline", e.target.value)}
              onBlur={() => validateField("deadline", formData.deadline)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${getFieldBorderClass("deadline")} ${getFieldBgClass("deadline")}`}
            />
            {validationStates.deadline === true && (
              <Check className="absolute right-3 top-3.5 text-green-500" size={20} />
            )}
            {validationStates.deadline === false && (
              <AlertCircle className="absolute right-3 top-3.5 text-red-500" size={20} />
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">When should commitments close? (Minimum 3 days from today)</p>
          {validationStates.deadline === false && (
            <p className="text-red-500 text-sm mt-1">Deadline must be at least 3 days from today</p>
          )}
        </div>
      </div>

      {/* Section 4: Contact Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
        </div>

        <div className="space-y-6">
          {/* Co-op Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Your Co-op Name</label>
            <input
              type="text"
              value="Unity Cooperative Society"
              disabled
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Contact Person</label>
            <input
              type="text"
              value="Adewale Johnson"
              disabled
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onFormChange("phone", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#22A65B] focus:ring-[#22A65B] focus:outline-none"
            />
            <p className="text-gray-600 text-sm mt-1">Other co-ops will use this to reach you</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
        >
          Save as Draft
        </button>
        <a href="/dashboard" className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900">
          Cancel
        </a>
        <button
          type="button"
          disabled={!isFormValid}
          className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            isFormValid ? "bg-[#22A65B] text-white hover:bg-[#1B8A4A]" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Publish Request →
        </button>
      </div>
    </form>
  )
}

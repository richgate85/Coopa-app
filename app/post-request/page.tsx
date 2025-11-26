"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { PostRequestForm } from "@/components/post-request/post-request-form"
import { PreviewCard } from "@/components/post-request/preview-card"
import { ChevronLeft } from "lucide-react"

export default function PostRequestPage() {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    quantity: "",
    unit: "Bags",
    targetPrice: "",
    retailPrice: "",
    minimumQuantity: "",
    deadline: "",
    phone: "0803 456 7890",
  })

  const [validationStates, setValidationStates] = useState({
    itemName: null,
    category: null,
    description: null,
    quantity: null,
    targetPrice: null,
    retailPrice: null,
    minimumQuantity: null,
    deadline: null,
  })

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleValidationChange = (field: string, state: boolean | null) => {
    setValidationStates((prev) => ({ ...prev, [field]: state }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <a href="/dashboard" className="hover:text-gray-900">
              Dashboard
            </a>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-medium">Post New Request</span>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <a href="/dashboard" className="flex items-center gap-2 text-[#22A65B] hover:text-[#1B8A4A] font-medium">
                <ChevronLeft size={20} />
                Back
              </a>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Post New Bulk Buy Request</h1>
            <p className="text-gray-600">Create a bulk purchase opportunity for other cooperatives to join</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form - 60% width */}
            <div className="lg:col-span-2">
              <PostRequestForm
                formData={formData}
                validationStates={validationStates}
                onFormChange={handleFormChange}
                onValidationChange={handleValidationChange}
              />
            </div>

            {/* Preview - 40% width, sticky on desktop */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <PreviewCard formData={formData} validationStates={validationStates} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

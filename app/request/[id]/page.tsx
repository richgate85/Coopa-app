"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Clock, Phone, Mail, Calendar } from "lucide-react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { JoinModal } from "@/components/request-detail/join-modal"

export default function RequestDetailPage() {
  const [joinModalOpen, setJoinModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/opportunities">Bulk Buy Board</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Rice - 50kg Bags</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <div className="mb-8">
            <button className="flex items-center gap-2 text-[#22A65B] hover:text-[#1B8A4A] font-medium mb-4">
              <ArrowLeft size={20} />
              Back to Board
            </button>
            <div className="flex items-start gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Rice - 50kg Bags</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin size={16} />
                  Posted by Unity Co-op, Lagos
                  <span className="mx-2">•</span>
                  <Clock size={16} />5 days ago
                </p>
              </div>
              <Badge className="bg-[#22A65B] text-white text-lg px-4 py-2 rounded-full">Open</Badge>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Image */}
              <div className="rounded-lg overflow-hidden shadow-md">
                <img src="/bags-of-rice.jpg" alt="Rice bags" className="w-full h-96 object-cover" />
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  High-quality parboiled rice, 50kg bags. Grade A, suitable for retail or direct consumption. Sourced
                  from local rice cooperatives in Kano.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our rice undergoes strict quality control and is packaged in food-grade polypropylene bags to ensure
                  freshness and safety. Perfect for bulk buyers and retail operations.
                </p>
              </div>

              {/* Specifications */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#22A65B] font-bold mt-1">•</span>
                    <span className="text-gray-700">
                      <strong>Brand:</strong> Local Rice Cooperative
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#22A65B] font-bold mt-1">•</span>
                    <span className="text-gray-700">
                      <strong>Quality:</strong> Premium Grade A
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#22A65B] font-bold mt-1">•</span>
                    <span className="text-gray-700">
                      <strong>Packaging:</strong> 50kg polypropylene bags
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#22A65B] font-bold mt-1">•</span>
                    <span className="text-gray-700">
                      <strong>Storage:</strong> Cool, dry place
                    </span>
                  </li>
                </ul>
              </div>

              {/* Pricing */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Target Unit Price:</span>
                    <span className="text-3xl font-bold text-[#22A65B]">₦36,000/bag</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Typical Retail:</span>
                    <span className="text-xl text-gray-500 line-through">₦45,000/bag</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="bg-green-50 border border-[#22A65B] rounded-lg p-4">
                      <p className="text-[#22A65B] font-bold text-lg">💰 ₦9,000 per bag (20%)</p>
                      <p className="text-sm text-gray-600 mt-1">Potential Savings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  Expected delivery within 2 weeks of order confirmation. Pickup location will be shared with
                  participating co-ops after supplier match.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-[#22A65B]" />
                    <span className="text-gray-700">0801-234-5678</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-[#22A65B]" />
                    <span className="text-gray-700">unity.coop@email.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Participation (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Participation Summary Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Participation Summary</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Target Quantity</p>
                      <p className="text-3xl font-bold text-gray-900">500 bags</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Current Commitments</p>
                      <p className="text-lg font-bold text-[#22A65B]">400 bags (80%)</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-[#22A65B] h-2 rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-gray-700">Minimum Order: 300 bags Reached</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-amber-500" />
                      <span className="text-sm">October 25, 2025 (5 days)</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <p className="font-bold text-gray-900 mb-4">🏢 5 Cooperatives Participating:</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#22A65B] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          U
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Unity Co-op</p>
                          <p className="text-xs text-gray-500">100 bags • Host</p>
                        </div>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">👑</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          P
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Progress Co-op</p>
                          <p className="text-xs text-gray-500">120 bags</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          H
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Hope Society</p>
                          <p className="text-xs text-gray-500">80 bags</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          E
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Excel Co-op</p>
                          <p className="text-xs text-gray-500">60 bags</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          S
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Star Co-op</p>
                          <p className="text-xs text-gray-500">40 bags</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setJoinModalOpen(true)}
                    className="w-full bg-[#22A65B] hover:bg-[#1B8A4A] text-white font-bold py-6 text-lg rounded-lg"
                  >
                    Join This Purchase →
                  </Button>
                </div>

                {/* Estimated Costs Card */}
                <div className="bg-green-50 border border-[#22A65B] rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🧮</span>
                    <h3 className="text-lg font-bold text-gray-900">Estimated Costs</h3>
                  </div>
                  <p className="text-sm text-gray-600 italic mb-4">If you commit to 100 bags:</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Cost:</span>
                      <span className="font-bold text-gray-900">₦3,600,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Savings:</span>
                      <span className="font-bold text-[#22A65B]">₦900,000 (vs retail)</span>
                    </div>
                    <div className="border-t border-[#22A65B] pt-3 flex justify-between">
                      <span className="text-gray-700">Savings per member (25):</span>
                      <span className="font-bold text-[#22A65B]">₦36,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      <JoinModal open={joinModalOpen} onOpenChange={setJoinModalOpen} />
    </div>
  )
}

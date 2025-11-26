"use client"

import { useState } from "react"
import AdminNav from "@/components/admin/admin-nav"
import AdminHeader from "@/components/admin/admin-header"
import PlatformMetrics from "@/components/admin/platform-metrics"
import ReadyToMatch from "@/components/admin/ready-to-match"
import ActiveOrdersTable from "@/components/admin/active-orders-table"
import QuickStats from "@/components/admin/quick-stats"
import RecentActivity from "@/components/admin/recent-activity"
import MatchSupplierModal from "@/components/admin/match-supplier-modal"

export default function AdminDashboard() {
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  const handleMatchClick = (request: any) => {
    setSelectedRequest(request)
    setIsMatchModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminHeader />
          <div className="mt-8 space-y-8">
            <PlatformMetrics />
            <ReadyToMatch onMatchClick={handleMatchClick} />
            <ActiveOrdersTable />
            <QuickStats />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RecentActivity />
        </div>
      </div>
      <MatchSupplierModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  )
}

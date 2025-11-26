"use client"

//
// FIXING THE PATHS: Using relative paths (../../) to be 100% safe.
//
import { DashboardHeader } from "../../components/dashboard/dashboard-header"
import { QuickStatsCards } from "../../components/dashboard/quick-stats-cards"
import { PostRequestCTA } from "../../components/dashboard/post-request-cta"
import { ActivePurchases } from "../../components/dashboard/active-purchases"
import { NewOpportunities } from "../../components/dashboard/new-opportunities"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 2. We've MOVED DashboardHeader to the top, outside of 'main' */}
      <DashboardHeader />

      {/* 3. We keep the 'pt-20' so your content starts BELOW the fixed header */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* We've removed the extra DashboardHeader from here */}

          <div className="mt-8">
            <QuickStatsCards />
          </div>

          <div className="mt-12">
            <PostRequestCTA />
          </div>

          <div className="mt-12">
            <ActivePurchases />
          </div>

          <div className="mt-12">
            <NewOpportunities />
          </div>
        </div>
      </main>
    </div>
  )
}
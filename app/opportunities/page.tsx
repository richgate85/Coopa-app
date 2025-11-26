"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { OpportunitiesHeader } from "@/components/opportunities/opportunities-header"
import { FilterBar } from "@/components/opportunities/filter-bar"
import { ResultsSummary } from "@/components/opportunities/results-summary"
import { OpportunitiesGrid } from "@/components/opportunities/opportunities-grid"
import { PaginationComponent } from "@/components/opportunities/pagination"

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("newest")
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="pt-16">
        <OpportunitiesHeader />
        <FilterBar
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          onSearchChange={handleSearch}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ResultsSummary category={selectedCategory} onClearFilters={handleClearFilters} />
          <OpportunitiesGrid
            searchQuery={searchQuery}
            category={selectedCategory}
            sortBy={sortBy}
            currentPage={currentPage}
            isLoading={isLoading}
          />
          <PaginationComponent currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}

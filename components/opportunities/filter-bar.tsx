"use client"

import { Search, ChevronDown } from "lucide-react"

interface FilterBarProps {
  searchQuery: string
  selectedCategory: string
  sortBy: string
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: string) => void
}

export function FilterBar({
  searchQuery,
  selectedCategory,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  const categories = [
    { value: "all", label: "All" },
    { value: "food", label: "Food & Grains" },
    { value: "cooking", label: "Cooking Supplies" },
    { value: "agricultural", label: "Agricultural Inputs" },
    { value: "equipment", label: "Equipment" },
    { value: "household", label: "Household Items" },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "ending-soon", label: "Ending Soon" },
    { value: "most-participants", label: "Most Participants" },
    { value: "highest-savings", label: "Highest Savings" },
  ]

  return (
    <div className="sticky top-16 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Search Input */}
          <div className="flex-1 md:w-2/5 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A65B] focus:border-transparent"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:w-1/4 relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A65B] focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.value === "all" ? "Category: All" : `Category: ${cat.label}`}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="md:w-1/4 relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A65B] focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort by: {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

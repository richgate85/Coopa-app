"use client"

interface ResultsSummaryProps {
  category: string
  onClearFilters: () => void
}

export function ResultsSummary({ category, onClearFilters }: ResultsSummaryProps) {
  const categoryLabels: Record<string, string> = {
    food: "Food & Grains",
    cooking: "Cooking Supplies",
    agricultural: "Agricultural Inputs",
    equipment: "Equipment",
    household: "Household Items",
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <p className="text-gray-700 font-medium">Showing 12 opportunities</p>
      {category !== "all" && (
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <span className="text-sm text-gray-600">
            Active filters: <span className="font-medium">{categoryLabels[category]}</span>
          </span>
          <button onClick={onClearFilters} className="text-sm text-[#22A65B] hover:text-[#1B8A4A] font-medium">
            ✕ Clear
          </button>
        </div>
      )}
    </div>
  )
}

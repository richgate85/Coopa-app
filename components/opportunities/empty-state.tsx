import { Search } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Search size={64} className="text-gray-300 mb-4" />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No opportunities match your filters</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Try adjusting your search or category filter to find what you're looking for
      </p>
      <div className="flex gap-3">
        <button className="px-6 py-2 border border-[#22A65B] text-[#22A65B] rounded-lg font-medium hover:bg-green-50 transition-colors">
          Clear Filters
        </button>
        <button className="px-6 py-2 bg-[#22A65B] text-white rounded-lg font-medium hover:bg-[#1B8A4A] transition-colors">
          Post the First Request
        </button>
      </div>
    </div>
  )
}

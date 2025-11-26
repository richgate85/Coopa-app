"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationComponentProps {
  currentPage: number
  onPageChange: (page: number) => void
}

export function PaginationComponent({ currentPage, onPageChange }: PaginationComponentProps) {
  const totalPages = 4
  const totalResults = 45

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const startResult = (currentPage - 1) * 12 + 1
  const endResult = Math.min(currentPage * 12, totalResults)

  return (
    <div className="flex flex-col items-center gap-6 mt-12 py-8">
      <p className="text-gray-600">
        Showing {startResult}-{endResult} of {totalResults} results
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1
            return (
              <button
                key={page}
                onClick={() => {
                  onPageChange(page)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#22A65B] text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

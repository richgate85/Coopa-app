"use client"

import { useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface OpportunityCardProps {
  image: string
  title: string
  target: string
  coopsJoined: number
  isNew?: boolean
  buttonText: string
}

function OpportunityCard({ image, title, target, coopsJoined, isNew, buttonText }: OpportunityCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 w-full sm:w-80">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        {isNew && <Badge className="absolute top-3 right-3 bg-[#22A65B] text-white border-0">Just posted</Badge>}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">Target: {target}</p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {[...Array(Math.min(coopsJoined, 3))].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-[#22A65B] border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              >
                {i + 1}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-600">{coopsJoined} co-ops joined</span>
        </div>

        <Button className="w-full bg-[#22A65B] hover:bg-[#1B8A4A] text-white">{buttonText}</Button>
      </div>
    </Card>
  )
}

export function NewOpportunities() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New Bulk Buy Opportunities</h2>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          <OpportunityCard
            image="/palm-oil-drum.jpg"
            title="Palm Oil - 25L Drums"
            target="₦28,000/drum"
            coopsJoined={4}
            buttonText="Join Now →"
          />

          <OpportunityCard
            image="/cement-bags.jpg"
            title="Cement - 50kg Bags"
            target="₦4,500/bag"
            coopsJoined={2}
            buttonText="View Details"
          />

          <OpportunityCard
            image="/fertilizer-bags.jpg"
            title="Fertilizer - 25kg Bags"
            target="₦8,500/bag"
            coopsJoined={1}
            isNew
            buttonText="View Details"
          />
        </div>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  )
}

"use client"

import { OpportunityCard } from "./opportunity-card"
import { SkeletonCard } from "./skeleton-card"
import { EmptyState } from "./empty-state"

interface OpportunitiesGridProps {
  searchQuery: string
  category: string
  sortBy: string
  currentPage: number
  isLoading: boolean
}

// Mock data for opportunities
const mockOpportunities = [
  {
    id: 1,
    title: "Rice - 50kg Bags",
    image: "/bags-of-rice.jpg",
    status: "Open",
    category: "Food & Grains",
    categoryIcon: "🌾",
    postedBy: "Unity Co-op, Lagos",
    targetPrice: 36000,
    retailPrice: 45000,
    savings: 9000,
    savingsPercent: 20,
    committed: 400,
    total: 500,
    coopsJoined: 5,
    closesIn: "5 days",
  },
  {
    id: 2,
    title: "Cooking Oil - 25L Drums",
    image: "/cooking-oil-drums.jpg",
    status: "Almost Full",
    category: "Cooking Supplies",
    categoryIcon: "🍳",
    postedBy: "Prosperity Co-op, Ibadan",
    targetPrice: 28000,
    retailPrice: 35000,
    savings: 7000,
    savingsPercent: 20,
    committed: 480,
    total: 500,
    coopsJoined: 8,
    closesIn: "2 days",
  },
  {
    id: 3,
    title: "Cement - 50kg Bags",
    image: "/cement-bags.jpg",
    status: "Open",
    category: "Equipment",
    categoryIcon: "🏗️",
    postedBy: "Growth Co-op, Abuja",
    targetPrice: 3500,
    retailPrice: 4200,
    savings: 700,
    savingsPercent: 17,
    committed: 200,
    total: 1000,
    coopsJoined: 3,
    closesIn: "8 days",
  },
  {
    id: 4,
    title: "Fertilizer - 50kg Bags",
    image: "/fertilizer-bags.jpg",
    status: "Open",
    category: "Agricultural Inputs",
    categoryIcon: "🌱",
    postedBy: "Harvest Co-op, Kaduna",
    targetPrice: 12000,
    retailPrice: 15000,
    savings: 3000,
    savingsPercent: 20,
    committed: 150,
    total: 500,
    coopsJoined: 4,
    closesIn: "Just posted",
    isNew: true,
  },
  {
    id: 5,
    title: "Palm Oil - 25L Drums",
    image: "/palm-oil-drums.jpg",
    status: "In Progress",
    category: "Cooking Supplies",
    categoryIcon: "🍳",
    postedBy: "Unity Co-op, Lagos",
    targetPrice: 32000,
    retailPrice: 40000,
    savings: 8000,
    savingsPercent: 20,
    committed: 350,
    total: 500,
    coopsJoined: 6,
    closesIn: "3 days",
  },
  {
    id: 6,
    title: "Garri - 50kg Bags",
    image: "/garri-bags.jpg",
    status: "Closed",
    category: "Food & Grains",
    categoryIcon: "🌾",
    postedBy: "Community Co-op, Enugu",
    targetPrice: 18000,
    retailPrice: 22000,
    savings: 4000,
    savingsPercent: 18,
    committed: 500,
    total: 500,
    coopsJoined: 7,
    closesIn: "Closed",
  },
]

export function OpportunitiesGrid({ searchQuery, category, sortBy, currentPage, isLoading }: OpportunitiesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.postedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = category === "all" || opp.category.toLowerCase().includes(category)
    return matchesSearch && matchesCategory
  })

  if (filteredOpportunities.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredOpportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  )
}

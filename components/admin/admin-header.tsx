"use client"

import { ChevronDown } from "lucide-react"

export default function AdminHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage marketplace operations and track performance</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-fit">
        <span className="text-sm font-medium text-gray-700">October 1-20, 2025</span>
        <ChevronDown size={16} className="text-gray-600" />
      </button>
    </div>
  )
}

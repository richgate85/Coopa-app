"use client"

import { useState } from "react"
import { Bell, ChevronDown, Menu, X } from "lucide-react"

export default function AdminNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const tabs = ["Requests", "Suppliers", "Analytics", "Co-ops", "Settings"]
  const activeTab = "Requests"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center font-bold text-sm">C</div>
            <span className="font-bold text-lg">Coopa Admin</span>
            <span className="text-xs bg-green-600 px-2 py-1 rounded-full ml-2">Admin</span>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`pb-2 text-sm font-medium transition-colors ${
                  tab === activeTab ? "text-white border-b-2 border-green-600" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  A
                </div>
                <ChevronDown size={16} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm">Profile</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm">Settings</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-red-400">Logout</button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === activeTab ? "bg-green-600 text-white" : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

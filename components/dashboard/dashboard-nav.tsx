"use client"

import { useState } from "react"
import Link from 'next/link'
import { Menu, X, Bell, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DashboardNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22A65B] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">Coopa</h1>
              <p className="text-xs text-gray-500">The Cooperative Advantage</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium border-b-2 border-[#22A65B]">
              Dashboard
            </Link>
            <Link href="/opportunities" className="text-gray-600 hover:text-gray-900 font-medium">
              Browse Requests
            </Link>
            <Link href="/dashboard/co-op" className="text-gray-600 hover:text-gray-900 font-medium">
              My Co-op
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <img src="/placeholder-user.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">Adewale</p>
                    <p className="text-xs text-gray-500">Unity Co-op</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Co-op Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded font-medium border-l-2 border-[#22A65B] bg-green-50"
            >
              Dashboard
            </Link>
            <Link href="/opportunities" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium">
              Browse Requests
            </Link>
            <Link href="/dashboard/co-op" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium">
              My Co-op
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

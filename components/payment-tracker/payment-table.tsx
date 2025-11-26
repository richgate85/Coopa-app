"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, AlertCircle } from "lucide-react"

const mockMembers = [
  {
    id: "1",
    name: "John Okafor",
    quantity: 4,
    amountDue: 144000,
    status: "paid",
    paidDate: "Oct 18, 2025",
  },
  {
    id: "2",
    name: "Mary Adewale",
    quantity: 3,
    amountDue: 108000,
    status: "pending",
    paidDate: null,
  },
  {
    id: "3",
    name: "Peter Eze",
    quantity: 5,
    amountDue: 180000,
    status: "overdue",
    dueDate: "Oct 15",
  },
  {
    id: "4",
    name: "Blessing Nwosu",
    quantity: 2,
    amountDue: 72000,
    status: "paid",
    paidDate: "Oct 17, 2025",
  },
  {
    id: "5",
    name: "Ibrahim Musa",
    quantity: 6,
    amountDue: 216000,
    status: "pending",
    paidDate: null,
  },
  {
    id: "6",
    name: "Grace Okoli",
    quantity: 3,
    amountDue: 108000,
    status: "paid",
    paidDate: "Oct 19, 2025",
  },
  {
    id: "7",
    name: "Chioma Obi",
    quantity: 4,
    amountDue: 144000,
    status: "pending",
    paidDate: null,
  },
  {
    id: "8",
    name: "Tunde Adeyemi",
    quantity: 2,
    amountDue: 72000,
    status: "paid",
    paidDate: "Oct 16, 2025",
  },
  {
    id: "9",
    name: "Zainab Hassan",
    quantity: 5,
    amountDue: 180000,
    status: "overdue",
    dueDate: "Oct 14",
  },
  {
    id: "10",
    name: "Emeka Nwankwo",
    quantity: 3,
    amountDue: 108000,
    status: "pending",
    paidDate: null,
  },
]

export function PaymentTable({
  selectedRows,
  onSelectedRowsChange,
  onMarkPaid,
  onSendReminder,
}: {
  selectedRows: string[]
  onSelectedRowsChange: (rows: string[]) => void
  onMarkPaid: (member: any) => void
  onSendReminder: (member: any) => void
}) {
  const [allSelected, setAllSelected] = useState(false)

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectedRowsChange([])
      setAllSelected(false)
    } else {
      onSelectedRowsChange(mockMembers.map((m) => m.id))
      setAllSelected(true)
    }
  }

  const handleSelectRow = (id: string) => {
    const newSelected = selectedRows.includes(id) ? selectedRows.filter((r) => r !== id) : [...selectedRows, id]
    onSelectedRowsChange(newSelected)
    setAllSelected(newSelected.length === mockMembers.length)
  }

  const getStatusBadge = (status: string, dueDate?: string) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-[#22A65B] text-sm font-medium rounded-full">
          <span>✓</span> Paid
        </span>
      )
    } else if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
          <span>⏱</span> Pending
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
          <AlertCircle size={14} /> Overdue
        </span>
      )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left">
                <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                <div className="flex items-center gap-2">
                  Member Name
                  <ArrowUpDown size={16} className="text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount Due</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown size={16} className="text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockMembers.map((member, index) => (
              <tr
                key={member.id}
                className={`border-b border-gray-200 hover:bg-green-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedRows.includes(member.id)}
                    onCheckedChange={() => handleSelectRow(member.id)}
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{member.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.quantity} bags</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">₦{member.amountDue.toLocaleString()}</td>
                <td className="px-6 py-4">{getStatusBadge(member.status, member.dueDate)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {member.status === "paid" ? (
                      <Button variant="ghost" size="sm" className="gap-1 text-gray-600 hover:text-gray-900">
                        <Eye size={16} />
                        View Receipt
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-[#22A65B] hover:text-[#1B8A4A]"
                          onClick={() => onMarkPaid(member)}
                        >
                          Mark Paid
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-[#F59E0B] hover:text-[#D97706]"
                          onClick={() => onSendReminder(member)}
                        >
                          Remind
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Showing 1-10 of 25 members</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            ← Previous
          </Button>
          <Button size="sm" className="bg-[#22A65B] hover:bg-[#1B8A4A]">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next →
          </Button>
        </div>
      </div>
    </div>
  )
}

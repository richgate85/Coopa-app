import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function BulkActionsBar({ selectedCount }: { selectedCount: number }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
      <p className="text-sm font-medium text-gray-900">
        {selectedCount} member{selectedCount !== 1 ? "s" : ""} selected
      </p>
      <div className="flex items-center gap-3">
        <Button className="bg-[#22A65B] hover:bg-[#1B8A4A]">Mark All as Paid</Button>
        <Button className="bg-[#F59E0B] hover:bg-[#D97706]">Send Reminders</Button>
        <Button variant="ghost" className="text-red-600 hover:text-red-700">
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  )
}

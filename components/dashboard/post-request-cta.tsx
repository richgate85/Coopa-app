import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export function PostRequestCTA() {
  return (
    <div className="flex justify-center">
      <Link href="/dashboard/start-buying">
        <Button
          size="lg"
          className="bg-[#22A65B] hover:bg-[#1B8A4A] text-white font-semibold gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus size={20} />
          Post New Bulk Buy Request
        </Button>
      </Link>
    </div>
  )
}

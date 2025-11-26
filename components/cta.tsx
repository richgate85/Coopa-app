import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#22A65B]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
          Ready to Unlock Your Cooperative's Advantage?
        </h2>
        <p className="text-lg text-white/90 mb-8 text-balance">Join 50+ cooperatives already saving together</p>
        <Button className="bg-white hover:bg-gray-100 text-[#22A65B] text-base px-8 py-6 h-auto font-semibold flex items-center gap-2 mx-auto">
          Get Started Free <ArrowRight size={20} />
        </Button>
        <p className="text-sm text-white/80 mt-6">No credit card required • Free to start</p>
      </div>
    </section>
  )
}

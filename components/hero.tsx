import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-balance">
            Buy Together. <span className="text-[#22A65B]">Pay Less. Unlock Bulk Power.</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed text-balance">
            Join cooperatives across Nigeria coordinating bulk purchases to unlock 20-30% cost savings on everyday goods
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button className="bg-[#22A65B] hover:bg-[#1B8A4A] text-white text-base px-8 py-6 h-auto flex items-center gap-2">
              Start Buying in Bulk <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[#22A65B] text-[#22A65B] hover:bg-[#E8F5E9] text-base px-8 py-6 h-auto bg-transparent"
            >
              See How It Works
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-[#22A65B]/80 to-[#1B8A4A]/80 flex items-center justify-center">
            <img
              src="/cooperatives-shopping-cart-savings.jpg"
              alt="Black cooperatives coordinating bulk purchases"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#22A65B]/50 to-[#1B8A4A]/50"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

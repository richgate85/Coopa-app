import { Megaphone, Handshake, Banknote, ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: Megaphone,
      title: "Post Your Needs",
      description: "Co-ops list items they want to buy in bulk",
    },
    {
      icon: Handshake,
      title: "Join Forces",
      description: "Other co-ops join your purchase request",
    },
    {
      icon: Banknote,
      title: "Get Bulk Prices",
      description: "Everyone pays less with bulk pricing",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 text-balance">How Coopa Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* Card */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center hover:border-[#22A65B] transition">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[#22A65B]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Arrow between steps (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-[#22A65B]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

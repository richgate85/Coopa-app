import { TrendingUp, Handshake, Percent } from "lucide-react"

export default function TrustIndicators() {
  const stats = [
    {
      icon: TrendingUp,
      label: "₦2.5M+ Worth of Bulk Purchases",
    },
    {
      icon: Handshake,
      label: "25+ Successful Bulk Purchases",
    },
    {
      icon: Percent,
      label: "Average 23% Cost Reduction",
    },
  ]

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#E8F5E9]">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-gray-700 font-medium mb-8">Trusted by cooperatives across Nigeria</p>
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-sm">
                <div className="flex-shrink-0">
                  <Icon className="w-8 h-8 text-[#22A65B]" />
                </div>
                <p className="font-semibold text-gray-900">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { Check } from "lucide-react"

export default function SavingsComparison() {
  const items = [
    {
      name: "Rice (50kg bag)",
      retail: "₦45,000",
      bulk: "₦36,000",
      savings: "₦9,000",
      percentage: "20%",
    },
    {
      name: "Cooking Oil (25L)",
      retail: "₦32,000",
      bulk: "₦25,000",
      savings: "₦7,000",
      percentage: "22%",
    },
    {
      name: "Cement (50kg)",
      retail: "₦5,500",
      bulk: "₦4,400",
      savings: "₦1,100",
      percentage: "20%",
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 text-balance">
          Real Savings for Nigerian Cooperatives
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-bold text-gray-900">Item</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Single Co-op Price</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Bulk Price (5+ Co-ops)</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Better Deal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-[#E8F5E9]"}`}>
                  <td className="py-4 px-4 text-gray-900 font-medium">{item.name}</td>
                  <td className="py-4 px-4 text-gray-700">{item.retail}</td>
                  <td className="py-4 px-4 text-gray-700 font-semibold text-[#22A65B]">{item.bulk}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{item.savings}</span>
                      <span className="text-sm text-gray-600">({item.percentage})</span>
                      <Check className="w-5 h-5 text-[#22A65B]" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

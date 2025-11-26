"use client"

const stats = [
  {
    label: "₦28.5M Collected This Month",
    value: "Revenue",
  },
  {
    label: "15 Orders Completed",
    value: "Fulfillment",
  },
  {
    label: "24 Suppliers Active",
    value: "Network",
  },
  {
    label: "92% Co-op Satisfaction",
    value: "Quality",
  },
]

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm font-medium">{stat.value}</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

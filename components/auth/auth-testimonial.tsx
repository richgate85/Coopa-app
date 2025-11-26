import { Quote } from "lucide-react"

interface AuthTestimonialProps {
  quote: string
  attribution: string
  stats: Array<{ label: string; value: string }>
}

export default function AuthTestimonial({ quote, attribution, stats }: AuthTestimonialProps) {
  return (
    <div className="w-full max-w-md">
      {/* Quote Icon */}
      <Quote className="w-12 h-12 text-[#22A65B] mb-6" />

      {/* Testimonial Text */}
      <p className="text-lg text-gray-800 mb-6 leading-relaxed">{quote}</p>

      {/* Attribution */}
      <p className="text-gray-600 font-medium mb-8">{attribution}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#22A65B]/20">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-2xl font-bold text-[#22A65B] mb-1">{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Decorative dots */}
      <div className="mt-8 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#22A65B]/30"></div>
        ))}
      </div>
    </div>
  )
}

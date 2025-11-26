import { Star } from "lucide-react"

export default function SocialProof() {
  const testimonials = [
    {
      quote:
        "Coopa has transformed how our cooperative sources goods. We've cut our costs by nearly 25% in just three months!",
      name: "Adewale Johnson",
      role: "Treasurer",
      coop: "Unity Co-op Lagos",
      rating: 5,
    },
    {
      quote:
        "The platform makes it so easy to coordinate with other cooperatives. The savings are real and the process is seamless.",
      name: "Chioma Okafor",
      role: "Manager",
      coop: "Prosperity Co-op Abuja",
      rating: 5,
    },
    {
      quote:
        "We've been able to expand our inventory and serve more members thanks to the bulk discounts we get through Coopa.",
      name: "Ibrahim Hassan",
      role: "Director",
      coop: "Community Co-op Kano",
      rating: 5,
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 text-balance">
          Trusted by Cooperatives Like Yours
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#22A65B] text-[#22A65B]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>

              {/* Author */}
              <div>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">
                  {testimonial.role}, {testimonial.coop}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

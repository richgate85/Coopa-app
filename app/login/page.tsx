import LoginForm from "@/components/auth/login-form"
import AuthTestimonial from "@/components/auth/auth-testimonial"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Form Section */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-12">
          <LoginForm />
        </div>

        {/* Testimonial Section */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-[#E8F5E9] to-white px-6 py-12">
          <AuthTestimonial
            quote="The bulk buying coordination has transformed how we serve our members. Highly recommended!"
            attribution="Chukwudi Eze, Treasurer, Excel Co-operative, Lagos"
            stats={[
              { label: "50+ Co-ops", value: "50+" },
              { label: "₦2.5M+ Saved", value: "₦2.5M+" },
              { label: "23% Avg Savings", value: "23%" },
            ]}
          />
        </div>

        {/* Mobile Testimonial */}
        <div className="lg:hidden px-6 py-8 bg-gradient-to-b from-[#E8F5E9] to-white">
          <AuthTestimonial
            quote="The bulk buying coordination has transformed how we serve our members. Highly recommended!"
            attribution="Chukwudi Eze, Treasurer, Excel Co-operative, Lagos"
            stats={[
              { label: "50+ Co-ops", value: "50+" },
              { label: "₦2.5M+ Saved", value: "₦2.5M+" },
              { label: "23% Avg Savings", value: "23%" },
            ]}
          />
        </div>
      </div>
    </main>
  )
}

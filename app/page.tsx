import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import TrustIndicators from "@/components/trust-indicators"
import HowItWorks from "@/components/how-it-works"
import SavingsComparison from "@/components/savings-comparison"
import SocialProof from "@/components/social-proof"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <TrustIndicators />
      <HowItWorks />
      <SavingsComparison />
      <SocialProof />
      <CTA />
      <Footer />
    </main>
  )
}

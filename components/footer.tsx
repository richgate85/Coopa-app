import { Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Left: Logo */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#22A65B] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h3 className="font-bold text-lg">Coopa</h3>
            </div>
            <p className="text-gray-400 text-sm">The Cooperative Advantage</p>
          </div>

          {/* Center: Links */}
          <div className="flex justify-center gap-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition">
              About
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              How It Works
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Pricing
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Contact
            </a>
          </div>

          {/* Right: Social Icons */}
          <div className="flex justify-end gap-4">
            <a href="#" className="text-gray-400 hover:text-[#22A65B] transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#22A65B] transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#22A65B] transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle size={18} className="text-[#22A65B]" />
              <a href="https://wa.me/2348032252487" className="hover:text-[#22A65B] transition">
                WhatsApp Support: +234 803 225 2487
              </a>
            </div>
            <a href="https://coopa.com.ng" className="text-gray-400 hover:text-[#22A65B] transition">
              coopa.com.ng
            </a>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Coopa. Empowering Nigerian Cooperatives.</p>
        </div>

        {/* Additional Links */}
        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}

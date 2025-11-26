import { MessageCircle } from "lucide-react"

export default function FloatingWhatsAppButton() {
  return (
    <a
      href="https://wa.me/2348032252487"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#22A65B] hover:bg-[#1B8A4A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  )
}

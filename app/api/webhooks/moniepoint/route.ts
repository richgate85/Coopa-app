import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Verify Moniepoint webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const hash = crypto
    .createHmac("sha256", process.env.MONIEPOINT_WEBHOOK_SECRET || "")
    .update(payload)
    .digest("hex")
  return hash === signature
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("x-moniepoint-signature") || ""

    // Verify webhook authenticity
    if (!verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = JSON.parse(payload)

    // Handle payment received event
    if (data.event === "payment.received") {
      const { reference, amount, account_number } = data.data

      console.log("[v0] Payment received:", { reference, amount, account_number })

      // Update escrow_deposits table with verified status
      // This would typically call your database to mark the deposit as verified
      // and trigger WhatsApp notification to member

      // TODO: Implement database update and notification
      // await updateEscrowDeposit(reference, { verified: true, verified_at: new Date() })
      // await sendWhatsAppNotification(memberId, `Payment received ✓ Amount: ₦${amount}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

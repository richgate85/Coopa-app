import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { requestId, amount, coopName } = await request.json()

    // Validate input
    if (!requestId || !amount || !coopName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Call Moniepoint API to create virtual account
    const moniePointResponse = await fetch("https://api.moniepoint.com/api/v1/virtual-account/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MONIEPOINT_API_KEY}`,
      },
      body: JSON.stringify({
        account_name: `Coopa Escrow - ${requestId.slice(0, 8)}`,
        amount: amount,
        reference: `COOPA-${requestId}`,
        customer_name: coopName,
      }),
    })

    if (!moniePointResponse.ok) {
      throw new Error("Moniepoint API error")
    }

    const data = await moniePointResponse.json()

    return NextResponse.json({
      accountNumber: data.account_number,
      accountName: data.account_name,
      bankName: "Moniepoint MFB",
      reference: data.reference,
    })
  } catch (error) {
    console.error("[v0] Virtual account creation error:", error)
    return NextResponse.json({ error: "Failed to create virtual account" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { accountNumber } = await request.json()

    if (!accountNumber) {
      return NextResponse.json({ error: "Account number required" }, { status: 400 })
    }

    // Call Moniepoint API to check balance
    const response = await fetch("https://api.moniepoint.com/api/v1/virtual-account/balance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MONIEPOINT_API_KEY}`,
      },
      body: JSON.stringify({
        account_number: accountNumber,
      }),
    })

    if (!response.ok) {
      throw new Error("Moniepoint API error")
    }

    const data = await response.json()

    return NextResponse.json({
      balance: data.balance,
      currency: "NGN",
      verified: true,
    })
  } catch (error) {
    console.error("[v0] Balance check error:", error)
    return NextResponse.json({ error: "Failed to check balance" }, { status: 500 })
  }
}

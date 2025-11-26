import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { requestId, coopId, totalAmount, memberCount } = await request.json()

    if (!requestId || !coopId || !totalAmount || !memberCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create virtual account via Moniepoint
    const accountResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/moniepoint/create-virtual-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId,
        amount: totalAmount,
        coopName: `Coopa Co-op ${coopId.slice(0, 8)}`,
      }),
    })

    if (!accountResponse.ok) {
      throw new Error("Failed to create virtual account")
    }

    const accountData = await accountResponse.json()

    // TODO: Save to database
    // const escrow = await db.payment_escrow.create({
    //   request_id: requestId,
    //   coop_id: coopId,
    //   moniepoint_account_number: accountData.accountNumber,
    //   moniepoint_account_name: accountData.accountName,
    //   total_amount: totalAmount,
    //   status: 'collecting',
    // })

    return NextResponse.json({
      escrowId: "temp-id", // Would be actual ID from database
      accountNumber: accountData.accountNumber,
      accountName: accountData.accountName,
      bankName: accountData.bankName,
      totalAmount,
      memberCount,
    })
  } catch (error) {
    console.error("[v0] Escrow creation error:", error)
    return NextResponse.json({ error: "Failed to create payment escrow" }, { status: 500 })
  }
}

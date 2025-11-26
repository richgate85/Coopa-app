import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { escrowId, platformAdminId } = await request.json()

    if (!escrowId || !platformAdminId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify balance before releasing
    // TODO: Get account number from database and verify balance
    // const escrow = await db.payment_escrow.findById(escrowId)
    // const balanceCheck = await fetch('/api/moniepoint/check-balance', {
    //   method: 'POST',
    //   body: JSON.stringify({ accountNumber: escrow.moniepoint_account_number })
    // })

    // TODO: Update database
    // await db.payment_escrow.update(
    //   { id: escrowId },
    //   {
    //     status: 'released',
    //     platform_admin_id: platformAdminId,
    //     platform_admin_approved_at: new Date(),
    //     released_to_supplier_at: new Date(),
    //   }
    // )

    return NextResponse.json({
      success: true,
      status: "released",
      message: "Payment released to supplier",
    })
  } catch (error) {
    console.error("[v0] Platform approval error:", error)
    return NextResponse.json({ error: "Failed to release payment" }, { status: 500 })
  }
}

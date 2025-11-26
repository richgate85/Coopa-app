/**
 * Moniepoint API Client
 * Handles all interactions with Moniepoint API for virtual accounts and payments
 */

interface VirtualAccountResponse {
  accountNumber: string
  accountName: string
  bankName: string
  reference: string
}

interface BalanceResponse {
  balance: number
  currency: string
  verified: boolean
}

export class MoniePointClient {
  private apiKey: string
  private baseUrl = "https://api.moniepoint.com/api/v1"

  constructor(apiKey: string = process.env.MONIEPOINT_API_KEY || "") {
    this.apiKey = apiKey
  }

  /**
   * Create a virtual account for payment collection
   */
  async createVirtualAccount(requestId: string, amount: number, coopName: string): Promise<VirtualAccountResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/virtual-account/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          account_name: `Coopa Escrow - ${requestId.slice(0, 8)}`,
          amount,
          reference: `COOPA-${requestId}`,
          customer_name: coopName,
        }),
      })

      if (!response.ok) {
        throw new Error(`Moniepoint API error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        accountNumber: data.account_number,
        accountName: data.account_name,
        bankName: "Moniepoint MFB",
        reference: data.reference,
      }
    } catch (error) {
      console.error("[v0] Virtual account creation failed:", error)
      throw error
    }
  }

  /**
   * Check balance of a virtual account
   */
  async checkBalance(accountNumber: string): Promise<BalanceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/virtual-account/balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          account_number: accountNumber,
        }),
      })

      if (!response.ok) {
        throw new Error(`Moniepoint API error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        balance: data.balance,
        currency: "NGN",
        verified: true,
      }
    } catch (error) {
      console.error("[v0] Balance check failed:", error)
      throw error
    }
  }

  /**
   * Settle funds from virtual account to supplier
   */
  async settleFunds(
    accountNumber: string,
    amount: number,
    supplierBankCode: string,
    supplierAccountNumber: string,
    supplierName: string,
  ): Promise<{ transactionId: string; status: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/virtual-account/settle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          source_account: accountNumber,
          amount,
          destination_bank_code: supplierBankCode,
          destination_account_number: supplierAccountNumber,
          destination_account_name: supplierName,
        }),
      })

      if (!response.ok) {
        throw new Error(`Moniepoint API error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        transactionId: data.transaction_id,
        status: data.status,
      }
    } catch (error) {
      console.error("[v0] Settlement failed:", error)
      throw error
    }
  }

  /**
   * Refund funds from virtual account back to members
   */
  async refundFunds(
    accountNumber: string,
    amount: number,
    memberBankCode: string,
    memberAccountNumber: string,
    memberName: string,
  ): Promise<{ transactionId: string; status: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/virtual-account/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          source_account: accountNumber,
          amount,
          destination_bank_code: memberBankCode,
          destination_account_number: memberAccountNumber,
          destination_account_name: memberName,
        }),
      })

      if (!response.ok) {
        throw new Error(`Moniepoint API error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        transactionId: data.transaction_id,
        status: data.status,
      }
    } catch (error) {
      console.error("[v0] Refund failed:", error)
      throw error
    }
  }
}

// Export singleton instance
export const moniePointClient = new MoniePointClient()

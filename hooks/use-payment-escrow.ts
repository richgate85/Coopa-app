"use client"

import { useState, useCallback } from "react"
import type { EscrowState } from "@/lib/payment-escrow-service"

export function usePaymentEscrow() {
  const [escrow, setEscrow] = useState<EscrowState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEscrow = useCallback(async (requestId: string, coopId: string, totalAmount: number, coopName: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/payment-escrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, coopId, totalAmount, coopName }),
      })

      if (!response.ok) throw new Error("Failed to create escrow")

      const data = await response.json()
      setEscrow(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const approveByGroupAdmin = useCallback(
    async (escrowId: string, groupAdminId: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/payment-escrow/approve-group", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ escrowId, groupAdminId }),
        })

        if (!response.ok) throw new Error("Failed to approve")

        const data = await response.json()
        if (escrow) {
          setEscrow({ ...escrow, status: "group_approved" })
        }
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [escrow],
  )

  const approveByPlatformAdmin = useCallback(
    async (escrowId: string, platformAdminId: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/payment-escrow/approve-platform", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ escrowId, platformAdminId }),
        })

        if (!response.ok) throw new Error("Failed to approve")

        const data = await response.json()
        if (escrow) {
          setEscrow({ ...escrow, status: "released" })
        }
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [escrow],
  )

  return {
    escrow,
    isLoading,
    error,
    createEscrow,
    approveByGroupAdmin,
    approveByPlatformAdmin,
  }
}

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, X } from "lucide-react"

export function MarkAsPaidModal({
  open,
  onOpenChange,
  member,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: any
}) {
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [notes, setNotes] = useState("")

  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Mark Payment as Received</DialogTitle>
            <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Member</p>
            <p className="font-semibold text-gray-900">{member.name}</p>
            <p className="text-sm text-gray-600 mt-2">Amount</p>
            <p className="text-2xl font-bold text-[#22A65B]">₦{member.amountDue.toLocaleString()}</p>
          </div>

          <div className="border-t border-gray-200" />

          {/* Payment Date */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">Payment Date*</Label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="font-normal cursor-pointer">
                  Cash
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                <Label htmlFor="bank-transfer" className="font-normal cursor-pointer">
                  Bank Transfer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile-money" id="mobile-money" />
                <Label htmlFor="mobile-money" className="font-normal cursor-pointer">
                  Mobile Money (Opay, PalmPay, etc.)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reference Number */}
          <div>
            <Label htmlFor="reference" className="text-sm font-medium text-gray-900 mb-2 block">
              Reference Number (optional)
            </Label>
            <Input
              id="reference"
              placeholder="e.g., TRX123456"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-900 mb-2 block">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this payment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1 bg-[#22A65B] hover:bg-[#1B8A4A] gap-2">Confirm Payment →</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

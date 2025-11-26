"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export function SendReminderModal({
  open,
  onOpenChange,
  member,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: any
}) {
  const [message, setMessage] = useState(
    `Hello [Member Name],

This is a friendly reminder that your payment of ₦[Amount] for the Rice - 50kg Bags bulk purchase is pending.

Payment Details:
- Amount Due: ₦[Amount]
- Quantity: [X] bags
- Bank: [Account details]

Please make payment by [Deadline].

Thank you,
Unity Cooperative Society`,
  )
  const [sendSMS, setSendSMS] = useState(false)
  const [sendWhatsApp, setSendWhatsApp] = useState(true)
  const [sendEmail, setSendEmail] = useState(false)

  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Send Payment Reminder</DialogTitle>
            <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipients */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Send reminder to:</p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-900">
                {member.name} (₦{member.amountDue.toLocaleString()} pending)
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium text-gray-900 mb-2 block">
              Reminder Message:
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Send Via */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Send via:</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="sms" checked={sendSMS} onCheckedChange={(c) => setSendSMS(c === true)} />
                <Label htmlFor="sms" className="font-normal cursor-pointer">
                  SMS
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="whatsapp" checked={sendWhatsApp} onCheckedChange={(c) => setSendWhatsApp(c === true)} />
                <Label htmlFor="whatsapp" className="font-normal cursor-pointer">
                  WhatsApp
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="email" checked={sendEmail} onCheckedChange={(c) => setSendEmail(c === true)} />
                <Label htmlFor="email" className="font-normal cursor-pointer">
                  Email
                </Label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              WhatsApp messages will be sent if member has provided phone number
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1 bg-[#22A65B] hover:bg-[#1B8A4A] gap-2">Send Reminders →</Button>
          </div>
          <p className="text-xs text-gray-500 text-center">This will send 1 reminder</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { PaymentTrackerHeader } from "@/components/payment-tracker/payment-tracker-header"
import { SummaryCards } from "@/components/payment-tracker/summary-cards"
import { ActionBar } from "@/components/payment-tracker/action-bar"
import { PaymentTable } from "@/components/payment-tracker/payment-table"
import { BulkActionsBar } from "@/components/payment-tracker/bulk-actions-bar"
import { MarkAsPaidModal } from "@/components/payment-tracker/mark-as-paid-modal"
import { SendReminderModal } from "@/components/payment-tracker/send-reminder-modal"

export default function PaymentTrackerPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [markPaidOpen, setMarkPaidOpen] = useState(false)
  const [sendReminderOpen, setSendReminderOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)

  const handleMarkPaid = (member: any) => {
    setSelectedMember(member)
    setMarkPaidOpen(true)
  }

  const handleSendReminder = (member: any) => {
    setSelectedMember(member)
    setSendReminderOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PaymentTrackerHeader />
          <SummaryCards />
          <ActionBar />
          {selectedRows.length > 0 && <BulkActionsBar selectedCount={selectedRows.length} />}
          <PaymentTable
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            onMarkPaid={handleMarkPaid}
            onSendReminder={handleSendReminder}
          />
        </div>
      </div>

      <MarkAsPaidModal open={markPaidOpen} onOpenChange={setMarkPaidOpen} member={selectedMember} />
      <SendReminderModal open={sendReminderOpen} onOpenChange={setSendReminderOpen} member={selectedMember} />
    </div>
  )
}

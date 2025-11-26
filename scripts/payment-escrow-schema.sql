-- Payment Escrow Tables for Moniepoint Integration

CREATE TABLE IF NOT EXISTS payment_escrow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL,
  coop_id UUID NOT NULL,
  moniepoint_account_number TEXT NOT NULL,
  moniepoint_account_name TEXT NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  collected_amount DECIMAL(15, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'collecting', 'group_approved', 'platform_approved', 'released', 'refunded')),
  group_admin_id UUID,
  group_admin_approved_at TIMESTAMP,
  platform_admin_id UUID,
  platform_admin_approved_at TIMESTAMP,
  released_to_supplier_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_id UUID NOT NULL REFERENCES payment_escrow(id) ON DELETE CASCADE,
  member_id UUID NOT NULL,
  moniepoint_reference TEXT UNIQUE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  depositor_name TEXT NOT NULL,
  depositor_phone TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (escrow_id) REFERENCES payment_escrow(id)
);

CREATE TABLE IF NOT EXISTS escrow_approval_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_id UUID NOT NULL REFERENCES payment_escrow(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL,
  approver_role TEXT NOT NULL CHECK (approver_role IN ('group_admin', 'platform_admin')),
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'flagged')),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_escrow_request_id ON payment_escrow(request_id);
CREATE INDEX idx_payment_escrow_coop_id ON payment_escrow(coop_id);
CREATE INDEX idx_payment_escrow_status ON payment_escrow(status);
CREATE INDEX idx_escrow_deposits_escrow_id ON escrow_deposits(escrow_id);
CREATE INDEX idx_escrow_deposits_verified ON escrow_deposits(verified);

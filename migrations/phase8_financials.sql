-- Phase 8: Financial Hardening - Escrow and Auto-Release (Production-Ready)
-- 1) Balance columns (IF NOT EXISTS)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS balance DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS frozen_balance DECIMAL(12,2) DEFAULT 0;

-- 2) Transaction status and release_at
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'RELEASED',
ADD COLUMN IF NOT EXISTS release_at TIMESTAMP WITH TIME ZONE;

-- 3) Auto-Release engine
CREATE OR REPLACE FUNCTION release_frozen_funds()
RETURNS void AS $$
BEGIN
    -- Update companies: Add amount to 'balance' and subtract from 'frozen_balance'
    UPDATE companies c
    SET 
        balance = c.balance + COALESCE(sub.total_amount, 0),
        frozen_balance = c.frozen_balance - COALESCE(sub.total_amount, 0)
    FROM (
        SELECT company_id, SUM(amount) as total_amount
        FROM transactions
        WHERE status = 'PENDING' AND release_at <= NOW()
        GROUP BY company_id
    ) sub
    WHERE c.id = sub.company_id;

    -- Mark transactions as RELEASED
    UPDATE transactions
    SET status = 'RELEASED'
    WHERE status = 'PENDING' AND release_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- To run automatically: enable pg_cron and schedule:
-- SELECT cron.schedule('release-funds-task', '*/15 * * * *', 'SELECT release_frozen_funds();');

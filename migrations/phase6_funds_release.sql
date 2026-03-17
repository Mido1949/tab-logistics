-- Phase 6: Funds release routine (optional: cron/postgres cron)
CREATE OR REPLACE FUNCTION release_frozen_commissions() RETURNS void AS $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id, company_id, order_id, amount FROM transactions WHERE status = 'PENDING' AND release_at <= now() LOOP
    -- move to released
    UPDATE transactions SET status = 'RELEASED' WHERE id = rec.id;
    -- credit available balance; decrement frozen_balance
    UPDATE companies SET balance = balance + rec.amount, frozen_balance = GREATEST(0, frozen_balance - rec.amount) WHERE id = rec.company_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule using pg_cron (if available)
-- SELECT cron.schedule('*/6 * * * *', 'SELECT release_frozen_commissions()');

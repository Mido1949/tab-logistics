-- Phase 5/Phase D: metrics (rating/score) on companies
ALTER TABLE companies ADD COLUMN rating DECIMAL DEFAULT 0;
ALTER TABLE companies ADD COLUMN total_orders INT DEFAULT 0;
ALTER TABLE companies ADD COLUMN score DECIMAL DEFAULT 0;

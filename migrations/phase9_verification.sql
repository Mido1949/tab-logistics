-- Phase 9: Trust & Verification System
-- 1) Add verification fields to companies
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'UNVERIFIED', -- 'UNVERIFIED', 'PENDING', 'VERIFIED'
ADD COLUMN IF NOT EXISTS tax_id_doc_url TEXT,
ADD COLUMN IF NOT EXISTS commercial_registry_doc_url TEXT;

-- 2) Update companies with some seed data if needed (optional)
-- UPDATE companies SET verification_status = 'VERIFIED' WHERE name = 'Origin Corp';

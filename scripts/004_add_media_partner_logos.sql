-- Add media_partner_logos column to seminars table
ALTER TABLE seminars ADD COLUMN IF NOT EXISTS media_partner_logos JSONB;
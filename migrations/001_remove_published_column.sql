-- Migration: Remove published column from pages table
-- All pages are now live by default

-- Drop the published index
DROP INDEX IF EXISTS idx_pages_published;

-- Drop the published column
ALTER TABLE pages DROP COLUMN IF EXISTS published;

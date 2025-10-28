-- Migration: Add live column to pages table
-- Description: Add a boolean column to track whether a page is live/published
-- Rollback: ALTER TABLE pages DROP COLUMN IF EXISTS live;

-- Add live column with default value of false
ALTER TABLE pages
ADD COLUMN live BOOLEAN NOT NULL DEFAULT false;

-- Create an index on live column for faster filtering
CREATE INDEX idx_pages_live ON pages(live);

-- Update existing pages to be live by default
UPDATE pages SET live = true;

-- Add comment to column
COMMENT ON COLUMN pages.live IS 'Whether the page is live and publicly accessible';

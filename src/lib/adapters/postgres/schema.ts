/**
 * PostgreSQL database schema for FireCMS
 * Compatible with Neon serverless Postgres
 */
export const SCHEMA_SQL = `
  -- Enable UUID extension if not already enabled
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Pages table
  CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    published BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Sections table
  CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL,
    title TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
  );

  -- Blocks table
  CREATE TABLE IF NOT EXISTS blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    "order" INTEGER NOT NULL,
    data JSONB NOT NULL,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
  );

  -- Indexes for performance
  CREATE INDEX IF NOT EXISTS idx_sections_page_id ON sections(page_id);
  CREATE INDEX IF NOT EXISTS idx_sections_order ON sections("order");
  CREATE INDEX IF NOT EXISTS idx_blocks_section_id ON blocks(section_id);
  CREATE INDEX IF NOT EXISTS idx_blocks_order ON blocks("order");
  CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
  CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(published);
  CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at DESC);

  -- GIN index for JSONB data in blocks for faster queries
  CREATE INDEX IF NOT EXISTS idx_blocks_data_gin ON blocks USING GIN (data);
`;

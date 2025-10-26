/**
 * SQLite database schema for FireCMS
 */
export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    published INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    title TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS blocks (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL,
    type TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sections_page_id ON sections(page_id);
  CREATE INDEX IF NOT EXISTS idx_sections_order ON sections("order");
  CREATE INDEX IF NOT EXISTS idx_blocks_section_id ON blocks(section_id);
  CREATE INDEX IF NOT EXISTS idx_blocks_order ON blocks("order");
  CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
`;

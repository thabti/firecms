import Database from "better-sqlite3";
import path from "path";
import type { StorageAdapter } from "@/types/storage";
import type {
  Page,
  Section,
  Block,
  CreatePageInput,
  UpdatePageInput,
  CreateSectionInput,
  UpdateSectionInput,
  CreateBlockInput,
  UpdateBlockInput,
} from "@/types";

export class SQLiteAdapter implements StorageAdapter {
  private db: Database.Database;
  private dbPath: string;

  constructor(dataDir: string = "./data") {
    this.dbPath = path.join(process.cwd(), dataDir, "cms.db");
    this.db = new Database(this.dbPath);
  }

  async initialize(): Promise<void> {
    // Create tables if they don't exist
    this.db.exec(`
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
    `);

    // Enable foreign keys
    this.db.pragma("foreign_keys = ON");

    console.log(`SQLite adapter initialized at ${this.dbPath}`);
  }

  private serializePage(row: any, sections: Section[]): Page {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      sections,
      published: row.published === 1,
      version: row.version,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private serializeSection(row: any, blocks: Block[]): Section {
    return {
      id: row.id,
      title: row.title,
      blocks,
      order: row.order,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private serializeBlock(row: any): Block {
    const data = JSON.parse(row.data);
    return {
      id: row.id,
      type: row.type,
      order: row.order,
      ...data,
    } as Block;
  }

  async getPages(): Promise<Page[]> {
    const pages = this.db
      .prepare("SELECT * FROM pages ORDER BY created_at DESC")
      .all();

    return pages.map((page: any) => {
      const sections = this.getSectionsForPage(page.id);
      return this.serializePage(page, sections);
    });
  }

  private getSectionsForPage(pageId: string): Section[] {
    const sections = this.db
      .prepare('SELECT * FROM sections WHERE page_id = ? ORDER BY "order"')
      .all(pageId);

    return sections.map((section: any) => {
      const blocks = this.getBlocksForSection(section.id);
      return this.serializeSection(section, blocks);
    });
  }

  private getBlocksForSection(sectionId: string): Block[] {
    const blocks = this.db
      .prepare('SELECT * FROM blocks WHERE section_id = ? ORDER BY "order"')
      .all(sectionId);

    return blocks.map((block: any) => this.serializeBlock(block));
  }

  async getPage(id: string): Promise<Page | null> {
    const page = this.db.prepare("SELECT * FROM pages WHERE id = ?").get(id);
    if (!page) return null;

    const sections = this.getSectionsForPage(id);
    return this.serializePage(page, sections);
  }

  async getPageBySlug(slug: string): Promise<Page | null> {
    const page = this.db
      .prepare("SELECT * FROM pages WHERE slug = ?")
      .get(slug);
    if (!page) return null;

    const sections = this.getSectionsForPage((page as any).id);
    return this.serializePage(page, sections);
  }

  async createPage(data: CreatePageInput): Promise<Page> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    this.db
      .prepare(
        `INSERT INTO pages (id, slug, title, description, published, version, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 1, ?, ?)`
      )
      .run(
        id,
        data.slug,
        data.title,
        data.description || null,
        data.published ? 1 : 0,
        now,
        now
      );

    return {
      id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      sections: [],
      published: data.published ?? false,
      version: 1,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async updatePage(id: string, data: UpdatePageInput): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      params.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      params.push(data.description);
    }
    if (data.published !== undefined) {
      updates.push("published = ?");
      params.push(data.published ? 1 : 0);
    }

    updates.push("updated_at = ?", "version = version + 1");
    params.push(new Date().toISOString(), id);

    this.db
      .prepare(`UPDATE pages SET ${updates.join(", ")} WHERE id = ?`)
      .run(...params);
  }

  async deletePage(id: string): Promise<void> {
    this.db.prepare("DELETE FROM pages WHERE id = ?").run(id);
  }

  async createSection(data: CreateSectionInput): Promise<Section> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Get current section count for ordering
    const count: any = this.db
      .prepare("SELECT COUNT(*) as count FROM sections WHERE page_id = ?")
      .get(data.pageId);
    const order = data.order ?? count.count;

    this.db
      .prepare(
        `INSERT INTO sections (id, page_id, title, "order", created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(id, data.pageId, data.title, order, now, now);

    // Update page version and timestamp
    this.db
      .prepare(
        "UPDATE pages SET updated_at = ?, version = version + 1 WHERE id = ?"
      )
      .run(now, data.pageId);

    return {
      id,
      title: data.title,
      blocks: [],
      order,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async updateSection(
    pageId: string,
    sectionId: string,
    data: UpdateSectionInput
  ): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      params.push(data.title);
    }
    if (data.order !== undefined) {
      updates.push('"order" = ?');
      params.push(data.order);
    }

    updates.push("updated_at = ?");
    params.push(new Date().toISOString(), sectionId);

    this.db
      .prepare(`UPDATE sections SET ${updates.join(", ")} WHERE id = ?`)
      .run(...params);

    // Update page version and timestamp
    const now = new Date().toISOString();
    this.db
      .prepare(
        "UPDATE pages SET updated_at = ?, version = version + 1 WHERE id = ?"
      )
      .run(now, pageId);
  }

  async deleteSection(pageId: string, sectionId: string): Promise<void> {
    this.db.prepare("DELETE FROM sections WHERE id = ?").run(sectionId);

    // Update page version and timestamp
    const now = new Date().toISOString();
    this.db
      .prepare(
        "UPDATE pages SET updated_at = ?, version = version + 1 WHERE id = ?"
      )
      .run(now, pageId);
  }

  async createBlock(data: CreateBlockInput): Promise<Block> {
    const id = crypto.randomUUID();
    const { pageId, sectionId, type, order, ...blockData } = data;

    // Get current block count for ordering
    const count: any = this.db
      .prepare("SELECT COUNT(*) as count FROM blocks WHERE section_id = ?")
      .get(sectionId);
    const finalOrder = order ?? count.count;

    this.db
      .prepare(
        `INSERT INTO blocks (id, section_id, type, "order", data)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(id, sectionId, type, finalOrder, JSON.stringify(blockData));

    // Update section and page timestamps
    const now = new Date().toISOString();
    this.db.prepare("UPDATE sections SET updated_at = ? WHERE id = ?").run(now, sectionId);
    this.db
      .prepare(
        "UPDATE pages SET updated_at = ?, version = version + 1 WHERE id = ?"
      )
      .run(now, pageId);

    return {
      id,
      type,
      order: finalOrder,
      ...blockData,
    } as Block;
  }

  async updateBlock(
    pageId: string,
    sectionId: string,
    blockId: string,
    data: UpdateBlockInput
  ): Promise<void> {
    // Get existing block
    const existing: any = this.db
      .prepare("SELECT * FROM blocks WHERE id = ?")
      .get(blockId);
    if (!existing) throw new Error("Block not found");

    // Merge data
    const existingData = JSON.parse(existing.data);
    const newData = { ...existingData, ...data };

    // Update order separately if provided
    if (data.order !== undefined) {
      this.db
        .prepare('UPDATE blocks SET data = ?, "order" = ? WHERE id = ?')
        .run(JSON.stringify(newData), data.order, blockId);
    } else {
      this.db
        .prepare("UPDATE blocks SET data = ? WHERE id = ?")
        .run(JSON.stringify(newData), blockId);
    }

    // Update section and page timestamps
    const now = new Date().toISOString();
    this.db.prepare("UPDATE sections SET updated_at = ? WHERE id = ?").run(now, sectionId);
    this.db
      .prepare(
        "UPDATE pages SET updated_at = ?, version = version + 1 WHERE id = ?"
      )
      .run(now, pageId);
  }

  async deleteBlock(
    pageId: string,
    sectionId: string,
    blockId: string
  ): Promise<void> {
    this.db.prepare("DELETE FROM blocks WHERE id = ?").run(blockId);

    // Update section and page timestamps
    const now = new Date().toISOString();
    this.db.prepare("UPDATE sections SET updated_at = ? WHERE id = ?").run(now, sectionId);
    this.db
      .prepare(
        "UPDATE pages SET updated_at = ?, version = version + 1 WHERE id = ?"
      )
      .run(now, pageId);
  }

  async close(): Promise<void> {
    this.db.close();
  }
}

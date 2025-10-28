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
import { SCHEMA_SQL } from "./sqlite/schema";
import {
  serializePage,
  serializeSection,
  serializeBlock,
  updatePageTimestamp,
  updateSectionTimestamp,
} from "./sqlite/serializers";

export class SQLiteAdapter implements StorageAdapter {
  private db: Database.Database;
  private dbPath: string;

  constructor(dataDir: string = "./data") {
    this.dbPath = path.join(process.cwd(), dataDir, "cms.db");
    this.db = new Database(this.dbPath);
  }

  async initialize(): Promise<void> {
    this.db.exec(SCHEMA_SQL);
    this.db.pragma("foreign_keys = ON");
    console.log(`SQLite adapter initialized at ${this.dbPath}`);
  }

  private getSectionsForPage(pageId: string): Section[] {
    const sections = this.db
      .prepare('SELECT * FROM sections WHERE page_id = ? ORDER BY "order"')
      .all(pageId);

    return sections.map((section: any) => {
      const blocks = this.getBlocksForSection(section.id);
      return serializeSection(section, blocks);
    });
  }

  private getBlocksForSection(sectionId: string): Block[] {
    const blocks = this.db
      .prepare('SELECT * FROM blocks WHERE section_id = ? ORDER BY "order"')
      .all(sectionId);

    return blocks.map((block: any) => serializeBlock(block));
  }

  async getPages(): Promise<Page[]> {
    const pages = this.db
      .prepare("SELECT * FROM pages ORDER BY created_at DESC")
      .all();

    return pages.map((page: any) => {
      const sections = this.getSectionsForPage(page.id);
      return serializePage(page, sections);
    });
  }

  async getPage(id: string): Promise<Page | null> {
    const page = this.db.prepare("SELECT * FROM pages WHERE id = ?").get(id);
    if (!page) return null;

    const sections = this.getSectionsForPage(id);
    return serializePage(page, sections);
  }

  async getPageBySlug(slug: string): Promise<Page | null> {
    const page = this.db.prepare("SELECT * FROM pages WHERE slug = ?").get(slug);
    if (!page) return null;

    const sections = this.getSectionsForPage((page as any).id);
    return serializePage(page, sections);
  }

  async createPage(data: CreatePageInput): Promise<Page> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    this.db
      .prepare(
        `INSERT INTO pages (id, slug, title, description, version, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`
      )
      .run(
        id,
        data.slug,
        data.title,
        data.description || null,
        now,
        now
      );

    return {
      id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      sections: [],
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

    updatePageTimestamp(this.db, data.pageId, now);

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

    updatePageTimestamp(this.db, pageId);
  }

  async deleteSection(pageId: string, sectionId: string): Promise<void> {
    this.db.prepare("DELETE FROM sections WHERE id = ?").run(sectionId);
    updatePageTimestamp(this.db, pageId);
  }

  async createBlock(data: CreateBlockInput): Promise<Block> {
    const id = crypto.randomUUID();
    const { pageId, sectionId, type, order, ...blockData } = data;

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

    const now = new Date().toISOString();
    updateSectionTimestamp(this.db, sectionId, now);
    updatePageTimestamp(this.db, pageId, now);

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
    const existing: any = this.db
      .prepare("SELECT * FROM blocks WHERE id = ?")
      .get(blockId);
    if (!existing) throw new Error("Block not found");

    const existingData = JSON.parse(existing.data);
    const newData = { ...existingData, ...data };

    if (data.order !== undefined) {
      this.db
        .prepare('UPDATE blocks SET data = ?, "order" = ? WHERE id = ?')
        .run(JSON.stringify(newData), data.order, blockId);
    } else {
      this.db
        .prepare("UPDATE blocks SET data = ? WHERE id = ?")
        .run(JSON.stringify(newData), blockId);
    }

    const now = new Date().toISOString();
    updateSectionTimestamp(this.db, sectionId, now);
    updatePageTimestamp(this.db, pageId, now);
  }

  async deleteBlock(
    pageId: string,
    sectionId: string,
    blockId: string
  ): Promise<void> {
    this.db.prepare("DELETE FROM blocks WHERE id = ?").run(blockId);

    const now = new Date().toISOString();
    updateSectionTimestamp(this.db, sectionId, now);
    updatePageTimestamp(this.db, pageId, now);
  }

  async close(): Promise<void> {
    this.db.close();
  }
}

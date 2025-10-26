import { Pool, neonConfig } from "@neondatabase/serverless";
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
import { SCHEMA_SQL } from "./postgres/schema";
import {
  serializePage,
  serializeSection,
  serializeBlock,
  updatePageTimestamp,
  updateSectionTimestamp,
} from "./postgres/serializers";

// Enable WebSocket for better performance in serverless environments
neonConfig.fetchConnectionCache = true;

export class PostgresAdapter implements StorageAdapter {
  private pool: Pool;
  private connectionString: string;

  constructor(connectionString?: string) {
    // Support both DATABASE_URL and POSTGRES_URL (common in Vercel/Neon)
    this.connectionString =
      connectionString ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      "";

    if (!this.connectionString) {
      throw new Error(
        "PostgreSQL connection string required. Set DATABASE_URL or POSTGRES_URL environment variable."
      );
    }

    // Create pooled connection - optimized for serverless
    this.pool = new Pool({
      connectionString: this.connectionString,
    });

    // Handle pool errors
    this.pool.on("error", (err: Error) => {
      console.error("Unexpected error on idle Postgres client", err);
    });
  }

  async initialize(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(SCHEMA_SQL);
      console.log("PostgreSQL adapter initialized successfully");
    } finally {
      client.release();
    }
  }

  private async getSectionsForPage(
    client: any,
    pageId: string
  ): Promise<Section[]> {
    const result = await client.query(
      'SELECT * FROM sections WHERE page_id = $1 ORDER BY "order"',
      [pageId]
    );

    const sections = await Promise.all(
      result.rows.map(async (section: any) => {
        const blocks = await this.getBlocksForSection(client, section.id);
        return serializeSection(section, blocks);
      })
    );

    return sections;
  }

  private async getBlocksForSection(
    client: any,
    sectionId: string
  ): Promise<Block[]> {
    const result = await client.query(
      'SELECT * FROM blocks WHERE section_id = $1 ORDER BY "order"',
      [sectionId]
    );

    return result.rows.map((block: any) => serializeBlock(block));
  }

  async getPages(): Promise<Page[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM pages ORDER BY created_at DESC"
      );

      const pages = await Promise.all(
        result.rows.map(async (page: any) => {
          const sections = await this.getSectionsForPage(client, page.id);
          return serializePage(page, sections);
        })
      );

      return pages;
    } finally {
      client.release();
    }
  }

  async getPage(id: string): Promise<Page | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query("SELECT * FROM pages WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) return null;

      const sections = await this.getSectionsForPage(client, id);
      return serializePage(result.rows[0], sections);
    } finally {
      client.release();
    }
  }

  async getPageBySlug(slug: string): Promise<Page | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query("SELECT * FROM pages WHERE slug = $1", [
        slug,
      ]);

      if (result.rows.length === 0) return null;

      const page = result.rows[0];
      const sections = await this.getSectionsForPage(client, page.id);
      return serializePage(page, sections);
    } finally {
      client.release();
    }
  }

  async createPage(data: CreatePageInput): Promise<Page> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO pages (slug, title, description, published, version)
         VALUES ($1, $2, $3, $4, 1)
         RETURNING *`,
        [data.slug, data.title, data.description || null, data.published ?? false]
      );

      const page = result.rows[0];
      return serializePage(page, []);
    } finally {
      client.release();
    }
  }

  async updatePage(id: string, data: UpdatePageInput): Promise<void> {
    const client = await this.pool.connect();
    try {
      const updates: string[] = [];
      const params: any[] = [];
      let paramCount = 1;

      if (data.title !== undefined) {
        updates.push(`title = $${paramCount++}`);
        params.push(data.title);
      }
      if (data.description !== undefined) {
        updates.push(`description = $${paramCount++}`);
        params.push(data.description);
      }
      if (data.published !== undefined) {
        updates.push(`published = $${paramCount++}`);
        params.push(data.published);
      }

      updates.push(`updated_at = NOW()`, `version = version + 1`);
      params.push(id);

      await client.query(
        `UPDATE pages SET ${updates.join(", ")} WHERE id = $${paramCount}`,
        params
      );
    } finally {
      client.release();
    }
  }

  async deletePage(id: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("DELETE FROM pages WHERE id = $1", [id]);
    } finally {
      client.release();
    }
  }

  async createSection(data: CreateSectionInput): Promise<Section> {
    const client = await this.pool.connect();
    try {
      // Get the current count to determine order
      const countResult = await client.query(
        "SELECT COUNT(*) as count FROM sections WHERE page_id = $1",
        [data.pageId]
      );
      const order = data.order ?? parseInt(countResult.rows[0].count);

      const result = await client.query(
        `INSERT INTO sections (page_id, title, "order")
         VALUES ($1, $2, $3)
         RETURNING *`,
        [data.pageId, data.title, order]
      );

      await updatePageTimestamp(client, data.pageId);

      const section = result.rows[0];
      return serializeSection(section, []);
    } finally {
      client.release();
    }
  }

  async updateSection(
    pageId: string,
    sectionId: string,
    data: UpdateSectionInput
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      const updates: string[] = [];
      const params: any[] = [];
      let paramCount = 1;

      if (data.title !== undefined) {
        updates.push(`title = $${paramCount++}`);
        params.push(data.title);
      }
      if (data.order !== undefined) {
        updates.push(`"order" = $${paramCount++}`);
        params.push(data.order);
      }

      updates.push(`updated_at = NOW()`);
      params.push(sectionId);

      await client.query(
        `UPDATE sections SET ${updates.join(", ")} WHERE id = $${paramCount}`,
        params
      );

      await updatePageTimestamp(client, pageId);
    } finally {
      client.release();
    }
  }

  async deleteSection(pageId: string, sectionId: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("DELETE FROM sections WHERE id = $1", [sectionId]);
      await updatePageTimestamp(client, pageId);
    } finally {
      client.release();
    }
  }

  async createBlock(data: CreateBlockInput): Promise<Block> {
    const client = await this.pool.connect();
    try {
      const { pageId, sectionId, type, order, ...blockData } = data;

      // Get the current count to determine order
      const countResult = await client.query(
        "SELECT COUNT(*) as count FROM blocks WHERE section_id = $1",
        [sectionId]
      );
      const finalOrder = order ?? parseInt(countResult.rows[0].count);

      const result = await client.query(
        `INSERT INTO blocks (section_id, type, "order", data)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [sectionId, type, finalOrder, JSON.stringify(blockData)]
      );

      await updateSectionTimestamp(client, sectionId);
      await updatePageTimestamp(client, pageId);

      const block = result.rows[0];
      return serializeBlock(block);
    } finally {
      client.release();
    }
  }

  async updateBlock(
    pageId: string,
    sectionId: string,
    blockId: string,
    data: UpdateBlockInput
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      // Get existing block
      const existing = await client.query(
        "SELECT * FROM blocks WHERE id = $1",
        [blockId]
      );

      if (existing.rows.length === 0) {
        throw new Error("Block not found");
      }

      const existingData = existing.rows[0].data;
      const newData = { ...existingData, ...data };

      if (data.order !== undefined) {
        await client.query(
          'UPDATE blocks SET data = $1, "order" = $2 WHERE id = $3',
          [JSON.stringify(newData), data.order, blockId]
        );
      } else {
        await client.query("UPDATE blocks SET data = $1 WHERE id = $2", [
          JSON.stringify(newData),
          blockId,
        ]);
      }

      await updateSectionTimestamp(client, sectionId);
      await updatePageTimestamp(client, pageId);
    } finally {
      client.release();
    }
  }

  async deleteBlock(
    pageId: string,
    sectionId: string,
    blockId: string
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("DELETE FROM blocks WHERE id = $1", [blockId]);
      await updateSectionTimestamp(client, sectionId);
      await updatePageTimestamp(client, pageId);
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

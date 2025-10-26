import fs from "fs/promises";
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

interface JSONDatabase {
  pages: Page[];
  lastUpdated: string;
}

export class JSONAdapter implements StorageAdapter {
  private dbPath: string;
  private db: JSONDatabase = { pages: [], lastUpdated: new Date().toISOString() };

  constructor(dataDir: string = "./data") {
    this.dbPath = path.join(process.cwd(), dataDir, "cms-data.json");
  }

  async initialize(): Promise<void> {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dbPath);
      await fs.mkdir(dataDir, { recursive: true });

      // Try to load existing data
      try {
        const data = await fs.readFile(this.dbPath, "utf-8");
        this.db = JSON.parse(data);

        // Convert date strings back to Date objects
        this.db.pages = this.db.pages.map((page) => ({
          ...page,
          createdAt: new Date(page.createdAt),
          updatedAt: new Date(page.updatedAt),
          sections: page.sections.map((section) => ({
            ...section,
            createdAt: new Date(section.createdAt),
            updatedAt: new Date(section.updatedAt),
          })),
        }));
      } catch (error: any) {
        // File doesn't exist, create new database
        if (error.code === "ENOENT") {
          await this.save();
        } else {
          throw error;
        }
      }
      // Adapter initialized successfully (logging removed to reduce noise)
    } catch (error) {
      console.error("Failed to initialize JSON adapter:", error);
      throw error;
    }
  }

  private async save(): Promise<void> {
    this.db.lastUpdated = new Date().toISOString();
    await fs.writeFile(this.dbPath, JSON.stringify(this.db, null, 2), "utf-8");
  }

  async getPages(): Promise<Page[]> {
    return [...this.db.pages].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getPage(id: string): Promise<Page | null> {
    const page = this.db.pages.find((p) => p.id === id);
    return page ? { ...page } : null;
  }

  async getPageBySlug(slug: string): Promise<Page | null> {
    const page = this.db.pages.find((p) => p.slug === slug);
    return page ? { ...page } : null;
  }

  async createPage(data: CreatePageInput): Promise<Page> {
    const now = new Date();
    const newPage: Page = {
      id: crypto.randomUUID(),
      ...data,
      sections: [],
      published: data.published ?? false,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.db.pages.push(newPage);
    await this.save();

    return { ...newPage };
  }

  async updatePage(id: string, data: UpdatePageInput): Promise<void> {
    const pageIndex = this.db.pages.findIndex((p) => p.id === id);
    if (pageIndex === -1) throw new Error("Page not found");

    this.db.pages[pageIndex] = {
      ...this.db.pages[pageIndex],
      ...data,
      updatedAt: new Date(),
      version: this.db.pages[pageIndex].version + 1,
    };

    await this.save();
  }

  async deletePage(id: string): Promise<void> {
    const pageIndex = this.db.pages.findIndex((p) => p.id === id);
    if (pageIndex === -1) throw new Error("Page not found");

    this.db.pages.splice(pageIndex, 1);
    await this.save();
  }

  async createSection(data: CreateSectionInput): Promise<Section> {
    const { pageId, ...sectionData } = data;
    const page = await this.getPage(pageId);
    if (!page) throw new Error("Page not found");

    const now = new Date();
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: sectionData.title,
      blocks: [],
      order: data.order ?? page.sections.length,
      createdAt: now,
      updatedAt: now,
    };

    const pageIndex = this.db.pages.findIndex((p) => p.id === pageId);
    this.db.pages[pageIndex].sections.push(newSection);
    this.db.pages[pageIndex].updatedAt = now;
    this.db.pages[pageIndex].version += 1;

    await this.save();
    return { ...newSection };
  }

  async updateSection(
    pageId: string,
    sectionId: string,
    data: UpdateSectionInput
  ): Promise<void> {
    const pageIndex = this.db.pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) throw new Error("Page not found");

    const sectionIndex = this.db.pages[pageIndex].sections.findIndex(
      (s) => s.id === sectionId
    );
    if (sectionIndex === -1) throw new Error("Section not found");

    this.db.pages[pageIndex].sections[sectionIndex] = {
      ...this.db.pages[pageIndex].sections[sectionIndex],
      ...data,
      updatedAt: new Date(),
    };
    this.db.pages[pageIndex].updatedAt = new Date();
    this.db.pages[pageIndex].version += 1;

    await this.save();
  }

  async deleteSection(pageId: string, sectionId: string): Promise<void> {
    const pageIndex = this.db.pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) throw new Error("Page not found");

    this.db.pages[pageIndex].sections = this.db.pages[
      pageIndex
    ].sections.filter((s) => s.id !== sectionId);
    this.db.pages[pageIndex].updatedAt = new Date();
    this.db.pages[pageIndex].version += 1;

    await this.save();
  }

  async createBlock(data: CreateBlockInput): Promise<Block> {
    const { pageId, sectionId, ...blockData } = data;
    const pageIndex = this.db.pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) throw new Error("Page not found");

    const sectionIndex = this.db.pages[pageIndex].sections.findIndex(
      (s) => s.id === sectionId
    );
    if (sectionIndex === -1) throw new Error("Section not found");

    const section = this.db.pages[pageIndex].sections[sectionIndex];
    const newBlock: Block = {
      id: crypto.randomUUID(),
      order: blockData.order ?? section.blocks.length,
      ...blockData,
    } as Block;

    this.db.pages[pageIndex].sections[sectionIndex].blocks.push(newBlock);
    this.db.pages[pageIndex].sections[sectionIndex].updatedAt = new Date();
    this.db.pages[pageIndex].updatedAt = new Date();
    this.db.pages[pageIndex].version += 1;

    await this.save();
    return { ...newBlock };
  }

  async updateBlock(
    pageId: string,
    sectionId: string,
    blockId: string,
    data: UpdateBlockInput
  ): Promise<void> {
    const pageIndex = this.db.pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) throw new Error("Page not found");

    const sectionIndex = this.db.pages[pageIndex].sections.findIndex(
      (s) => s.id === sectionId
    );
    if (sectionIndex === -1) throw new Error("Section not found");

    const blockIndex = this.db.pages[pageIndex].sections[
      sectionIndex
    ].blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) throw new Error("Block not found");

    this.db.pages[pageIndex].sections[sectionIndex].blocks[blockIndex] = {
      ...this.db.pages[pageIndex].sections[sectionIndex].blocks[blockIndex],
      ...data,
    };
    this.db.pages[pageIndex].sections[sectionIndex].updatedAt = new Date();
    this.db.pages[pageIndex].updatedAt = new Date();
    this.db.pages[pageIndex].version += 1;

    await this.save();
  }

  async deleteBlock(
    pageId: string,
    sectionId: string,
    blockId: string
  ): Promise<void> {
    const pageIndex = this.db.pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) throw new Error("Page not found");

    const sectionIndex = this.db.pages[pageIndex].sections.findIndex(
      (s) => s.id === sectionId
    );
    if (sectionIndex === -1) throw new Error("Section not found");

    this.db.pages[pageIndex].sections[sectionIndex].blocks = this.db.pages[
      pageIndex
    ].sections[sectionIndex].blocks.filter((b) => b.id !== blockId);
    this.db.pages[pageIndex].sections[sectionIndex].updatedAt = new Date();
    this.db.pages[pageIndex].updatedAt = new Date();
    this.db.pages[pageIndex].version += 1;

    await this.save();
  }

  async close(): Promise<void> {
    // Ensure final save before closing
    await this.save();
  }
}

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

/**
 * Storage adapter interface for different backends (SQLite, JSON, PostgreSQL)
 */
export interface StorageAdapter {
  // Pages
  getPages(liveOnly?: boolean): Promise<Page[]>;
  getPage(id: string): Promise<Page | null>;
  getPageBySlug(slug: string): Promise<Page | null>;
  createPage(data: CreatePageInput): Promise<Page>;
  updatePage(id: string, data: UpdatePageInput): Promise<void>;
  deletePage(id: string): Promise<void>;

  // Sections
  createSection(data: CreateSectionInput): Promise<Section>;
  updateSection(pageId: string, sectionId: string, data: UpdateSectionInput): Promise<void>;
  deleteSection(pageId: string, sectionId: string): Promise<void>;

  // Blocks
  createBlock(data: CreateBlockInput): Promise<Block>;
  updateBlock(pageId: string, sectionId: string, blockId: string, data: UpdateBlockInput): Promise<void>;
  deleteBlock(pageId: string, sectionId: string, blockId: string): Promise<void>;

  // Utility
  initialize(): Promise<void>;
  close?(): Promise<void>;
}

export type StorageType = "json" | "sqlite" | "postgres";

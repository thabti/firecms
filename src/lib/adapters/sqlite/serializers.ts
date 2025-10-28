import type { Page, Section, Block } from "@/types";

/**
 * Convert database row to Page object
 */
export function serializePage(row: any, sections: Section[]): Page {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    sections,
    version: row.version,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Convert database row to Section object
 */
export function serializeSection(row: any, blocks: Block[]): Section {
  return {
    id: row.id,
    title: row.title,
    blocks,
    order: row.order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Convert database row to Block object
 */
export function serializeBlock(row: any): Block {
  const data = JSON.parse(row.data);
  return {
    id: row.id,
    type: row.type,
    order: row.order,
    ...data,
  } as Block;
}

/**
 * Update page timestamp and version
 */
export function updatePageTimestamp(
  db: any,
  pageId: string,
  now: string = new Date().toISOString()
): void {
  db.prepare(
    "UPDATE pages SET updated_at = ?, version = version + 1 WHERE id = ?"
  ).run(now, pageId);
}

/**
 * Update section timestamp
 */
export function updateSectionTimestamp(
  db: any,
  sectionId: string,
  now: string = new Date().toISOString()
): void {
  db.prepare("UPDATE sections SET updated_at = ? WHERE id = ?").run(now, sectionId);
}

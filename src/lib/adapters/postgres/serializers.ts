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
    published: row.published,
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
  return {
    id: row.id,
    type: row.type,
    order: row.order,
    ...row.data,
  } as Block;
}

/**
 * Update page timestamp and version
 */
export async function updatePageTimestamp(
  client: any,
  pageId: string
): Promise<void> {
  await client.query(
    `UPDATE pages
     SET updated_at = NOW(), version = version + 1
     WHERE id = $1`,
    [pageId]
  );
}

/**
 * Update section timestamp
 */
export async function updateSectionTimestamp(
  client: any,
  sectionId: string
): Promise<void> {
  await client.query(
    `UPDATE sections
     SET updated_at = NOW()
     WHERE id = $1`,
    [sectionId]
  );
}

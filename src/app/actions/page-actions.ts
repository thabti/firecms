"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getStorageAdapter } from "@/lib/adapters";
import type {
  CreatePageInput,
  UpdatePageInput,
  CreateSectionInput,
  UpdateSectionInput,
  CreateBlockInput,
  UpdateBlockInput,
} from "@/types";

/**
 * Server Action: Create a new page
 */
export async function createPageAction(data: CreatePageInput) {
  try {
    const adapter = await getStorageAdapter();
    const page = await adapter.createPage(data);

    // Revalidate the admin pages list
    revalidatePath("/admin");
    revalidateTag("pages");

    return { success: true, data: page };
  } catch (error) {
    console.error("Error creating page:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create page"
    };
  }
}

/**
 * Server Action: Update a page
 */
export async function updatePageAction(id: string, data: UpdatePageInput) {
  try {
    const adapter = await getStorageAdapter();
    await adapter.updatePage(id, data);
    const updatedPage = await adapter.getPage(id);

    // Revalidate both admin and public pages
    revalidatePath("/admin");
    revalidatePath(`/admin/pages/${id}`);
    revalidateTag("pages");
    revalidateTag(`page-${id}`);

    // If page has a slug, revalidate the public page
    if (updatedPage?.slug) {
      revalidatePath(`/${updatedPage.slug}`);
    }

    return { success: true, data: updatedPage };
  } catch (error) {
    console.error("Error updating page:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update page"
    };
  }
}

/**
 * Server Action: Delete a page
 */
export async function deletePageAction(id: string) {
  try {
    const adapter = await getStorageAdapter();

    // Get the page first to know its slug
    const page = await adapter.getPage(id);

    await adapter.deletePage(id);

    // Revalidate paths
    revalidatePath("/admin");
    revalidateTag("pages");

    if (page?.slug) {
      revalidatePath(`/${page.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting page:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete page"
    };
  }
}

/**
 * Server Action: Create a section
 */
export async function createSectionAction(data: CreateSectionInput) {
  try {
    const adapter = await getStorageAdapter();
    const section = await adapter.createSection(data);

    // Revalidate the page
    revalidatePath(`/admin/pages/${data.pageId}`);
    revalidateTag(`page-${data.pageId}`);

    return { success: true, data: section };
  } catch (error) {
    console.error("Error creating section:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create section"
    };
  }
}

/**
 * Server Action: Update a section
 */
export async function updateSectionAction(
  pageId: string,
  sectionId: string,
  data: UpdateSectionInput
) {
  try {
    const adapter = await getStorageAdapter();
    await adapter.updateSection(pageId, sectionId, data);

    // Revalidate the page
    revalidatePath(`/admin/pages/${pageId}`);
    revalidateTag(`page-${pageId}`);

    // Get page slug and revalidate public page
    const page = await adapter.getPage(pageId);
    if (page?.slug) {
      revalidatePath(`/${page.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating section:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update section"
    };
  }
}

/**
 * Server Action: Delete a section
 */
export async function deleteSectionAction(pageId: string, sectionId: string) {
  try {
    const adapter = await getStorageAdapter();
    await adapter.deleteSection(pageId, sectionId);

    // Revalidate the page
    revalidatePath(`/admin/pages/${pageId}`);
    revalidateTag(`page-${pageId}`);

    // Get page slug and revalidate public page
    const page = await adapter.getPage(pageId);
    if (page?.slug) {
      revalidatePath(`/${page.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting section:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete section"
    };
  }
}

/**
 * Server Action: Create a block
 */
export async function createBlockAction(data: CreateBlockInput) {
  try {
    const adapter = await getStorageAdapter();
    const block = await adapter.createBlock(data);

    // Revalidate the page
    revalidatePath(`/admin/pages/${data.pageId}`);
    revalidateTag(`page-${data.pageId}`);

    // Get page slug and revalidate public page
    const page = await adapter.getPage(data.pageId);
    if (page?.slug) {
      revalidatePath(`/${page.slug}`);
    }

    return { success: true, data: block };
  } catch (error) {
    console.error("Error creating block:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create block"
    };
  }
}

/**
 * Server Action: Update a block
 */
export async function updateBlockAction(
  pageId: string,
  sectionId: string,
  blockId: string,
  data: UpdateBlockInput
) {
  try {
    const adapter = await getStorageAdapter();
    await adapter.updateBlock(pageId, sectionId, blockId, data);

    // Revalidate the page
    revalidatePath(`/admin/pages/${pageId}`);
    revalidateTag(`page-${pageId}`);

    // Get page slug and revalidate public page
    const page = await adapter.getPage(pageId);
    if (page?.slug) {
      revalidatePath(`/${page.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating block:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update block"
    };
  }
}

/**
 * Server Action: Delete a block
 */
export async function deleteBlockAction(
  pageId: string,
  sectionId: string,
  blockId: string
) {
  try {
    const adapter = await getStorageAdapter();
    await adapter.deleteBlock(pageId, sectionId, blockId);

    // Revalidate the page
    revalidatePath(`/admin/pages/${pageId}`);
    revalidateTag(`page-${pageId}`);

    // Get page slug and revalidate public page
    const page = await adapter.getPage(pageId);
    if (page?.slug) {
      revalidatePath(`/${page.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting block:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete block"
    };
  }
}

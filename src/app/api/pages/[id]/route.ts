import { NextRequest } from "next/server";
import { getStorageAdapter } from "@/lib/adapters";
import { createAPIResponse, createErrorResponse, getRequestId } from "@/lib/api-utils";
import type { UpdatePageInput } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id } = await params;
    const adapter = await getStorageAdapter();
    const page = await adapter.getPage(id);

    if (!page) {
      return createErrorResponse(new Error("Page not found"), 404, { requestId });
    }

    return createAPIResponse(page, { requestId });
  } catch (error) {
    console.error("Error fetching page:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id } = await params;
    const body = await request.json();
    const data: UpdatePageInput = {
      title: body.title,
      description: body.description,
      published: body.published,
    };

    const adapter = await getStorageAdapter();
    await adapter.updatePage(id, data);
    const updatedPage = await adapter.getPage(id);

    return createAPIResponse(updatedPage, { requestId });
  } catch (error) {
    console.error("Error updating page:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id } = await params;
    console.log(`[DELETE /api/pages/${id}] Starting deletion process`);
    console.log(`[DELETE] Request ID: ${requestId}`);

    const adapter = await getStorageAdapter();
    console.log(`[DELETE] Storage adapter obtained:`, adapter.constructor.name);

    // Check if page exists before deletion
    const existingPage = await adapter.getPage(id);
    console.log(`[DELETE] Page exists check:`, existingPage ? 'Found' : 'Not found');
    if (existingPage) {
      console.log(`[DELETE] Page to delete:`, {
        id: existingPage.id,
        title: existingPage.title,
        slug: existingPage.slug
      });
    }

    await adapter.deletePage(id);
    console.log(`[DELETE] Page deleted successfully`);

    return createAPIResponse({ success: true }, { requestId });
  } catch (error) {
    console.error(`[DELETE] Error deleting page:`, error);
    console.error(`[DELETE] Error stack:`, (error as Error).stack);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

import { NextRequest } from "next/server";
import { getStorageAdapter } from "@/lib/adapters";
import { createAPIResponse, createErrorResponse, getRequestId } from "@/lib/api-utils";
import type { UpdateBlockInput } from "@/types";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; sectionId: string; blockId: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id, sectionId, blockId } = await params;
    const body = await request.json();
    const data: UpdateBlockInput = {
      content: body.content,
      url: body.url,
      alt: body.alt,
      caption: body.caption,
      level: body.level,
      items: body.items,
      ordered: body.ordered,
      author: body.author,
      order: body.order,
    };

    const adapter = await getStorageAdapter();
    await adapter.updateBlock(id, sectionId, blockId, data);

    return createAPIResponse({ success: true }, { requestId });
  } catch (error) {
    console.error("Error updating block:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; sectionId: string; blockId: string }> }
) {
  return PUT(request, { params });
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; sectionId: string; blockId: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id, sectionId, blockId } = await params;
    const adapter = await getStorageAdapter();
    await adapter.deleteBlock(id, sectionId, blockId);

    return createAPIResponse({ success: true }, { requestId });
  } catch (error) {
    console.error("Error deleting block:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

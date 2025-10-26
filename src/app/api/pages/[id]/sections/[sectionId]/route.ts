import { NextRequest } from "next/server";
import { getStorageAdapter } from "@/lib/adapters";
import { createAPIResponse, createErrorResponse, getRequestId } from "@/lib/api-utils";
import type { UpdateSectionInput } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id, sectionId } = await params;
    const body = await request.json();
    const data: UpdateSectionInput = {
      title: body.title,
      order: body.order,
    };

    const adapter = await getStorageAdapter();
    await adapter.updateSection(id, sectionId, data);

    return createAPIResponse({ success: true }, { requestId });
  } catch (error) {
    console.error("Error updating section:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id, sectionId } = await params;
    const adapter = await getStorageAdapter();
    await adapter.deleteSection(id, sectionId);

    return createAPIResponse({ success: true }, { requestId });
  } catch (error) {
    console.error("Error deleting section:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

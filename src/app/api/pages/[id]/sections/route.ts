import { NextRequest } from "next/server";
import { getStorageAdapter } from "@/lib/adapters";
import { createAPIResponse, createErrorResponse, getRequestId } from "@/lib/api-utils";
import type { CreateSectionInput } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id } = await params;
    const body = await request.json();
    const data: CreateSectionInput = {
      pageId: id,
      title: body.title,
      order: body.order,
    };

    const adapter = await getStorageAdapter();
    const section = await adapter.createSection(data);

    return createAPIResponse(section, { requestId, status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

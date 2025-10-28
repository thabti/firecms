import { NextRequest } from "next/server";
import { getStorageAdapter } from "@/lib/adapters";
import { createAPIResponse, createErrorResponse, getRequestId } from "@/lib/api-utils";
import type { CreateBlockInput } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id, sectionId } = await params;
    const body = await request.json();
    const data: CreateBlockInput = {
      pageId: id,
      sectionId: sectionId,
      type: body.type,
      // Text & Heading
      content: body.content,
      level: body.level,
      // Image & Video
      url: body.url,
      urls: body.urls,
      alt: body.alt,
      caption: body.caption,
      dimensions: body.dimensions,
      // List
      items: body.items,
      ordered: body.ordered,
      // Quote
      author: body.author,
      // Action
      actionType: body.actionType,
      label: body.label,
      style: body.style,
      openInNewTab: body.openInNewTab,
      // General
      order: body.order,
    };

    const adapter = await getStorageAdapter();
    const block = await adapter.createBlock(data);

    return createAPIResponse(block, { requestId, status: 201 });
  } catch (error) {
    console.error("Error creating block:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

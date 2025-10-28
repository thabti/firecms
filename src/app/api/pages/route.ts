import { NextRequest } from "next/server";
import { getStorageAdapter } from "@/lib/adapters";
import { createAPIResponse, createErrorResponse, getRequestId } from "@/lib/api-utils";
import type { CreatePageInput } from "@/types";

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request.headers);

  try {
    const adapter = await getStorageAdapter();
    const pages = await adapter.getPages();
    return createAPIResponse(pages, { requestId });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request.headers);

  try {
    const body = await request.json();
    const data: CreatePageInput = {
      slug: body.slug,
      title: body.title,
      description: body.description,
    };

    const adapter = await getStorageAdapter();
    const page = await adapter.createPage(data);
    return createAPIResponse(page, { requestId, status: 201 });
  } catch (error) {
    console.error("Error creating page:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}

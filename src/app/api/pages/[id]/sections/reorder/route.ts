import { NextRequest, NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/adapters";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: pageId } = await context.params;
    const { sectionIds } = await request.json();

    if (!Array.isArray(sectionIds)) {
      return NextResponse.json(
        { error: "sectionIds must be an array" },
        { status: 400 }
      );
    }

    const adapter = await getStorageAdapter();
    const page = await adapter.getPage(pageId);

    if (!page) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      );
    }

    // Update the order property for each section based on its position in the array
    await Promise.all(
      sectionIds.map((sectionId, index) =>
        adapter.updateSection(pageId, sectionId, { order: index })
      )
    );

    // Fetch the updated page to return
    const updatedPage = await adapter.getPage(pageId);

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error reordering sections:", error);
    return NextResponse.json(
      { error: "Failed to reorder sections" },
      { status: 500 }
    );
  }
}

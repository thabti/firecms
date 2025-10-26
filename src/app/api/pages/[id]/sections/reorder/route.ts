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

    // Reorder sections based on the provided IDs
    const reorderedSections = sectionIds
      .map(id => page.sections.find(s => s.id === id))
      .filter(Boolean);

    // Update the order property for each section
    reorderedSections.forEach((section, index) => {
      if (section) {
        section.order = index;
      }
    });

    // Update the page with reordered sections
    const updatedPage = await adapter.updatePage(pageId, {
      sections: reorderedSections,
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error reordering sections:", error);
    return NextResponse.json(
      { error: "Failed to reorder sections" },
      { status: 500 }
    );
  }
}

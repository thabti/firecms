import { NextRequest, NextResponse } from "next/server";
import { updateBlock, deleteBlock } from "@/lib/db";
import type { UpdateBlockInput } from "@/types";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; sectionId: string; blockId: string }> }
) {
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

    await updateBlock(id, sectionId, blockId, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating block:", error);
    return NextResponse.json(
      { error: "Failed to update block" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; sectionId: string; blockId: string }> }
) {
  try {
    const { id, sectionId, blockId } = await params;
    await deleteBlock(id, sectionId, blockId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting block:", error);
    return NextResponse.json(
      { error: "Failed to delete block" },
      { status: 500 }
    );
  }
}

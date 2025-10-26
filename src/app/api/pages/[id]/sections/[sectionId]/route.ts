import { NextRequest, NextResponse } from "next/server";
import { updateSection, deleteSection } from "@/lib/db";
import type { UpdateSectionInput } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    const { id, sectionId } = await params;
    const body = await request.json();
    const data: UpdateSectionInput = {
      title: body.title,
      order: body.order,
    };

    await updateSection(id, sectionId, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    const { id, sectionId } = await params;
    await deleteSection(id, sectionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}

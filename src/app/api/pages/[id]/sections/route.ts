import { NextRequest, NextResponse } from "next/server";
import { createSection } from "@/lib/db";
import type { CreateSectionInput } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: CreateSectionInput = {
      pageId: id,
      title: body.title,
      order: body.order,
    };

    const section = await createSection(data);
    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}

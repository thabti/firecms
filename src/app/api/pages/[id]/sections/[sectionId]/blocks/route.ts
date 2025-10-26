import { NextRequest, NextResponse } from "next/server";
import { createBlock } from "@/lib/db";
import type { CreateBlockInput } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    const { id, sectionId } = await params;
    const body = await request.json();
    const data: CreateBlockInput = {
      pageId: id,
      sectionId: sectionId,
      type: body.type,
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

    const block = await createBlock(data);
    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error("Error creating block:", error);
    return NextResponse.json(
      { error: "Failed to create block" },
      { status: 500 }
    );
  }
}

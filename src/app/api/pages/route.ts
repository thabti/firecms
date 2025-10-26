import { NextRequest, NextResponse } from "next/server";
import { getPages, createPage } from "@/lib/db";
import type { CreatePageInput } from "@/types";

export async function GET() {
  try {
    const pages = await getPages();
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: CreatePageInput = {
      slug: body.slug,
      title: body.title,
      description: body.description,
      published: body.published ?? false,
    };

    const page = await createPage(data);
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}

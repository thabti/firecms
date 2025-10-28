import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    // Read the OpenAPI spec from the root directory
    const openapiPath = join(process.cwd(), "openapi.yaml");
    const openapiContent = readFileSync(openapiPath, "utf-8");

    // Return as YAML with text/plain to render in browser
    return new NextResponse(openapiContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error reading OpenAPI spec:", error);
    return NextResponse.json(
      { error: "Failed to load OpenAPI specification" },
      { status: 500 }
    );
  }
}

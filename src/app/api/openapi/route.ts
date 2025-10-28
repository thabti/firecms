import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import yaml from "yaml";

export async function GET(request: NextRequest) {
  try {
    // Read the OpenAPI spec from the root directory
    const openapiPath = join(process.cwd(), "openapi.yaml");
    const openapiContent = readFileSync(openapiPath, "utf-8");

    // Parse YAML and convert to JSON
    const openapiJson = yaml.parse(openapiContent);

    // Return as JSON
    return NextResponse.json(openapiJson, {
      status: 200,
      headers: {
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

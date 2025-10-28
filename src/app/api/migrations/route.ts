import { NextRequest, NextResponse } from "next/server";
import { getMigrationStatus, runMigrations } from "@/lib/migrations/runner";
import { join } from "path";

/**
 * GET /api/migrations - Get migration status
 * Returns list of executed and pending migrations
 */
export async function GET(request: NextRequest) {
  try {
    const connectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
      return NextResponse.json(
        { error: "Database connection string not configured" },
        { status: 500 }
      );
    }

    const migrationsDir = join(process.cwd(), "migrations");
    const status = await getMigrationStatus(migrationsDir, connectionString);

    return NextResponse.json({
      success: true,
      executed: status.executed,
      pending: status.pending,
      totalExecuted: status.executed.length,
      totalPending: status.pending.length,
    });
  } catch (error) {
    console.error("Failed to get migration status:", error);
    return NextResponse.json(
      {
        error: "Failed to get migration status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/migrations - Apply pending migrations
 * Executes all pending migration files
 */
export async function POST(request: NextRequest) {
  try {
    const connectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
      return NextResponse.json(
        { error: "Database connection string not configured" },
        { status: 500 }
      );
    }

    const migrationsDir = join(process.cwd(), "migrations");
    const result = await runMigrations(migrationsDir, connectionString);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Migrations applied successfully",
        appliedCount: result.appliedCount,
        totalCount: result.totalCount,
        details: result.details,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          appliedCount: result.appliedCount,
          details: result.details,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to run migrations:", error);
    return NextResponse.json(
      {
        error: "Failed to run migrations",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

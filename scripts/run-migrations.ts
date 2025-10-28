#!/usr/bin/env tsx
import { runMigrations } from "../src/lib/migrations/runner";
import { join } from "path";

async function main(): Promise<void> {
  const connectionString =
    process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error(
      "Database connection string required. Set DATABASE_URL or POSTGRES_URL environment variable."
    );
  }

  console.log("🚀 Starting migration runner...\n");

  const migrationsDir = join(process.cwd(), "migrations");
  const result = await runMigrations(migrationsDir, connectionString);

  console.log("\n📊 Migration Results:");
  console.log("─".repeat(50));

  result.details.forEach((detail) => {
    const statusIcon = {
      applied: "✓",
      skipped: "⊘",
      failed: "✗",
      executed: "✓",
    }[detail.status];

    console.log(
      `${statusIcon} [${detail.id.toString().padStart(3, "0")}] ${detail.name} (${detail.status})`
    );
    if (detail.error) {
      console.log(`  Error: ${detail.error}`);
    }
  });

  console.log("─".repeat(50));

  if (result.success) {
    console.log(`\n✓ Migration process complete!`);
    console.log(`  Applied: ${result.appliedCount}`);
    console.log(`  Total migrations: ${result.totalCount}`);
  } else {
    console.error(`\n✗ Migration failed: ${result.error}`);
    process.exit(1);
  }
}

// Run migrations
main();

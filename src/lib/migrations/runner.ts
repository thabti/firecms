import { Pool } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export interface Migration {
  id: number;
  name: string;
  executed_at: Date;
}

export interface MigrationResult {
  success: boolean;
  appliedCount: number;
  totalCount: number;
  error?: string;
  details: Array<{
    id: number;
    name: string;
    status: "executed" | "skipped" | "applied" | "failed";
    error?: string;
  }>;
}

const MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    executed_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

async function ensureMigrationsTable(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(MIGRATIONS_TABLE);
  } finally {
    client.release();
  }
}

async function getExecutedMigrations(pool: Pool): Promise<Migration[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM schema_migrations ORDER BY id"
    );
    return result.rows;
  } finally {
    client.release();
  }
}

async function recordMigration(
  pool: Pool,
  id: number,
  name: string
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO schema_migrations (id, name) VALUES ($1, $2)",
      [id, name]
    );
  } finally {
    client.release();
  }
}

async function executeMigration(
  pool: Pool,
  id: number,
  name: string,
  sql: string
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(sql);
    await recordMigration(pool, id, name);
  } finally {
    client.release();
  }
}

export async function runMigrations(
  migrationsDir: string,
  connectionString: string
): Promise<MigrationResult> {
  const pool = new Pool({ connectionString });
  const details: MigrationResult["details"] = [];
  let appliedCount = 0;

  try {
    // Ensure migrations table exists
    await ensureMigrationsTable(pool);

    // Get list of executed migrations
    const executedMigrations = await getExecutedMigrations(pool);
    const executedIds = new Set(executedMigrations.map((m) => m.id));

    // Read migration files from migrations directory
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      return {
        success: true,
        appliedCount: 0,
        totalCount: executedIds.size,
        details: [],
      };
    }

    for (const file of files) {
      // Extract ID from filename (e.g., "001_remove_published_column.sql" -> 1)
      const match = file.match(/^(\d+)_(.+)\.sql$/);
      if (!match) {
        details.push({
          id: -1,
          name: file,
          status: "failed",
          error: "Invalid migration filename format",
        });
        continue;
      }

      const id = parseInt(match[1], 10);
      const name = match[2];

      if (executedIds.has(id)) {
        details.push({
          id,
          name,
          status: "skipped",
        });
        continue;
      }

      try {
        // Read and execute migration
        const filePath = join(migrationsDir, file);
        const sql = readFileSync(filePath, "utf-8");

        await executeMigration(pool, id, name, sql);
        appliedCount++;
        details.push({
          id,
          name,
          status: "applied",
        });
      } catch (error) {
        details.push({
          id,
          name,
          status: "failed",
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    }

    return {
      success: true,
      appliedCount,
      totalCount: executedIds.size + appliedCount,
      details,
    };
  } catch (error) {
    return {
      success: false,
      appliedCount,
      totalCount: -1,
      error: error instanceof Error ? error.message : String(error),
      details,
    };
  } finally {
    await pool.end();
  }
}

export async function getMigrationStatus(
  migrationsDir: string,
  connectionString: string
): Promise<{
  executed: Migration[];
  pending: Array<{ id: number; name: string }>;
}> {
  const pool = new Pool({ connectionString });

  try {
    await ensureMigrationsTable(pool);
    const executedMigrations = await getExecutedMigrations(pool);
    const executedIds = new Set(executedMigrations.map((m) => m.id));

    // Read migration files
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const pending: Array<{ id: number; name: string }> = [];

    for (const file of files) {
      const match = file.match(/^(\d+)_(.+)\.sql$/);
      if (match) {
        const id = parseInt(match[1], 10);
        const name = match[2];
        if (!executedIds.has(id)) {
          pending.push({ id, name });
        }
      }
    }

    return {
      executed: executedMigrations,
      pending,
    };
  } finally {
    await pool.end();
  }
}

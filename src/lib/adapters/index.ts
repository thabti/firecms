import type { StorageAdapter, StorageType } from "@/types/storage";
import { JSONAdapter } from "./json-adapter";
import { SQLiteAdapter } from "./sqlite-adapter";
import { PostgresAdapter } from "./postgres-adapter";

let adapterInstance: StorageAdapter | null = null;

/**
 * Get the configured storage adapter
 */
export async function getStorageAdapter(): Promise<StorageAdapter> {
  if (adapterInstance) {
    return adapterInstance;
  }

  const storageType = (process.env.STORAGE_TYPE as StorageType) || "json";
  const dataDir = process.env.DATA_DIR || "./data";

  switch (storageType) {
    case "json":
      adapterInstance = new JSONAdapter(dataDir);
      break;
    case "sqlite":
      adapterInstance = new SQLiteAdapter(dataDir);
      break;
    case "postgres":
      // Support both DATABASE_URL (Neon/Vercel style) and individual params
      const connectionString =
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        undefined;
      adapterInstance = new PostgresAdapter(connectionString);
      break;
    default:
      throw new Error(`Unsupported storage type: ${storageType}`);
  }

  await adapterInstance.initialize();
  return adapterInstance;
}

/**
 * Reset the adapter instance (useful for testing or switching adapters)
 */
export async function resetStorageAdapter(): Promise<void> {
  if (adapterInstance && adapterInstance.close) {
    await adapterInstance.close();
  }
  adapterInstance = null;
}

// Export adapters for direct use
export { JSONAdapter, SQLiteAdapter, PostgresAdapter };

# Database Migrations

This directory contains SQL migration files for the FireCMS database schema.

## Overview

The migration system tracks which migrations have been applied using a `schema_migrations` table. Each migration is applied exactly once and in order by ID.

## Migration File Format

Migration files must follow this naming convention:

```
{ID}_{description}.sql
```

Where:
- `{ID}` is a zero-padded 3-digit number (e.g., 001, 002, 003)
- `{description}` is a snake_case description of the migration

Example: `001_remove_published_column.sql`

## Running Migrations

### Via CLI (Recommended for Development)

Run all pending migrations:

```bash
pnpm migrate
```

This command:
- Reads all `.sql` files from the `migrations/` directory
- Checks which migrations have already been applied
- Executes pending migrations in order
- Records successful migrations in the `schema_migrations` table

### Via API (For Production/Deployment)

#### Check Migration Status

```bash
GET /api/migrations
```

Response:
```json
{
  "success": true,
  "executed": [
    {
      "id": 1,
      "name": "remove_published_column",
      "executed_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pending": [
    {
      "id": 2,
      "name": "add_user_roles"
    }
  ],
  "totalExecuted": 1,
  "totalPending": 1
}
```

#### Apply Pending Migrations

```bash
POST /api/migrations
```

Response:
```json
{
  "success": true,
  "message": "Migrations applied successfully",
  "appliedCount": 1,
  "totalCount": 2,
  "details": [
    {
      "id": 1,
      "name": "remove_published_column",
      "status": "skipped"
    },
    {
      "id": 2,
      "name": "add_user_roles",
      "status": "applied"
    }
  ]
}
```

## Creating a New Migration

1. Create a new `.sql` file in the `migrations/` directory
2. Use the next sequential ID number
3. Write your SQL schema changes

Example (`002_add_user_roles.sql`):

```sql
-- Migration: Add user roles table
-- Description: Create a new table for managing user roles

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_roles_name ON user_roles(name);
```

## Migration Best Practices

1. **Idempotent Operations**: Use `IF EXISTS` / `IF NOT EXISTS` where appropriate
   ```sql
   DROP TABLE IF EXISTS old_table;
   CREATE TABLE IF NOT EXISTS new_table (...);
   ```

2. **One Logical Change Per Migration**: Each migration should represent a single, logical schema change

3. **Non-Breaking Changes First**: When possible, make changes in stages:
   - Add new columns as nullable first
   - Migrate data
   - Add constraints in a later migration

4. **Test Before Committing**: Always test migrations on a development database first

5. **Rollback Strategy**: Document how to reverse the migration in comments
   ```sql
   -- Migration: Add email column to users
   -- Rollback: ALTER TABLE users DROP COLUMN IF EXISTS email;

   ALTER TABLE users ADD COLUMN email TEXT;
   ```

## Migration Table Schema

The `schema_migrations` table tracks applied migrations:

```sql
CREATE TABLE schema_migrations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  executed_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Environment Variables

Ensure your database connection is configured:

```env
STORAGE_TYPE=postgres
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

## Troubleshooting

### Migration Failed

If a migration fails:

1. Check the error message in the console output
2. Fix the SQL in the migration file
3. Manually remove the failed entry from `schema_migrations` if it was partially recorded
4. Re-run the migration

### Skipping a Migration

To skip a specific migration (not recommended):

```sql
INSERT INTO schema_migrations (id, name)
VALUES (002, 'migration_name');
```

### Resetting All Migrations (Development Only)

**WARNING**: This will delete all migration history. Only use in development.

```sql
DROP TABLE IF EXISTS schema_migrations CASCADE;
```

Then re-run `pnpm migrate` to apply all migrations fresh.

## Integration with CI/CD

Add to your deployment pipeline:

```bash
# Before starting the application
pnpm migrate

# Or use the API endpoint after deployment
curl -X POST https://your-domain.com/api/migrations
```

## Available Storage Adapters

The migration system works with the PostgreSQL adapter. For other adapters:

- **SQLite**: Migrations are not currently supported (schema auto-created)
- **JSON**: No migrations needed (file-based storage)

To use migrations, ensure `STORAGE_TYPE=postgres` is set.

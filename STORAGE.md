# Storage Adapter System

FireCMS supports multiple storage backends through an adapter pattern. You can choose between PostgreSQL/Neon (serverless), Firebase Firestore (cloud), SQLite (local database), or JSON file storage (local).

## Configuration

Set your storage type in `.env`:

```bash
# Choose one: "postgres", "firebase", "sqlite", or "json"
STORAGE_TYPE=postgres

# For PostgreSQL, provide connection string
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# For JSON and SQLite, specify the data directory
DATA_DIR=./data
```

## Storage Options

### 1. PostgreSQL (Neon) - Recommended for Production

**Best for**: Production deployments, serverless apps, scalable applications, edge computing

**Pros:**
- Serverless PostgreSQL with auto-scaling
- Free tier: 512MB storage, 3GiB data transfer/month
- Connection pooling built-in
- Database branching for dev/staging/prod
- Sub-10ms query latency globally
- Compatible with Vercel, Netlify, Railway
- Full PostgreSQL features (JSONB, indexes, CTEs)
- Automatic backups and point-in-time recovery
- No server maintenance

**Cons:**
- Requires internet connection
- Free tier has compute limits
- Costs money beyond free tier

**Setup:**

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string from dashboard
4. Add to `.env`:

```bash
STORAGE_TYPE=postgres
DATABASE_URL=postgresql://username:password@ep-xxx-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

5. The schema will be created automatically on first run

**Database Schema:**

```sql
-- Pages table with UUID primary keys
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  published BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sections with foreign key to pages
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blocks with JSONB data storage
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  "order" INTEGER NOT NULL,
  data JSONB NOT NULL
);
```

**Features:**
- Version tracking with automatic increment
- JSONB for flexible block data storage
- GIN indexes for fast JSON queries
- Foreign key constraints with CASCADE delete
- Automatic timestamp management
- Connection pooling for serverless

**Performance:**
- Optimized for serverless/edge runtime
- WebSocket support for low latency
- Automatic query optimization
- Built-in caching

**Deployment:**

For Vercel deployment, Neon auto-detects and configures:
```bash
# Vercel will automatically use DATABASE_URL
vercel env add DATABASE_URL
```

For database branching (dev/staging):
```bash
# In Neon dashboard, create branches for each environment
# Use different connection strings per environment
```

### 2. Firebase Firestore

**Best for**: Production deployments, real-time updates, scalability

**Pros:**
- Cloud-hosted (no server maintenance)
- Real-time synchronization
- Automatic scaling
- Built-in backup and security
- CDN for fast global access

**Cons:**
- Requires Firebase account
- Costs money at scale
- Requires internet connection

**Setup:**

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Copy your Firebase configuration
4. Add to `.env`:

```bash
STORAGE_TYPE=firebase

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

5. For images, enable Firebase Storage in the Firebase console

**Features:**
- Version tracking with automatic increment
- Optimistic locking support
- Nested structure with subcollections for sections and blocks
- Automatic timestamp management

### 3. JSON File Storage

**Best for**: Development, simple deployments, version control of content

**Pros:**
- No setup required
- Easy to understand and debug
- Content can be version controlled with Git
- No external dependencies
- Free

**Cons:**
- Not suitable for concurrent writes
- Limited scalability
- No real-time updates
- Manual backup required

**Setup:**

1. Set in `.env`:

```bash
STORAGE_TYPE=json
DATA_DIR=./data
```

2. The CMS will automatically create `./data/cms-data.json` on first use

**File Structure:**

```json
{
  "pages": [
    {
      "id": "page-id",
      "slug": "about",
      "title": "About Us",
      "description": "About our company",
      "sections": [...],
      "published": true,
      "version": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

**Version Control:**

You can commit `cms-data.json` to Git to track content changes:

```bash
git add data/cms-data.json
git commit -m "Update about page content"
```

### 4. SQLite Database

**Best for**: Medium-scale deployments, better performance than JSON, local hosting

**Pros:**
- Fast query performance
- ACID compliance (transactions)
- Better for concurrent access than JSON
- Normalized schema
- Indexes for fast lookups
- Free and embedded

**Cons:**
- Requires better-sqlite3 dependency
- Manual backup required
- Not as scalable as Firestore
- No real-time updates

**Setup:**

1. Install the better-sqlite3 package (already in package.json):

```bash
pnpm install
```

2. Set in `.env`:

```bash
STORAGE_TYPE=sqlite
DATA_DIR=./data
```

3. The CMS will automatically create `./data/cms.db` on first use

**Database Schema:**

```sql
-- Pages table
CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  published INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Sections table
CREATE TABLE sections (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

-- Blocks table
CREATE TABLE blocks (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  type TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  data TEXT NOT NULL,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_sections_page_id ON sections(page_id);
CREATE INDEX idx_blocks_section_id ON blocks(section_id);
```

**Backup:**

```bash
# Create a backup
cp data/cms.db data/cms-backup-$(date +%Y%m%d).db

# Restore from backup
cp data/cms-backup-20240101.db data/cms.db
```

## Switching Storage Backends

You can switch between storage backends at any time by changing the `STORAGE_TYPE` environment variable. However, **data is not automatically migrated**.

### Migration Example (Firebase → JSON)

1. Export data from Firebase using the Firebase console or a migration script
2. Convert to JSON format
3. Place in `./data/cms-data.json`
4. Change `STORAGE_TYPE=json`
5. Restart the application

### Migration Example (JSON → SQLite)

```javascript
// migration-script.js
const fs = require('fs');
const Database = require('better-sqlite3');

const jsonData = JSON.parse(fs.readFileSync('./data/cms-data.json', 'utf-8'));
const db = new Database('./data/cms.db');

// Insert pages, sections, and blocks...
// (Create a custom migration script based on your data)
```

## API Versioning

All API responses include versioning metadata:

```json
{
  "data": {
    // Your actual data here
  },
  "meta": {
    "version": "v1",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1234567890_abc123"
  }
}
```

This ensures:
- **API Version**: Track which API version was used
- **Timestamp**: Know when the response was generated
- **Request ID**: Debug and trace specific requests

## Best Practices

### For Development

Use **JSON** storage for:
- Quick prototyping
- Version controlling content
- Debugging and inspection

### For Production

Use **PostgreSQL (Neon)** for:
- Serverless production deployments
- Edge computing applications
- Scalable cloud apps (startups to enterprise)
- Teams needing database branching
- Cost-effective hosting (free tier available)

Use **Firebase** for:
- Real-time features required
- Google Cloud Platform integration
- Global CDN delivery
- Enterprise-scale applications

Use **SQLite** for:
- Self-hosted deployments
- Better performance than JSON
- When cloud services aren't an option
- Embedded in applications

### Backup Strategy

**PostgreSQL (Neon):**
- Automatic daily backups (included)
- Point-in-time recovery available
- Manual backup via pg_dump:
  ```bash
  pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
  ```
- Use Neon branching for instant database snapshots

**Firebase:**
- Enable daily automatic backups in Firebase console
- Export Firestore data periodically

**JSON:**
- Commit to Git regularly
- Automated backups with cron:
  ```bash
  0 0 * * * cp /path/to/data/cms-data.json /path/to/backups/cms-data-$(date +\%Y\%m\%d).json
  ```

**SQLite:**
- Regular database backups:
  ```bash
  0 0 * * * cp /path/to/data/cms.db /path/to/backups/cms-$(date +\%Y\%m\%d).db
  ```
- Use SQLite's built-in backup API for hot backups

## Performance Comparison

| Feature | PostgreSQL (Neon) | Firebase | JSON | SQLite |
|---------|-------------------|----------|------|--------|
| **Read Speed** | Very Fast | Fast (CDN) | Very Fast | Very Fast |
| **Write Speed** | Very Fast | Medium | Fast | Very Fast |
| **Concurrent Writes** | Excellent | Excellent | Poor | Good |
| **Scalability** | Unlimited | Unlimited | Limited | Medium |
| **Setup Complexity** | Easy | Medium | Easy | Easy |
| **Cost** | Free tier + usage | Pay-per-use | Free | Free |
| **Real-time** | No (Polling) | Yes | No | No |
| **Edge Support** | Excellent | Good | N/A | N/A |
| **Serverless** | Yes | Yes | No | No |

## Troubleshooting

### PostgreSQL Connection Issues

```
Error: PostgreSQL connection string required
```

**Solution:** Ensure `DATABASE_URL` or `POSTGRES_URL` is set in `.env`:
```bash
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

```
Error: Connection timeout
```

**Solution:**
- Check your Neon project is active (not suspended)
- Verify connection string is correct
- Check network/firewall settings
- Ensure SSL is enabled in connection string

```
Error: Too many connections
```

**Solution:**
- Neon provides connection pooling by default
- Check your free tier limits in Neon dashboard
- Consider upgrading plan for more connections

### Firebase Connection Issues

```
Error: Firebase not initialized
```

**Solution:** Check that all Firebase environment variables are set correctly in `.env`

### JSON File Permissions

```
Error: EACCES: permission denied
```

**Solution:** Ensure the DATA_DIR has write permissions:
```bash
mkdir -p ./data
chmod 755 ./data
```

### SQLite Lock Errors

```
Error: database is locked
```

**Solution:** Ensure only one process is accessing the database. Better-sqlite3 uses WAL mode by default which should handle most concurrency issues.

### Version Conflicts

If you see version mismatch errors, the page was modified elsewhere. Refresh to get the latest version.

## Advanced Configuration

### Custom Adapter Location

By default, adapters look for data in the directory specified by `DATA_DIR`. To change this:

```bash
DATA_DIR=/var/lib/firecms
```

### Connection Pooling (SQLite)

For high-traffic scenarios, consider implementing connection pooling in `/src/lib/adapters/sqlite-adapter.ts`.

### Read Replicas (Firebase)

For read-heavy workloads, Firebase automatically uses caching and CDN.

## Security

### Firebase

Use Firebase Security Rules to restrict access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pages/{pageId} {
      // Allow read for all
      allow read;

      // Allow write only for authenticated users
      allow write: if request.auth != null;
    }
  }
}
```

### JSON & SQLite

Since these are file-based, protect them at the file system level:

```bash
# Restrict permissions
chmod 600 ./data/cms-data.json
chmod 600 ./data/cms.db

# Or use environment-specific directories
# Production: /var/lib/firecms/data
# Development: ./data
```

## Next Steps

- [Image Optimization Guide](./IMAGE_OPTIMIZATION.md)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

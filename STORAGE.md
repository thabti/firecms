# Storage Adapter System

FireCMS supports multiple storage backends through an adapter pattern. You can choose between Firebase Firestore (cloud), JSON file storage (local), or SQLite (local database).

## Configuration

Set your storage type in `.env.local`:

```bash
# Choose one: "firebase", "json", or "sqlite"
STORAGE_TYPE=firebase

# For JSON and SQLite, specify the data directory
DATA_DIR=./data
```

## Storage Options

### 1. Firebase Firestore (Default)

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
4. Add to `.env.local`:

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

### 2. JSON File Storage

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

1. Set in `.env.local`:

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

### 3. SQLite Database

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

2. Set in `.env.local`:

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

Use **Firebase** for:
- Scalable cloud deployment
- Real-time features
- Global CDN delivery
- Managed backups

Use **SQLite** for:
- Self-hosted deployments
- Better performance than JSON
- When cloud services aren't an option
- Embedded in applications

### Backup Strategy

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

| Feature | Firebase | JSON | SQLite |
|---------|----------|------|--------|
| **Read Speed** | Fast (CDN) | Very Fast | Very Fast |
| **Write Speed** | Medium | Fast | Very Fast |
| **Concurrent Writes** | Excellent | Poor | Good |
| **Scalability** | Unlimited | Limited | Medium |
| **Setup Complexity** | Medium | Easy | Easy |
| **Cost** | Pay-per-use | Free | Free |
| **Real-time** | Yes | No | No |

## Troubleshooting

### Firebase Connection Issues

```
Error: Firebase not initialized
```

**Solution:** Check that all Firebase environment variables are set correctly in `.env.local`

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

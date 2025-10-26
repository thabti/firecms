# FireCMS

A modern, headless CMS built with Next.js 16, Firebase, Tailwind CSS, and shadcn/ui.

## Features

- **Modern Stack**: Next.js 16 with App Router, React 19, TypeScript
- **Firebase Integration**: Firestore for database, Firebase Storage for images
- **Block-Based Content**: Flexible page builder with multiple block types
- **RESTful API**: Full API for headless CMS capabilities
- **Beautiful UI**: Tailwind CSS with shadcn/ui components
- **Type Safety**: Full TypeScript support throughout

## Block Types

- **Text**: Rich text content blocks
- **Heading**: H1-H6 headings with customizable levels
- **Image**: Image uploads with captions and alt text
- **List**: Ordered or unordered lists
- **Quote**: Blockquotes with optional author attribution

## Project Structure

```
firecms/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public-facing pages
│   │   │   └── [slug]/        # Dynamic page routes
│   │   ├── admin/             # CMS admin panel
│   │   │   └── pages/         # Page management
│   │   ├── api/               # API routes
│   │   │   ├── pages/         # Pages CRUD
│   │   │   └── upload/        # Image upload
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── block-editor.tsx   # Block editor component
│   ├── lib/
│   │   ├── db.ts              # Firestore operations
│   │   ├── firebase.ts        # Firebase config
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Firebase project

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/sabeurthabti/firecms.git
cd firecms
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up Firebase**

- Create a new Firebase project at https://console.firebase.google.com
- Enable Firestore Database
- Enable Firebase Storage
- Get your Firebase configuration

4. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

See `.env.local.example` for reference.

5. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Usage

### Admin Panel

Access the admin panel at `/admin` to:

- Create and manage pages
- Add sections to pages
- Add and edit content blocks
- Upload images
- Publish/unpublish pages

### Creating a Page

1. Go to `/admin`
2. Click "New Page"
3. Fill in the page details (title, slug, description)
4. Click "Create Page"
5. Add sections and blocks to build your content

### API Endpoints

#### Pages

- `GET /api/pages` - List all pages
- `POST /api/pages` - Create a new page
- `GET /api/pages/[id]` - Get a specific page
- `PUT /api/pages/[id]` - Update a page
- `DELETE /api/pages/[id]` - Delete a page

#### Sections

- `POST /api/pages/[id]/sections` - Create a section
- `PUT /api/pages/[id]/sections/[sectionId]` - Update a section
- `DELETE /api/pages/[id]/sections/[sectionId]` - Delete a section

#### Blocks

- `POST /api/pages/[id]/sections/[sectionId]/blocks` - Create a block
- `PUT /api/pages/[id]/sections/[sectionId]/blocks/[blockId]` - Update a block
- `DELETE /api/pages/[id]/sections/[sectionId]/blocks/[blockId]` - Delete a block

#### Upload

- `POST /api/upload` - Upload an image (multipart/form-data with 'file' field)

### Example API Usage

**Create a page:**

```javascript
const response = await fetch('/api/pages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'my-page',
    title: 'My Page',
    description: 'A great page',
    published: true
  })
});
const page = await response.json();
```

**Add a text block:**

```javascript
await fetch(`/api/pages/${pageId}/sections/${sectionId}/blocks`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'text',
    content: 'Hello, world!'
  })
});
```

## Development

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.9
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Styling**: Tailwind CSS 4.1
- **UI Components**: shadcn/ui
- **Package Manager**: pnpm

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Firebase Hosting

```bash
pnpm build
firebase deploy
```

## License

MIT License - see LICENSE file for details

## Author

Sabeur Thabti

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please use the GitHub issue tracker.

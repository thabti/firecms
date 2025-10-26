# Blocks and Templates Guide

## Overview

FireCMS uses a flexible content structure based on **Pages**, **Sections**, and **Blocks**. This guide explains how to use the blocks and templates system effectively.

## Content Structure

```
📄 Page (e.g., "About Us")
  ├── 📋 Section 1 (e.g., "Hero Section")
  │   ├── 🧱 Block: Heading "About Us"
  │   ├── 🧱 Block: Text "We are a passionate team..."
  │   └── 🧱 Block: Image (team photo)
  │
  └── 📋 Section 2 (e.g., "Our Mission")
      ├── 🧱 Block: Heading "Our Mission"
      └── 🧱 Block: Text "Our mission is to..."
```

## Block Types

### 1. Text Block
Simple paragraph text content.
```typescript
{
  type: "text",
  content: "Your paragraph text here..."
}
```

### 2. Heading Block
Headings from H1 to H6.
```typescript
{
  type: "heading",
  level: 2,  // 1-6 for H1-H6
  content: "Your Heading"
}
```

### 3. Image Block
Images with responsive sizes, alt text, and captions.
```typescript
{
  type: "image",
  url: "/uploads/image.jpg",
  urls: {
    thumbnail: "/uploads/image-thumbnail.jpg",
    medium: "/uploads/image-medium.jpg",
    large: "/uploads/image-large.jpg",
    original: "/uploads/image.jpg"
  },
  alt: "Description for accessibility",
  caption: "Optional caption text",
  dimensions: {
    width: 1920,
    height: 1080
  }
}
```

### 4. List Block
Ordered or unordered lists.
```typescript
{
  type: "list",
  ordered: false,  // true for numbered lists, false for bullet points
  items: [
    "First item",
    "Second item",
    "Third item"
  ]
}
```

### 5. Quote Block
Blockquotes with optional author attribution.
```typescript
{
  type: "quote",
  content: "The quote text goes here...",
  author: "John Doe, CEO"  // Optional
}
```

## Templates

Templates are pre-built collections of blocks that you can insert into sections to save time.

### Available Templates

#### Page Templates (Full Pages)
- **About Us** - Complete about page with mission, values, and story
- **Contact Us** - Contact page with information and office locations
- **Pricing** - Pricing page with tiers and feature comparison

#### Marketing Templates
- **Hero Section** - Eye-catching hero with headline and CTA
- **Features Overview** - Showcase key product features
- **Testimonials** - Customer testimonials and reviews

#### Content Templates
- **FAQ Section** - Frequently asked questions structure
- **Blog Post** - Standard blog post with introduction, main points, and conclusion

### How to Use Templates

1. **Navigate to a page editor**
2. **Add or edit a section**
3. **Click "Insert Template"** (when implemented)
4. **Select a category** (Page, Marketing, or Content)
5. **Choose a template**
6. **Customize the blocks** to match your needs

## API Endpoints

### Pages
- `GET /api/pages` - List all pages
- `POST /api/pages` - Create a new page
- `GET /api/pages/[id]` - Get page details
- `PATCH /api/pages/[id]` - Update page metadata
- `DELETE /api/pages/[id]` - Delete a page

### Sections
- `GET /api/pages/[id]/sections` - List sections for a page
- `POST /api/pages/[id]/sections` - Create a new section
- `PATCH /api/pages/[id]/sections/[sectionId]` - Update section
- `DELETE /api/pages/[id]/sections/[sectionId]` - Delete section

### Blocks
- `GET /api/pages/[id]/sections/[sectionId]/blocks` - List blocks in a section
- `POST /api/pages/[id]/sections/[sectionId]/blocks` - Create a new block
- `PATCH /api/pages/[id]/sections/[sectionId]/blocks/[blockId]` - Update block
- `DELETE /api/pages/[id]/sections/[sectionId]/blocks/[blockId]` - Delete block

## Working with the Storage Adapter

FireCMS supports multiple storage backends:

- **JSON** (default) - File-based storage in `./data/cms-data.json`
- **SQLite** - Local database storage
- **PostgreSQL** - Production-ready database (Neon, Vercel Postgres, etc.)

Configure via environment variables:
```env
STORAGE_TYPE=json  # or sqlite, postgres
DATA_DIR=./data    # for json/sqlite
DATABASE_URL=...   # for postgres
```

## Best Practices

1. **Organize with Sections** - Use sections to logically group related content
2. **Use Templates** - Start with templates and customize them
3. **Image Optimization** - Images are automatically compressed and resized
4. **Accessibility** - Always provide alt text for images
5. **Content Hierarchy** - Use heading levels properly (H1 → H2 → H3)

## Customizing Templates

You can create custom templates by adding them to:
- `src/lib/templates/page-templates.ts`
- `src/lib/templates/marketing-templates.ts`
- `src/lib/templates/content-templates.ts`

Example custom template:
```typescript
{
  id: "my-custom-template",
  name: "Custom Template",
  description: "My custom template description",
  category: "content",
  blocks: [
    {
      type: "heading",
      level: 2,
      content: "Custom Heading",
    } as Omit<HeadingBlock, "id" | "order">,
    {
      type: "text",
      content: "Custom text content here...",
    } as Omit<TextBlock, "id" | "order">,
  ],
}
```

## Troubleshooting

### API Errors
If you see "API call failed" errors:
1. Check that the dev server is running: `pnpm dev`
2. Verify your `.env.local` file has correct settings
3. Check the browser console for detailed error messages

### Missing Blocks
If blocks don't appear:
1. Ensure the page has sections created
2. Check that blocks are added to sections
3. Verify the storage adapter is initialized correctly

### Image Upload Issues
If images fail to upload:
1. Check file size (max 2MB after compression)
2. Verify file type (JPEG, PNG, WebP, GIF)
3. Ensure the `/api/upload` endpoint is working
4. Check storage permissions

## Next Steps

The page editor currently needs to be enhanced with:
1. Section management UI
2. Block editor interface
3. Template selector integration
4. Drag-and-drop reordering
5. Live preview functionality

These features are being added to provide a complete CMS editing experience.

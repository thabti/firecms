# FireCMS - Complete Usage Guide

## 🚀 Getting Started

### Start the Development Server

```bash
pnpm dev
```

Server will be available at: **http://localhost:3000** (or 3006 if port 3000 is busy)

---

## 📖 Complete Walkthrough

### Step 1: Access Admin Panel

Navigate to: `http://localhost:3006/admin`

**What you'll see:**
- Navigation bar with "FireCMS Admin" logo
- Three nav links: Pages | Media | Settings
- "View Site" link on the right
- Table listing all your pages
- "New Page" button (top right)

---

### Step 2: Create or Edit a Page

#### Option A: Create New Page
1. Click **"New Page"** button
2. Fill in:
   - **Page Title**: "Welcome"
   - **URL Slug**: "welcome"
   - **Description**: "Our welcome page" (optional)
3. Check **"Published"** if you want it live
4. Click **"Create Page"**

#### Option B: Edit Existing Page
1. Find your page in the table (e.g., "About Us")
2. Click the **pencil icon** (Edit button)

---

### Step 3: Edit Page Metadata

You'll see **"Page Settings"** card at the top:

```
┌─────────────────────────────────────┐
│  Page Settings                      │
├─────────────────────────────────────┤
│  Page Title:  [About Us            ]│
│  URL Slug:   /[about               ]│
│  Description: [Optional...         ]│
│  ☐ Published                        │
│  [Save Changes]                     │
└─────────────────────────────────────┘
```

Update any fields and click **"Save Changes"**

---

### Step 4: Build Your Page Content

Below "Page Settings", you'll see **"Page Content"** section:

```
┌─────────────────────────────────────┐
│  Page Content        [Add Section]  │
├─────────────────────────────────────┤
│                                     │
│  No sections yet. Add your first    │
│  section to start building!         │
│                                     │
│         [Add First Section]         │
└─────────────────────────────────────┘
```

**Click "Add Section"**

---

### Step 5: Create a Section

1. **Prompt appears:** "Enter section title:"
2. Type a name (e.g., "Hero Section", "About Us", "Features")
3. Click **OK**

Your section appears:

```
┌─────────────────────────────────────┐
│  Hero Section  [Insert Template] 🗑 │
├─────────────────────────────────────┤
│  (empty - no blocks yet)            │
│                                     │
│  [+Text] [+Heading] [+Image]        │
│  [+List] [+Quote]                   │
└─────────────────────────────────────┘
```

---

### Step 6A: Quick Start with Templates

**Click "Insert Template" button**

Template selector modal opens with 3 tabs:

#### Tab 1: Full Pages
- **About Us** - Complete about page
  - Includes: Hero heading, intro text, mission section, values list, story
  - 8 pre-built blocks ready to customize

- **Contact Us** - Contact information page
  - Includes: Main heading, intro, contact info list, locations, support info
  - 8 pre-built blocks

- **Pricing** - Pricing tiers page
  - Includes: Heading, description, 3 pricing tiers with features, guarantee
  - 13 pre-built blocks

#### Tab 2: Marketing
- **Hero Section** - Landing page hero
  - Large heading + description + CTA text
  - 3 blocks

- **Features Overview** - Product features
  - Section heading + 3 features with descriptions
  - 8 blocks

- **Testimonials** - Customer quotes
  - Heading + intro + 3 customer quotes with attribution
  - 5 blocks

#### Tab 3: Content
- **FAQ Section** - Frequently Asked Questions
  - Section heading + 4 Q&A pairs
  - 10 blocks

- **Blog Post** - Standard article structure
  - Title, intro, 2 main sections, key takeaways list, conclusion
  - 10 blocks

**Select any template** - blocks are instantly inserted!

---

### Step 6B: Build Manually with Blocks

Instead of using templates, click individual block buttons:

#### Add a Heading Block
1. Click **"+Heading"**
2. Block appears with default content
3. Click **"Edit"** button
4. Change:
   - **Content**: "Welcome to Our Site"
   - **Level**: Choose H1-H6 from dropdown
5. Click **"Save"** (checkmark icon)

#### Add a Text Block
1. Click **"+Text"**
2. Click **"Edit"**
3. Type your paragraph in the textarea
4. Click **"Save"**

#### Add an Image Block
1. Click **"+Image"**
2. Click **"Edit"**
3. Click **"Choose File"**
4. Select your image (JPEG, PNG, WebP, GIF)
5. Watch as it:
   - Shows file size
   - Compresses automatically
   - Creates multiple sizes
   - Uploads to server
6. Fill in:
   - **Alt Text**: "Team photo at office" (required for accessibility)
   - **Caption**: "Our amazing team" (optional)
7. Click **"Save"**

**Image Processing:**
```
Original: 5.2 MB
↓ Compressing...
Compressed: 850 KB (84% smaller)
↓ Uploading...
✓ Uploaded! Multiple sizes created:
  - thumbnail (150x150)
  - medium (800x600)
  - large (1920x1080)
  - original
```

#### Add a List Block
1. Click **"+List"**
2. Click **"Edit"**
3. Check **"Ordered List"** for numbers (unchecked = bullets)
4. Add items:
   - Default has one item
   - Click **"Add Item"** for more
   - Click **"Remove"** to delete items
5. Click **"Save"**

#### Add a Quote Block
1. Click **"+Quote"**
2. Click **"Edit"**
3. Enter:
   - **Quote**: "Your quote text here..."
   - **Author**: "John Doe, CEO" (optional)
4. Click **"Save"**

---

### Step 7: Edit and Organize Blocks

Each block has controls:

```
┌─────────────────────────────────────┐
│  HEADING          [↑] [↓] [Edit] 🗑  │
├─────────────────────────────────────┤
│  Welcome to Our Site                │
└─────────────────────────────────────┘
```

- **↑ Up Arrow**: Move block up in order
- **↓ Down Arrow**: Move block down in order
- **Edit**: Open editor for this block
- **🗑 Delete**: Remove this block (with confirmation)

**While editing:**
```
┌─────────────────────────────────────┐
│  HEADING              [✓Save] [✗]   │
├─────────────────────────────────────┤
│  Content: [Welcome to Our Site    ] │
│  Level:   [H1 ▼]                    │
└─────────────────────────────────────┘
```

- **✓ Save**: Save changes
- **✗ Cancel**: Discard changes

---

### Step 8: Manage Sections

Add multiple sections to organize your page:

```
┌─────────────────────────────────────┐
│  Hero Section    [Insert Template] 🗑│
│  [+Text] [+Heading] [+Image] ...    │
│  - Heading: "Welcome"               │
│  - Text: "We are..."                │
│  - Image: hero.jpg                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Features        [Insert Template] 🗑│
│  [+Text] [+Heading] [+Image] ...    │
│  - Heading: "Our Features"          │
│  - List: 3 features                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Contact         [Insert Template] 🗑│
│  [+Text] [+Heading] [+Image] ...    │
│  - Heading: "Get in Touch"          │
│  - Text: contact info               │
└─────────────────────────────────────┘
```

Click 🗑 on any section to delete it (with confirmation)

---

### Step 9: View Your Page

1. Save all changes
2. Set **"Published"** checkbox to ON
3. Click **"Save Changes"**
4. Navigate to: `http://localhost:3006/your-slug`

For "About Us" page with slug "about":
→ `http://localhost:3006/about`

---

## 🎯 Real Example Walkthrough

Let's build an "About Us" page from scratch:

### 1. Create the Page
- Go to `/admin`
- Click "New Page"
- Title: "About Us"
- Slug: "about"
- Click "Create Page"

### 2. Add Hero Section
- Click "Add Section"
- Name: "Hero"
- Click "Insert Template" → Full Pages → "About Us"
- Blocks are inserted automatically!

### 3. Customize Content
- Click "Edit" on the first heading
- Change to your company name
- Click Save

- Click "Edit" on the intro text
- Replace with your actual company description
- Click Save

### 4. Add an Image
- Click "+Image" in the Hero section
- Upload your company logo
- Alt text: "Company logo"
- Click Save

### 5. Add Another Section
- Click "Add Section" again
- Name: "Team"
- Click "+Heading" → "Meet Our Team"
- Click "+Text" → Team description
- Click "+Image" → Team photo

### 6. Publish
- Check "Published"
- Click "Save Changes"
- Visit `/about` to see your page!

---

## 🔧 API Endpoints Reference

All endpoints return JSON:

```json
{
  "data": {...},
  "meta": {
    "version": "v1",
    "timestamp": "2025-10-26T19:00:00.000Z",
    "requestId": "req_xxx"
  }
}
```

### Pages
- `GET /api/pages` - List all pages
- `POST /api/pages` - Create page
- `GET /api/pages/[id]` - Get page details
- `PATCH /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page

### Sections
- `POST /api/pages/[id]/sections` - Create section
  ```json
  { "title": "Hero Section" }
  ```
- `DELETE /api/pages/[id]/sections/[sectionId]` - Delete section

### Blocks
- `POST /api/pages/[id]/sections/[sectionId]/blocks` - Create block
  ```json
  {
    "type": "text",
    "content": "Your text here"
  }
  ```
- `PATCH /api/pages/[id]/sections/[sectionId]/blocks/[blockId]` - Update block
- `DELETE /api/pages/[id]/sections/[sectionId]/blocks/[blockId]` - Delete block

---

## 🎨 Block Types Reference

### Text Block
```json
{
  "type": "text",
  "content": "Your paragraph text here..."
}
```

### Heading Block
```json
{
  "type": "heading",
  "level": 2,
  "content": "Your Heading"
}
```
Level: 1-6 for H1-H6

### Image Block
```json
{
  "type": "image",
  "url": "/uploads/image.jpg",
  "urls": {
    "thumbnail": "/uploads/image-thumbnail.jpg",
    "medium": "/uploads/image-medium.jpg",
    "large": "/uploads/image-large.jpg",
    "original": "/uploads/image.jpg"
  },
  "alt": "Description for screen readers",
  "caption": "Optional caption",
  "dimensions": {
    "width": 1920,
    "height": 1080
  }
}
```

### List Block
```json
{
  "type": "list",
  "ordered": false,
  "items": [
    "First item",
    "Second item",
    "Third item"
  ]
}
```

### Quote Block
```json
{
  "type": "quote",
  "content": "The quote text goes here...",
  "author": "John Doe, CEO"
}
```

---

## 🐛 Troubleshooting

### "API call failed" Error
1. Check dev server is running: `pnpm dev`
2. Check server URL (might be port 3006 instead of 3000)
3. Open browser console (F12) for detailed error

### Page Not Loading
1. Clear Next.js cache: `rm -rf .next && pnpm dev`
2. Check browser console for JavaScript errors
3. Verify page ID in URL is correct

### Image Upload Fails
1. Check file size (should compress to < 2MB)
2. Verify file type (JPEG, PNG, WebP, GIF only)
3. Check browser console for errors
4. Verify `/api/upload` endpoint is working

### Changes Not Saving
1. Check for error messages in browser
2. Verify API calls in Network tab (F12)
3. Check server logs for errors
4. Ensure data directory is writable

### Templates Not Appearing
1. Clear browser cache
2. Restart dev server
3. Check template files exist in `src/lib/templates/`

---

## 💡 Pro Tips

1. **Use Templates First** - Faster than building manually
2. **Organize with Sections** - Group related content
3. **Add Alt Text** - Required for accessibility, good for SEO
4. **Preview Before Publishing** - Uncheck "Published" while building
5. **Reorder Blocks** - Use up/down arrows for perfect layout
6. **Save Often** - Click Save Changes frequently
7. **Use Descriptive Slugs** - "/about-us" not "/page-1"
8. **Image Sizes** - Responsive images created automatically

---

## 🚀 What's Next?

Your CMS is fully functional! You can now:

- ✅ Create and manage pages
- ✅ Organize content with sections
- ✅ Add rich content with 5 block types
- ✅ Use 11 pre-built templates
- ✅ Upload and optimize images
- ✅ Publish pages to your site

**Need Help?**
- Check `BLOCKS_AND_TEMPLATES_GUIDE.md` for detailed reference
- Review code in `src/app/admin/pages/[id]/page.tsx`
- Explore templates in `src/lib/templates/`

Happy content creating! 🎉

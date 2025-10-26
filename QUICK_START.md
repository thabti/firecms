# FireCMS - Quick Start Guide

## 🚀 Start in 3 Steps

### 1. Start Server
```bash
pnpm dev
```
→ Open: **http://localhost:3006/admin**

### 2. Edit "About Us" Page
1. Click edit icon (pencil) on "About Us" row
2. Scroll down to **"Page Content"** section
3. Click **"Add Section"** button
4. Enter section name (e.g., "Hero")
5. Click **"Insert Template"**
6. Choose "About Us" from Full Pages tab
7. Click template card - blocks appear instantly!

### 3. Customize & Publish
1. Click **"Edit"** on any block to customize
2. Click **"Save"** when done editing
3. Check **"Published"** checkbox at top
4. Click **"Save Changes"**
5. View at: **http://localhost:3006/about**

---

## 📍 Where Is Everything?

### Admin Panel
`http://localhost:3006/admin`
- See all pages
- Create new pages
- Click edit (pencil icon) to edit

### Page Editor
`http://localhost:3006/admin/pages/[id]`

**Top Section:** Page Settings
- Title, slug, description
- Published checkbox
- Save Changes button

**Bottom Section:** Page Content ← THIS IS NEW!
- **Add Section** button
- Section cards with:
  - **Insert Template** button
  - **Block buttons**: +Text, +Heading, +Image, +List, +Quote
  - Edit/delete controls for each block

### Your Published Page
`http://localhost:3006/[your-slug]`
- Only shows if "Published" is checked
- Renders all sections and blocks

---

## 🎯 Quick Actions

### Add a Section
1. Click **"Add Section"**
2. Enter name
3. Click OK

### Use a Template
1. Click **"Insert Template"** in a section
2. Choose category tab
3. Click template card
4. Blocks appear - edit to customize!

### Add a Block Manually
1. Click block button (+Text, +Heading, etc.)
2. Click **"Edit"** on the new block
3. Modify content
4. Click **"Save"**

### Upload an Image
1. Click **"+Image"** in a section
2. Click **"Edit"**
3. Choose file
4. Wait for auto-compression and upload
5. Add alt text (required)
6. Add caption (optional)
7. Click **"Save"**

### Reorder Blocks
- Click **↑** to move block up
- Click **↓** to move block down

### Delete Block/Section
- Click **🗑** (trash icon)
- Confirm deletion

---

## 📋 Available Templates

### Full Pages (Complete Layouts)
- **About Us** (8 blocks) - Company info, mission, values
- **Contact Us** (8 blocks) - Contact info, locations
- **Pricing** (13 blocks) - 3 pricing tiers with features

### Marketing Sections
- **Hero Section** (3 blocks) - Landing page hero
- **Features Overview** (8 blocks) - Product features
- **Testimonials** (5 blocks) - Customer quotes

### Content Sections
- **FAQ Section** (10 blocks) - Q&A format
- **Blog Post** (10 blocks) - Article structure

---

## 🎨 Block Types

| Block | Purpose | Fields |
|-------|---------|--------|
| **Text** | Paragraphs | Content (textarea) |
| **Heading** | H1-H6 headings | Content, Level (1-6) |
| **Image** | Photos/graphics | File upload, Alt text, Caption |
| **List** | Bullets/numbers | Items (array), Ordered (checkbox) |
| **Quote** | Blockquotes | Content, Author (optional) |

---

## ⚡ Workflow Example

**Goal:** Create an About Us page with hero and features

```
1. Go to /admin
2. Click edit on "About Us" page
3. Click "Add Section" → name: "Hero"
4. Click "Insert Template" → Full Pages → "About Us"
   → 8 blocks inserted!
5. Click "Edit" on heading → change to your company name
6. Click "Edit" on text → update description
7. Click "Add Section" → name: "Features"
8. Click "Insert Template" → Marketing → "Features Overview"
   → 8 blocks inserted!
9. Customize each feature heading and description
10. Check "Published" at top
11. Click "Save Changes"
12. Visit /about to see your page!
```

**Time:** 5-10 minutes for a complete page!

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Don't see "Page Content" section | Refresh page or restart server: `rm -rf .next && pnpm dev` |
| Template selector doesn't open | Check browser console (F12) for errors |
| Image upload fails | Check file type (JPEG/PNG/WebP/GIF) and size |
| Changes don't save | Check Network tab in browser dev tools for API errors |
| Page shows 404 | Make sure "Published" is checked and slug is correct |

---

## 📚 Full Documentation

- **Complete Guide:** `COMPLETE_USAGE_GUIDE.md`
- **Blocks & Templates:** `BLOCKS_AND_TEMPLATES_GUIDE.md`
- **Code:** `src/app/admin/pages/[id]/page.tsx`

---

## ✅ Checklist

- [ ] Server running at http://localhost:3006
- [ ] Accessed admin panel
- [ ] Opened a page for editing
- [ ] Can see "Page Content" section
- [ ] Clicked "Add Section" successfully
- [ ] Tried "Insert Template" feature
- [ ] Added blocks manually
- [ ] Edited and saved a block
- [ ] Published a page
- [ ] Viewed published page

**All checked?** You're ready to build! 🎉

---

**Quick Help:**
- Port usually 3000, but might be 3006 if 3000 is busy
- Always save changes before leaving page
- Use templates for faster content creation
- Check "Published" to make pages visible

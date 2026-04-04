# Quick Start Guide - Deep Nuclear Admin

Get up and running in 5 minutes!

## Step 1: Start a Local Server

Choose **ONE** of these commands:

```bash
# Option 1: Python 3
python -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000

# Option 3: PHP
php -S localhost:8000
```

## Step 2: Open Admin UI

Open your browser and go to:
```
http://localhost:8000/admin-ui/
```

## Step 3: Explore!

### View Existing Sites
- **Dashboard**: See overview of 3 pre-loaded sites (Jadugoda, Fukushima, Chernobyl)
- **Sites**: Manage site details
- **Timeline**: View and edit timeline events
- **Reports**: Read and edit reports
- **Generate Site**: Create beautiful static HTML pages

### Add a New Site

1. Click **Sites** → **+ Add New Site**
2. Fill in details (ID, Name, Country, Type, etc.)
3. Click **Save Site**
4. Download the `sites.json` file
5. Replace `/storage/sites.json` with downloaded file
6. Refresh the page!

### Add Timeline Events

1. Click **Timeline**
2. Select a site from dropdown
3. Click **+ Add Event**
4. Fill in event details
5. Download updated JSON
6. Replace file in `/storage/timelines/`

### Edit Reports

1. Click **Reports**
2. Select a site
3. Edit content using Medium-like editor
4. Use toolbar for formatting
5. Preview your changes
6. Download markdown file
7. Replace file in `/storage/reports/`

### Generate Static Pages

1. Click **Generate Site**
2. Click **Generate All Sites**
3. Download each HTML file
4. Place in `/public-site/sites/`
5. Share these beautiful pages!

## What You Get

✅ **3 Pre-loaded Sites**
- Jadugoda (33 events, 2001-2025)
- Fukushima (17 events, 1967-2025)
- Chernobyl (21 events, 1977-2025)

✅ **Admin Features**
- Dashboard with stats
- Site management
- Timeline editor with drag-free reordering
- Medium-like report editor
- Static site generator

✅ **Beautiful Output**
- Newspaper-style design
- Animated statistics
- Interactive timeline
- Mobile-responsive
- No dependencies!

## File Structure

```
storage/
├── sites.json              ← Master site list
├── schema.json             ← Data definitions
├── timelines/
│   ├── jadugoda.json      ← Timeline events
│   ├── fukushima.json
│   └── chernobyl.json
├── reports/
│   ├── jadugoda.md        ← Full reports
│   ├── fukushima.md
│   └── chernobyl.md
└── media/
    └── {site-id}/         ← Images
```

## Common Tasks

### Backup Your Data
```bash
cp -r storage storage-backup
```

### Generate All Static Pages
1. Go to "Generate Site"
2. Click "Generate All Sites"
3. Download all HTML files
4. Share!

### Integrate with Your Frontend
```javascript
// Load all sites
fetch('/storage/sites.json')
  .then(res => res.json())
  .then(sites => console.log(sites));

// Load specific timeline
fetch('/storage/timelines/fukushima.json')
  .then(res => res.json())
  .then(events => console.log(events));
```

## Need Help?

- Read `README_ADMIN.md` for full documentation
- Check browser console for errors
- Make sure local server is running
- Verify JSON files are valid

## Tips

💡 **Always use the "Download" buttons** - Changes are saved to files you download, not directly to disk

💡 **Keep backups** - Copy your `/storage/` folder regularly

💡 **Use the generator** - Create beautiful static pages for sharing

💡 **Markdown support** - Reports support full Markdown formatting

---

**You're all set! Start exploring the Deep Nuclear admin interface.**

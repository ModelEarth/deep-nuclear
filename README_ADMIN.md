# Deep Nuclear - Admin UI & Storage System

A comprehensive content management system for documenting nuclear sites, timelines, and impact reports. Features an easy-to-use admin interface and generates beautiful newspaper-style static pages.

## 📁 Project Structure

```
deep-nuclear/
├── storage/                  # Data storage (JSON & Markdown)
│   ├── sites.json           # Master list of all nuclear sites
│   ├── schema.json          # Data schema definitions
│   ├── timelines/           # Timeline JSON files (one per site)
│   │   ├── jadugoda.json
│   │   ├── fukushima.json
│   │   └── chernobyl.json
│   ├── reports/             # Report markdown files (one per site)
│   │   ├── jadugoda.md
│   │   ├── fukushima.md
│   │   └── chernobyl.md
│   └── media/               # Images and media files
│       ├── jadugoda/
│       ├── fukushima/
│       └── chernobyl/
│
├── admin-ui/                # Admin interface (HTML/CSS/JS)
│   ├── index.html           # Dashboard
│   ├── css/
│   │   └── style.css        # Admin UI styles
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── sites.js
│   │   ├── timeline.js
│   │   ├── reports.js
│   │   └── generator.js
│   └── pages/
│       ├── sites.html       # Site management
│       ├── timeline.html    # Timeline editor
│       ├── reports.html     # Report editor (Medium-like)
│       └── generator.html   # Static site generator
│
└── public-site/             # Generated static pages (output)
    └── sites/               # Generated HTML files go here
        ├── jadugoda.html
        ├── fukushima.html
        └── chernobyl.html
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A simple local web server
- A text editor (optional, for advanced editing)

### Installation

1. **Clone or download this repository**

2. **Start a local web server** (required for loading JSON files)

   Choose one of these methods:

   **Python (Python 3):**
   ```bash
   cd deep-nuclear
   python -m http.server 8000
   ```

   **Python (Python 2):**
   ```bash
   cd deep-nuclear
   python -m SimpleHTTPServer 8000
   ```

   **Node.js:**
   ```bash
   cd deep-nuclear
   npx http-server -p 8000
   ```

   **PHP:**
   ```bash
   cd deep-nuclear
   php -S localhost:8000
   ```

3. **Open the admin interface** in your browser:
   ```
   http://localhost:8000/admin-ui/
   ```

## 🎯 Features

### 1. Dashboard
- Overview of all sites with statistics
- Quick access to add/edit content
- Real-time data loading from storage

### 2. Site Management
- Add, edit, and delete nuclear sites
- Complete site metadata (coordinates, type, status, etc.)
- Automatic file structure creation
- Download updated JSON files

### 3. Timeline Editor
- Add, edit, delete, and reorder timeline events
- 19 event categories (Scientific Study, Industrial Accident, etc.)
- Drag-free reordering (move up/down buttons)
- Status tracking (Ongoing risk, Claimed improvement, etc.)
- Direct download of updated timeline JSON

### 4. Report Editor (Medium-like)
- Clean, distraction-free writing interface
- Markdown support for formatting
- Live preview mode
- Templates for new reports
- Beautiful typography

### 5. Static Site Generator
- Generates beautiful newspaper-style HTML pages
- Self-contained files (no external dependencies)
- Animated statistics
- Interactive timeline filtering
- Mobile-responsive design
- Grayscale aesthetic with vintage newspaper styling

## 📝 How to Use

### Adding a New Site

1. Go to **Sites** in the navigation
2. Click **+ Add New Site**
3. Fill in the required fields:
   - **Site ID**: lowercase, no spaces (e.g., "three-mile-island")
   - **Site Name**: display name (e.g., "Three Mile Island")
   - **Country & Region**
   - **Coordinates** (lat/lon for map)
   - **Site Type** (uranium_tailings, nuclear_power_plant, etc.)
   - **Status** (ongoing, resolved, monitoring, etc.)
   - **Description**: brief summary
4. Click **Save Site**
5. Download the updated `sites.json` file
6. Replace `/storage/sites.json` with the downloaded file

### Creating Timeline Events

1. Go to **Timeline** in the navigation
2. Select a site from the dropdown
3. Click **+ Add Event**
4. Fill in event details:
   - Year, Category, Title
   - Location, Status
   - Summary (detailed description)
   - Source & Link
5. Click **Save Event**
6. Download the updated JSON file
7. Replace `/storage/timelines/{site-id}.json` with the downloaded file

### Writing Reports

1. Go to **Reports** in the navigation
2. Select a site from the dropdown
3. Write your report using the Medium-like editor:
   - Use the toolbar for formatting (headers, bold, links, etc.)
   - Click **Preview** to see how it looks
   - Images can be added with Markdown: `![description](path)`
4. Click **Save Report**
5. Download the markdown file
6. Replace `/storage/reports/{site-id}.md` with the downloaded file

### Generating Static Sites

1. Go to **Generate Site** in the navigation
2. Click **Generate All Sites**
3. Download each generated HTML file
4. Place them in `/public-site/sites/`
5. Share these files directly - they work without a server!

## 🎨 Static Page Features

The generated static pages include:

- **Newspaper-style design** with vintage aesthetics
- **Animated statistics** that count up when scrolled into view
- **Interactive timeline** with year markers and event cards
- **Filter controls** to show/hide events by status
- **Embedded maps** showing site locations (OpenStreetMap)
- **Mobile-responsive** layout
- **Zero dependencies** - fully self-contained HTML files

## 💾 Data Management

### Storage Format

All data is stored in simple JSON and Markdown files:

- **sites.json**: Array of all nuclear sites with metadata
- **timelines/{id}.json**: Array of timeline events for each site
- **reports/{id}.md**: Markdown report for each site
- **media/{id}/**: Folder for images and media

### Backup Your Data

Always keep backups of your `/storage/` directory! This contains all your content.

```bash
# Create a backup
cp -r storage storage-backup-$(date +%Y%m%d)

# Or use git
git add storage/
git commit -m "Update site data"
```

### Syncing with Your Frontend

Your public-facing website can fetch data directly from the JSON files:

```javascript
// Fetch all sites
fetch('/storage/sites.json')
  .then(res => res.json())
  .then(sites => {
    // Display sites on your website
  });

// Fetch timeline for a specific site
fetch('/storage/timelines/jadugoda.json')
  .then(res => res.json())
  .then(timeline => {
    // Display timeline
  });
```

## 🌐 Current Sites

The system comes pre-loaded with three nuclear sites:

1. **Jadugoda Uranium Tailings** (India)
   - 33 events from 2001-2025
   - Uranium tailings contamination case study

2. **Fukushima Daiichi Nuclear Disaster** (Japan)
   - 17 events from 1967-2025
   - Major nuclear power plant disaster

3. **Chernobyl Nuclear Disaster** (Ukraine)
   - 21 events from 1977-2025
   - Historical nuclear catastrophe

## 🔧 Customization

### Modifying Styles

Edit `/admin-ui/css/style.css` to customize the admin interface appearance.

The static page styles are embedded in the generator. To modify them, edit the `getStylesHTML()` function in `/admin-ui/js/generator.js`.

### Adding Event Categories

Event categories are defined in `/admin-ui/pages/timeline.html` in the `<select id="eventCategory">` element.

### Adding Site Types

Site types are defined in `/admin-ui/pages/sites.html` in the `<select id="siteType">` element.

## 📚 Data Schema

### Site Object
```json
{
  "id": "string",
  "name": "string",
  "country": "string",
  "region": "string",
  "coordinates": { "lat": number, "lon": number },
  "siteType": "uranium_tailings|nuclear_power_plant|...",
  "issueType": "contamination|accident|disaster|...",
  "status": "ongoing|resolved|monitoring|...",
  "timeline": { "startYear": number, "endYear": number },
  "files": {
    "timeline": "path/to/timeline.json",
    "report": "path/to/report.md",
    "mediaFolder": "path/to/media/"
  },
  "media": {
    "coverImage": "path/to/image.jpg",
    "externalPhotoUrl": "https://..."
  },
  "description": "string",
  "metadata": {
    "createdAt": "ISO date",
    "updatedAt": "ISO date",
    "order": number
  }
}
```

### Timeline Event Object
```json
{
  "year": number,
  "category": "string",
  "title": "string",
  "location": "string",
  "status": "Ongoing risk|Claimed improvement|Policy regression|Resolved",
  "summary": "string",
  "source": "string",
  "link": "https://..."
}
```

## 🐛 Troubleshooting

### Data Not Loading
- Make sure you're running a local web server (not just opening files directly)
- Check browser console for errors
- Verify JSON files are valid (use a JSON validator)

### Files Not Downloading
- Some browsers block downloads - check your download settings
- Make sure pop-ups are allowed for localhost

### Changes Not Showing
- After editing files in `/storage/`, refresh the admin UI
- Clear browser cache if needed

## 🤝 Contributing

To add more sites:

1. Use the admin UI to create site data
2. Create timeline events
3. Write reports
4. Generate static pages
5. Commit changes to your repository

## 📄 License

This project is open source. Feel free to modify and adapt for your needs.

## 🙏 Credits

- Timeline design inspired by newspaper layouts
- Report editor inspired by Medium's writing interface
- Data format follows JSON standard conventions

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the data schema
- Verify file paths are correct
- Ensure all required fields are filled

---

**Built for documenting nuclear sites and their impacts with beautiful, accessible storytelling.**

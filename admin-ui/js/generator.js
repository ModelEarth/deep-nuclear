// Deep Nuclear - Static Site Generator
const STORAGE_PATH = '../../storage';
let sites = [];

// Load sites
async function loadSites() {
  try {
    const response = await fetch(`${STORAGE_PATH}/sites.json`);
    sites = await response.json();
  } catch (error) {
    console.error('Error loading sites:', error);
  }
}

// Generate all sites
async function generateAllSites() {
  const statusDiv = document.getElementById('generationStatus');
  const filesDiv = document.getElementById('generatedFiles');
  const filesListDiv = document.getElementById('filesList');

  statusDiv.innerHTML = '<p style="text-align: center; color: #2563eb; padding: 2rem;">Generating sites...</p>';

  await loadSites();

  let generatedHTML = '';

  for (const site of sites) {
    try {
      // Load timeline data
      const timelineResponse = await fetch(`${STORAGE_PATH}/${site.files.timeline}`);
      const timeline = await timelineResponse.json();

      // Generate HTML
      const html = generateSiteHTML(site, timeline);

      // Create download link
      const filename = `${site.id}.html`;
      generatedHTML += `
        <div style="background: white; border: 1px solid #e5e7eb; padding: 1rem; margin-bottom: 1rem; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>${site.name}</strong>
              <div style="color: #6b7280; font-size: 0.875rem;">${filename}</div>
            </div>
            <button onclick="downloadHTML('${filename}', '${escapeForAttribute(html)}')" class="btn btn-sm btn-primary">
              Download
            </button>
          </div>
        </div>
      `;
    } catch (error) {
      console.error(`Error generating ${site.id}:`, error);
      generatedHTML += `
        <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 1rem; margin-bottom: 1rem; border-radius: 6px;">
          <strong>${site.name}</strong>: Error generating site
        </div>
      `;
    }
  }

  statusDiv.innerHTML = '<p style="text-align: center; color: #16a34a; padding: 2rem;">✓ Generation complete!</p>';
  filesListDiv.innerHTML = generatedHTML;
  filesDiv.style.display = 'block';
}

// Escape HTML for attribute
function escapeForAttribute(html) {
  return html.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

// Download HTML file
function downloadHTML(filename, html) {
  // Unescape the HTML
  html = html.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Generate HTML for a site
function generateSiteHTML(site, timeline) {
  const eventCount = timeline.length;
  const years = timeline.length > 0 ?
    Math.max(...timeline.map(e => e.year)) - Math.min(...timeline.map(e => e.year)) + 1 : 0;

  // Count events by status
  const ongoingCount = timeline.filter(e => e.status === 'Ongoing risk').length;
  const pipelineRuptures = timeline.filter(e =>
    e.title.toLowerCase().includes('pipeline') ||
    e.title.toLowerCase().includes('rupture') ||
    e.title.toLowerCase().includes('leak')
  ).length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.name} - Deep Nuclear Timeline</title>
  ${getStylesHTML()}
</head>
<body>
  <div class="page">
    <!-- Hero Section -->
    <div class="hero">
      <h1>${site.name}</h1>
      <p class="subtitle">
        ${site.description}
      </p>
    </div>

    <!-- Summary Statistics -->
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-number-container">
          <span class="stat-number" data-target="${eventCount}" data-suffix="">0</span>
        </div>
        <span class="stat-label">Documented Events</span>
      </div>
      <div class="stat-box">
        <div class="stat-number-container">
          <span class="stat-number" data-target="${years}" data-suffix="">0</span>
        </div>
        <span class="stat-label">Years Tracked</span>
      </div>
      <div class="stat-box">
        <div class="stat-number-container">
          <span class="stat-number" data-target="${ongoingCount}" data-suffix="">0</span>
        </div>
        <span class="stat-label">Ongoing Issues</span>
      </div>
      <div class="stat-box">
        <div class="stat-number-container">
          <span class="stat-number" data-target="${timeline.filter(e => e.category === 'Industrial Accident').length}" data-suffix="">0</span>
        </div>
        <span class="stat-label">Industrial Accidents</span>
      </div>
    </div>

    <!-- Location Card with Map -->
    <h2>Location</h2>
    <div class="location-card">
      <p>
        <strong>Country:</strong> ${site.country}<br>
        <strong>Region:</strong> ${site.region || 'N/A'}<br>
        ${site.coordinates?.lat && site.coordinates?.lon ? `<strong>Coordinates:</strong> ${site.coordinates.lat}, ${site.coordinates.lon}` : ''}
      </p>
      ${site.coordinates?.lat && site.coordinates?.lon ? `
      <div class="map-container">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=${site.coordinates.lon - 0.2}%2C${site.coordinates.lat - 0.1}%2C${site.coordinates.lon + 0.2}%2C${site.coordinates.lat + 0.1}&layer=mapnik&marker=${site.coordinates.lat}%2C${site.coordinates.lon}"
          title="Map showing ${site.name} location">
        </iframe>
      </div>
      <p class="map-caption">
        Marker indicates the approximate location of ${site.name}.
      </p>
      ` : ''}
    </div>

    <!-- Timeline Section -->
    <h2>Complete Timeline: ${timeline[0]?.year || ''}–${timeline[timeline.length - 1]?.year || ''}</h2>

    <!-- Filters -->
    <div class="filter-section">
      <div class="filter-header">Filter Timeline by Status:</div>
      <div class="filter-controls" id="filters">
        <span style="color: #6b7280;">(loading...)</span>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline-container">
      <div class="timeline-line"></div>
      <div id="timeline-events">
        <!-- Filled by JavaScript -->
      </div>
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="empty-message" style="display: none;">
      No events match the current filters. Try selecting different status options above.
    </div>

    <!-- Closing Section -->
    <div class="closing-section">
      <h2>About This Timeline</h2>
      <p>
        This timeline documents ${eventCount} events spanning ${years} years at ${site.name}.
        The data includes scientific studies, investigative reports, policy changes, and documented incidents.
      </p>
      <p>
        Events are categorized by type and status to help distinguish between ongoing documented risks,
        claimed improvements by authorities, and policy changes that may affect oversight and accountability.
      </p>
    </div>
  </div>

  <script>
    const timelineData = ${JSON.stringify(timeline, null, 2)};

    ${getJavaScriptHTML()}
  </script>
</body>
</html>`;
}

// Get styles HTML
function getStyles HTML() {
  return `<style>
    * { box-sizing: border-box; }
    body {
      font-family: "Times New Roman", "Times", serif;
      margin: 0;
      padding: 2rem 1.5rem;
      line-height: 1.8;
      background: #fafafa;
      background-image:
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 4px);
      color: #1a1a1a;
    }
    .page {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 3rem 3.5rem;
      border: 2px solid #000000;
      box-shadow: 0 0 0 1px #ffffff, 0 0 0 3px #000000, 8px 8px 0 0 rgba(0,0,0,0.1);
      position: relative;
    }
    .page::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      height: 8px;
      background: repeating-linear-gradient(90deg, #000000 0px, #000000 10px, #ffffff 10px, #ffffff 20px);
    }
    .hero {
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 3px double #000000;
      text-align: left;
      position: relative;
    }
    .hero::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 100px;
      height: 3px;
      background: #000000;
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1.25rem 0;
      color: #000000;
      line-height: 1.3;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 1rem;
      color: #2a2a2a;
      margin: 0;
      line-height: 1.8;
      font-weight: 400;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      margin: 2.5rem 0;
      padding: 0;
      background: #ffffff;
      border: 3px solid #000000;
      position: relative;
      overflow: hidden;
    }
    .stats-grid::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: repeating-linear-gradient(90deg, #000000 0px, #000000 4px, #ffffff 4px, #ffffff 8px);
      z-index: 3;
    }
    .stat-box {
      text-align: center;
      border-left: 2px solid #000000;
      padding: 2.5rem 1.5rem 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      background: #ffffff;
      transition: all 0.3s ease;
    }
    .stat-box:first-child { border-left: none; }
    .stat-box:hover { background: #fafafa; transform: translateY(-2px); }
    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      display: block;
      margin-bottom: 0.5rem;
      color: #000000;
      font-family: "Times New Roman", serif;
      line-height: 1.2;
      min-height: 3rem;
    }
    .stat-label {
      font-size: 0.8rem;
      color: #4a4a4a;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      line-height: 1.4;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 3rem 0 1.5rem 0;
      color: #000000;
      border-bottom: 3px double #000000;
      padding-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      position: relative;
    }
    h2::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 60px;
      height: 3px;
      background: #000000;
    }
    .location-card {
      background: #ffffff;
      border: 2px solid #000000;
      border-left: 6px solid #000000;
      padding: 1.75rem;
      margin: 1.5rem 0 2.5rem 0;
      position: relative;
    }
    .location-card p {
      margin: 0 0 1rem 0;
      font-size: 0.95rem;
      color: #2a2a2a;
      line-height: 1.8;
    }
    .map-container {
      margin-top: 1.25rem;
      overflow: hidden;
      border: 3px solid #000000;
      position: relative;
    }
    .map-container iframe {
      width: 100%;
      height: 350px;
      border: none;
      display: block;
      filter: grayscale(100%) contrast(1.1);
    }
    .map-caption {
      font-size: 0.8rem;
      color: #6a6a6a;
      margin-top: 0.6rem;
      font-style: italic;
    }
    .filter-section {
      margin: 2rem 0;
      padding: 1.5rem;
      background: #fafafa;
      border: 2px solid #000000;
      border-top: 4px solid #000000;
      position: relative;
    }
    .filter-header {
      font-weight: 700;
      color: #000000;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .filter-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .filter-controls label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.6rem 1.2rem;
      background: #ffffff;
      border: 2px solid #000000;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.2s ease;
    }
    .filter-controls label:hover {
      background: #000000;
      color: #ffffff;
    }
    .filter-controls input[type="checkbox"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
      border: 2px solid #000000;
      appearance: none;
      background: #ffffff;
      position: relative;
    }
    .filter-controls input[type="checkbox"]:checked::before {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      font-weight: 700;
      color: #000000;
    }
    .timeline-container {
      position: relative;
      padding: 2rem 0;
      margin-left: 0;
    }
    .timeline-line {
      position: absolute;
      left: 50px;
      top: 0;
      bottom: 0;
      width: 3px;
      background: repeating-linear-gradient(to bottom, #000000 0px, #000000 10px, transparent 10px, transparent 15px);
    }
    .timeline-event {
      position: relative;
      margin-bottom: 3rem;
      padding-left: 90px;
      animation: fadeSlideIn 0.6s ease-out backwards;
    }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .timeline-year {
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      font-size: 1.1rem;
      font-weight: 700;
      color: #000000;
      text-align: right;
      font-family: "Times New Roman", serif;
      z-index: 2;
    }
    .timeline-dot {
      position: absolute;
      left: 43px;
      top: 6px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #ffffff;
      border: 3px solid #000000;
      z-index: 2;
      box-shadow: 0 0 0 3px #ffffff;
      transition: all 0.3s ease;
    }
    .timeline-event:hover .timeline-dot {
      transform: scale(1.3);
      box-shadow: 0 0 0 6px rgba(0,0,0,0.1);
    }
    .timeline-card {
      background: #ffffff;
      border: 2px solid #000000;
      border-left: 5px solid #000000;
      padding: 1.5rem;
      box-shadow: 3px 3px 0 0 rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      position: relative;
    }
    .timeline-card:hover {
      border-left-width: 8px;
      box-shadow: 3px 3px 0 0 rgba(0,0,0,0.15), 6px 6px 0 0 rgba(0,0,0,0.05);
      transform: translateX(3px);
    }
    .event-header {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px dashed #d0d0d0;
    }
    .category-badge {
      display: inline-block;
      padding: 0.3rem 0.75rem;
      font-size: 0.7rem;
      font-weight: 700;
      background: #000000;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .status-pill {
      display: inline-block;
      padding: 0.3rem 0.75rem;
      font-size: 0.7rem;
      font-weight: 700;
      white-space: nowrap;
      border: 2px solid #000000;
      background: #ffffff;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .event-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    }
    .event-title a {
      color: #000000;
      text-decoration: none;
      transition: all 0.2s ease;
      border-bottom: 2px solid transparent;
    }
    .event-title a:hover {
      border-bottom: 2px solid #000000;
    }
    .event-location {
      font-size: 0.85rem;
      color: #4a4a4a;
      margin-bottom: 0.75rem;
      font-style: italic;
    }
    .event-location::before {
      content: '📍 ';
      opacity: 0.6;
    }
    .event-summary {
      font-size: 0.9rem;
      color: #2a2a2a;
      line-height: 1.8;
      margin-bottom: 0.75rem;
    }
    .event-source {
      font-size: 0.8rem;
      color: #6a6a6a;
      font-style: italic;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px dotted #d0d0d0;
    }
    .event-source::before {
      content: '→ ';
      font-style: normal;
    }
    .empty-message {
      text-align: center;
      padding: 4rem 2rem;
      color: #6a6a6a;
      font-size: 1rem;
      font-style: italic;
      border: 2px dashed #d0d0d0;
    }
    .closing-section {
      margin: 3rem 0 0 0;
      padding: 2rem;
      background: #fafafa;
      border: 2px solid #000000;
      border-left: 6px solid #000000;
      position: relative;
    }
    .closing-section h2 {
      margin-top: 0;
      color: #000000;
      border-bottom: 2px solid #000000;
    }
    .closing-section h2::after {
      display: none;
    }
    .closing-section p {
      margin: 0 0 1rem 0;
      font-size: 0.95rem;
      color: #2a2a2a;
      line-height: 1.8;
    }
    .closing-section p:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 768px) {
      body { padding: 1rem; }
      .page { padding: 2rem 1.5rem; }
      h1 { font-size: 1.5rem; }
      h2 { font-size: 1.25rem; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .stat-box { border-left: none; padding: 1.5rem 0.75rem; border-bottom: 2px solid #000000; border-right: 2px solid #000000; }
      .stat-box:nth-child(2n) { border-right: none; }
      .stat-box:nth-child(n+3) { border-bottom: none; }
      .stat-number { font-size: 2rem; min-height: 2.5rem; }
      .timeline-event { padding-left: 70px; }
      .timeline-year { font-size: 0.95rem; width: 35px; }
      .timeline-line { left: 40px; }
      .timeline-dot { left: 34px; width: 12px; height: 12px; }
      .event-title { font-size: 1rem; }
      .filter-controls label { width: 100%; }
    }
  </style>`;
}

// Get JavaScript HTML
function getJavaScriptHTML() {
  return `
    let allEvents = timelineData;
    let activeStatuses = new Set();

    function animateStatNumber(statElement) {
      const target = parseInt(statElement.getAttribute('data-target'));
      const suffix = statElement.getAttribute('data-suffix') || '';
      const duration = 2500;
      const startTime = Date.now();

      function updateNumber() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOutCubic * target);

        statElement.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          statElement.textContent = target + suffix;
        }
      }

      setTimeout(() => {
        updateNumber();
      }, 300);
    }

    function initStatAnimations() {
      const statNumbers = document.querySelectorAll('.stat-number[data-target]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const statElement = entry.target;
            if (!statElement.classList.contains('animated')) {
              statElement.classList.add('animated');
              animateStatNumber(statElement);
            }
            observer.unobserve(statElement);
          }
        });
      }, { threshold: 0.5 });

      statNumbers.forEach(stat => {
        observer.observe(stat);
      });
    }

    function initStatusFilters() {
      const filtersDiv = document.getElementById("filters");
      filtersDiv.innerHTML = "";

      const statuses = Array.from(new Set(allEvents.map(ev => ev.status).filter(Boolean))).sort();
      statuses.forEach(status => activeStatuses.add(status));

      if (!statuses.length) {
        filtersDiv.innerHTML = '<span style="color: #6b7280;">No status values found.</span>';
        return;
      }

      statuses.forEach(status => {
        const label = document.createElement("label");
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = status;
        cb.checked = true;
        cb.addEventListener("change", function () {
          if (cb.checked) {
            activeStatuses.add(status);
          } else {
            activeStatuses.delete(status);
          }
          renderTimeline();
        });

        label.appendChild(cb);
        const text = document.createTextNode(" " + status);
        label.appendChild(text);
        filtersDiv.appendChild(label);
      });
    }

    function renderTimeline() {
      const container = document.getElementById("timeline-events");
      const emptyState = document.getElementById("empty-state");
      container.innerHTML = "";

      const filteredEvents = allEvents.slice().sort((a, b) => (a.year || 0) - (b.year || 0))
        .filter(ev => !activeStatuses.size || !ev.status || activeStatuses.has(ev.status));

      if (filteredEvents.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
      } else {
        container.style.display = 'block';
        emptyState.style.display = 'none';
      }

      filteredEvents.forEach(ev => {
        const eventDiv = document.createElement("div");
        eventDiv.className = "timeline-event";

        const yearSpan = document.createElement("div");
        yearSpan.className = "timeline-year";
        yearSpan.textContent = ev.year || "";
        eventDiv.appendChild(yearSpan);

        const dot = document.createElement("div");
        dot.className = "timeline-dot";
        eventDiv.appendChild(dot);

        const card = document.createElement("div");
        card.className = "timeline-card";

        const header = document.createElement("div");
        header.className = "event-header";

        if (ev.category) {
          const catBadge = document.createElement("span");
          catBadge.className = "category-badge";
          catBadge.textContent = ev.category;
          header.appendChild(catBadge);
        }

        if (ev.status) {
          const statusPill = document.createElement("span");
          statusPill.className = "status-pill";
          statusPill.textContent = ev.status;
          header.appendChild(statusPill);
        }

        card.appendChild(header);

        const titleH3 = document.createElement("h3");
        titleH3.className = "event-title";
        if (ev.link) {
          const a = document.createElement("a");
          a.href = ev.link;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = ev.title || "(link)";
          titleH3.appendChild(a);
        } else {
          titleH3.textContent = ev.title || "";
        }
        card.appendChild(titleH3);

        if (ev.location) {
          const locDiv = document.createElement("div");
          locDiv.className = "event-location";
          locDiv.textContent = ev.location;
          card.appendChild(locDiv);
        }

        if (ev.summary) {
          const summaryP = document.createElement("div");
          summaryP.className = "event-summary";
          summaryP.textContent = ev.summary;
          card.appendChild(summaryP);
        }

        if (ev.source) {
          const sourceDiv = document.createElement("div");
          sourceDiv.className = "event-source";
          sourceDiv.textContent = ev.source;
          card.appendChild(sourceDiv);
        }

        eventDiv.appendChild(card);
        container.appendChild(eventDiv);
      });
    }

    document.addEventListener("DOMContentLoaded", function () {
      initStatAnimations();
      initStatusFilters();
      renderTimeline();
    });
  `;
}

// Initialize
loadSites();

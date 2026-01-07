// Deep Nuclear Admin Dashboard
const STORAGE_PATH = '../storage';

// Load dashboard data
async function loadDashboard() {
  try {
    // Load sites
    const sitesResponse = await fetch(`${STORAGE_PATH}/sites.json`);
    const sites = await sitesResponse.json();

    // Update stats
    document.getElementById('totalSites').textContent = sites.length;
    document.getElementById('ongoingSites').textContent = sites.filter(s => s.status === 'ongoing').length;
    document.getElementById('totalReports').textContent = sites.length;

    // Count total timeline events
    let totalEvents = 0;
    for (const site of sites) {
      try {
        const timelineResponse = await fetch(`${STORAGE_PATH}/${site.files.timeline}`);
        const timeline = await timelineResponse.json();
        totalEvents += timeline.length;
      } catch (e) {
        console.error(`Error loading timeline for ${site.id}:`, e);
      }
    }
    document.getElementById('totalEvents').textContent = totalEvents;

    // Display recent sites
    displayRecentSites(sites);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    document.getElementById('recentSites').innerHTML = `
      <div class="alert alert-error">
        <strong>Error:</strong> Could not load data. Make sure you're running a local server.
        <br><br>
        <strong>To run a server:</strong>
        <br>• Python: <code>python -m http.server 8000</code>
        <br>• Node.js: <code>npx http-server</code>
        <br>• PHP: <code>php -S localhost:8000</code>
      </div>
    `;
  }
}

function displayRecentSites(sites) {
  const container = document.getElementById('recentSites');

  if (sites.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No sites yet. Add your first site!</p>';
    return;
  }

  const html = `
    <div class="sites-grid">
      ${sites.map(site => `
        <div class="site-card">
          <div class="site-card-header">
            <h3>${site.name}</h3>
            <div class="site-meta">${site.region}, ${site.country}</div>
          </div>
          <div class="site-card-body">
            <p>${site.description}</p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
              <span class="badge badge-${site.status}">${site.status}</span>
              <span class="badge" style="background: #e0e7ff; color: #3730a3;">${site.siteType.replace(/_/g, ' ')}</span>
            </div>
            <div style="font-size: 0.875rem; color: #6b7280;">
              <strong>Timeline:</strong> ${site.timeline.startYear} - ${site.timeline.endYear}
            </div>
          </div>
          <div class="site-card-footer">
            <a href="pages/sites.html?edit=${site.id}" class="btn btn-sm btn-secondary">Edit</a>
            <a href="pages/timeline.html?site=${site.id}" class="btn btn-sm btn-secondary">Timeline</a>
            <a href="pages/reports.html?site=${site.id}" class="btn btn-sm btn-secondary">Report</a>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
}

// Initialize dashboard
loadDashboard();

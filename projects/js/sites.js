// Deep Nuclear - Sites Management
const STORAGE_PATH = '../../storage';
let sites = [];
let editingIndex = -1;

// Load all sites
async function loadSites() {
  try {
    const response = await fetch(`${STORAGE_PATH}/sites.json`);
    sites = await response.json();
    displaySites();
  } catch (error) {
    console.error('Error loading sites:', error);
    document.getElementById('sitesContainer').innerHTML = `
      <div class="alert alert-error">
        <strong>Error:</strong> Could not load sites. Make sure you're running a local server.
      </div>
    `;
  }
}

// Display sites
function displaySites() {
  const container = document.getElementById('sitesContainer');

  if (sites.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No sites yet. Add your first site!</p>';
    return;
  }

  const html = `
    <div class="sites-grid">
      ${sites.map((site, index) => `
        <div class="site-card">
          <div class="site-card-header">
            <h3>${site.name}</h3>
            <div class="site-meta">${site.region || ''} ${site.country}</div>
          </div>
          <div class="site-card-body">
            <p>${site.description}</p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
              <span class="badge badge-${site.status}">${site.status}</span>
              <span class="badge" style="background: #e0e7ff; color: #3730a3;">${site.siteType.replace(/_/g, ' ')}</span>
            </div>
            <div style="font-size: 0.875rem; color: #6b7280;">
              <strong>ID:</strong> ${site.id}<br>
              <strong>Timeline:</strong> ${site.timeline?.startYear || 'N/A'} - ${site.timeline?.endYear || 'N/A'}
            </div>
          </div>
          <div class="site-card-footer">
            <button onclick="editSite(${index})" class="btn btn-sm btn-secondary">Edit</button>
            <a href="timeline.html?site=${site.id}" class="btn btn-sm btn-secondary">Timeline</a>
            <a href="reports.html?site=${site.id}" class="btn btn-sm btn-secondary">Report</a>
            <button onclick="deleteSite(${index})" class="btn btn-sm btn-danger">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
}

// Open site modal
function openSiteModal() {
  editingIndex = -1;
  document.getElementById('modalTitle').textContent = 'Add New Site';
  document.getElementById('siteForm').reset();
  document.getElementById('siteId').disabled = false;
  document.getElementById('siteModal').classList.add('active');
}

// Close site modal
function closeSiteModal() {
  document.getElementById('siteModal').classList.remove('active');
  document.getElementById('siteForm').reset();
  editingIndex = -1;
}

// Edit site
function editSite(index) {
  editingIndex = index;
  const site = sites[index];

  document.getElementById('modalTitle').textContent = 'Edit Site';
  document.getElementById('siteId').value = site.id;
  document.getElementById('siteId').disabled = true; // Can't change ID
  document.getElementById('siteName').value = site.name;
  document.getElementById('country').value = site.country;
  document.getElementById('region').value = site.region || '';
  document.getElementById('lat').value = site.coordinates?.lat || '';
  document.getElementById('lon').value = site.coordinates?.lon || '';
  document.getElementById('siteType').value = site.siteType;
  document.getElementById('issueType').value = site.issueType || '';
  document.getElementById('status').value = site.status;
  document.getElementById('startYear').value = site.timeline?.startYear || '';
  document.getElementById('endYear').value = site.timeline?.endYear || '';
  document.getElementById('description').value = site.description;
  document.getElementById('externalPhotoUrl').value = site.media?.externalPhotoUrl || '';
  document.getElementById('order').value = site.metadata?.order || '';

  document.getElementById('siteModal').classList.add('active');
}

// Save site
function saveSite(event) {
  event.preventDefault();

  const siteData = {
    id: document.getElementById('siteId').value.toLowerCase().trim(),
    name: document.getElementById('siteName').value.trim(),
    country: document.getElementById('country').value.trim(),
    region: document.getElementById('region').value.trim(),
    coordinates: {
      lat: parseFloat(document.getElementById('lat').value) || null,
      lon: parseFloat(document.getElementById('lon').value) || null
    },
    siteType: document.getElementById('siteType').value,
    issueType: document.getElementById('issueType').value,
    status: document.getElementById('status').value,
    timeline: {
      startYear: parseInt(document.getElementById('startYear').value) || null,
      endYear: parseInt(document.getElementById('endYear').value) || null
    },
    files: {
      timeline: `storage/timelines/${document.getElementById('siteId').value}.json`,
      report: `storage/reports/${document.getElementById('siteId').value}.md`,
      mediaFolder: `storage/media/${document.getElementById('siteId').value}`
    },
    media: {
      coverImage: `storage/media/${document.getElementById('siteId').value}/${document.getElementById('siteId').value}.jpg`,
      externalPhotoUrl: document.getElementById('externalPhotoUrl').value.trim()
    },
    description: document.getElementById('description').value.trim(),
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: parseInt(document.getElementById('order').value) || sites.length + 1
    }
  };

  if (editingIndex >= 0) {
    // Update existing site
    siteData.metadata.createdAt = sites[editingIndex].metadata?.createdAt || siteData.metadata.createdAt;
    sites[editingIndex] = siteData;
  } else {
    // Add new site
    sites.push(siteData);
  }

  // Show the updated data in a downloadable format
  downloadJSON(sites, 'sites.json');

  displaySites();
  closeSiteModal();

  // Show success message
  alert(`Site "${siteData.name}" saved successfully!\n\nThe updated sites.json has been downloaded. Replace the file in storage/sites.json to save your changes.`);
}

// Delete site
function deleteSite(index) {
  const site = sites[index];
  if (confirm(`Are you sure you want to delete "${site.name}"?\n\nNote: This will not delete the timeline and report files.`)) {
    sites.splice(index, 1);
    downloadJSON(sites, 'sites.json');
    displaySites();
    alert('Site deleted! Download the updated sites.json file.');
  }
}

// Download JSON file
function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize
loadSites();

// Close modal when clicking outside
document.getElementById('siteModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeSiteModal();
  }
});

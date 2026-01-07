// Deep Nuclear - Timeline Management
const STORAGE_PATH = '../../storage';
let sites = [];
let currentSite = null;
let timelineEvents = [];
let editingIndex = -1;

// Load sites for selector
async function loadSites() {
  try {
    const response = await fetch(`${STORAGE_PATH}/sites.json`);
    sites = await response.json();

    const selector = document.getElementById('siteSelector');
    selector.innerHTML = '<option value="">Select a site...</option>' +
      sites.map(site => `<option value="${site.id}">${site.name}</option>`).join('');

    // Check URL params for site
    const params = new URLSearchParams(window.location.search);
    const siteId = params.get('site');
    if (siteId) {
      selector.value = siteId;
      loadTimeline();
    }
  } catch (error) {
    console.error('Error loading sites:', error);
  }
}

// Load timeline for selected site
async function loadTimeline() {
  const siteId = document.getElementById('siteSelector').value;

  if (!siteId) {
    document.getElementById('timelineContainer').innerHTML =
      '<p style="text-align: center; color: #6b7280; padding: 2rem;">Select a site to view timeline events</p>';
    document.getElementById('addEventBtn').disabled = true;
    return;
  }

  currentSite = sites.find(s => s.id === siteId);
  document.getElementById('addEventBtn').disabled = false;

  try {
    const response = await fetch(`${STORAGE_PATH}/timelines/${siteId}.json`);

    if (response.ok) {
      timelineEvents = await response.json();
      // Sort by year
      timelineEvents.sort((a, b) => a.year - b.year);
      displayTimeline();
    } else {
      // File doesn't exist yet
      timelineEvents = [];
      document.getElementById('timelineContainer').innerHTML =
        '<p style="text-align: center; color: #6b7280; padding: 2rem;">No timeline events yet. Add your first event!</p>';
    }
  } catch (error) {
    console.error('Error loading timeline:', error);
    timelineEvents = [];
    document.getElementById('timelineContainer').innerHTML =
      '<p style="text-align: center; color: #6b7280; padding: 2rem;">No timeline events yet. Add your first event!</p>';
  }
}

// Display timeline
function displayTimeline() {
  const container = document.getElementById('timelineContainer');

  if (timelineEvents.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No timeline events yet. Add your first event!</p>';
    return;
  }

  const html = timelineEvents.map((event, index) => `
    <div class="timeline-item">
      <div class="timeline-year">${event.year}</div>
      <span class="timeline-category">${event.category}</span>

      <h3 style="margin: 0.5rem 0; font-size: 1.25rem; color: #111827;">${event.title}</h3>

      ${event.location ? `<div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">📍 ${event.location}</div>` : ''}

      <div style="margin: 0.75rem 0;">
        <span class="badge badge-${event.status.toLowerCase().replace(/ /g, '-')}">${event.status}</span>
      </div>

      <p style="color: #374151; margin: 0.75rem 0;">${event.summary}</p>

      ${event.source ? `<div style="color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;"><strong>Source:</strong> ${event.source}</div>` : ''}

      ${event.link ? `<div style="margin-top: 0.5rem;"><a href="${event.link}" target="_blank" style="color: #2563eb; font-size: 0.875rem;">View Source →</a></div>` : ''}

      <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
        <button onclick="editEvent(${index})" class="btn btn-sm btn-secondary">Edit</button>
        <button onclick="moveEventUp(${index})" class="btn btn-sm btn-secondary" ${index === 0 ? 'disabled' : ''}>↑ Move Up</button>
        <button onclick="moveEventDown(${index})" class="btn btn-sm btn-secondary" ${index === timelineEvents.length - 1 ? 'disabled' : ''}>↓ Move Down</button>
        <button onclick="deleteEvent(${index})" class="btn btn-sm btn-danger">Delete</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

// Open event modal
function openEventModal() {
  editingIndex = -1;
  document.getElementById('modalTitle').textContent = 'Add Timeline Event';
  document.getElementById('eventForm').reset();
  document.getElementById('eventModal').classList.add('active');
}

// Close event modal
function closeEventModal() {
  document.getElementById('eventModal').classList.remove('active');
  document.getElementById('eventForm').reset();
  editingIndex = -1;
}

// Edit event
function editEvent(index) {
  editingIndex = index;
  const event = timelineEvents[index];

  document.getElementById('modalTitle').textContent = 'Edit Timeline Event';
  document.getElementById('eventYear').value = event.year;
  document.getElementById('eventCategory').value = event.category;
  document.getElementById('eventTitle').value = event.title;
  document.getElementById('eventLocation').value = event.location || '';
  document.getElementById('eventStatus').value = event.status;
  document.getElementById('eventSummary').value = event.summary;
  document.getElementById('eventSource').value = event.source || '';
  document.getElementById('eventLink').value = event.link || '';

  document.getElementById('eventModal').classList.add('active');
}

// Save event
function saveEvent(e) {
  e.preventDefault();

  const eventData = {
    year: parseInt(document.getElementById('eventYear').value),
    category: document.getElementById('eventCategory').value,
    title: document.getElementById('eventTitle').value.trim(),
    location: document.getElementById('eventLocation').value.trim(),
    status: document.getElementById('eventStatus').value,
    summary: document.getElementById('eventSummary').value.trim(),
    source: document.getElementById('eventSource').value.trim(),
    link: document.getElementById('eventLink').value.trim()
  };

  if (editingIndex >= 0) {
    timelineEvents[editingIndex] = eventData;
  } else {
    timelineEvents.push(eventData);
  }

  // Sort by year
  timelineEvents.sort((a, b) => a.year - b.year);

  // Download updated JSON
  downloadJSON(timelineEvents, `${currentSite.id}.json`);

  displayTimeline();
  closeEventModal();

  alert(`Event saved successfully!\n\nDownload the updated ${currentSite.id}.json and replace storage/timelines/${currentSite.id}.json`);
}

// Delete event
function deleteEvent(index) {
  const event = timelineEvents[index];
  if (confirm(`Delete event "${event.title}" from ${event.year}?`)) {
    timelineEvents.splice(index, 1);
    downloadJSON(timelineEvents, `${currentSite.id}.json`);
    displayTimeline();
    alert('Event deleted! Download the updated file.');
  }
}

// Move event up
function moveEventUp(index) {
  if (index > 0) {
    [timelineEvents[index], timelineEvents[index - 1]] = [timelineEvents[index - 1], timelineEvents[index]];
    downloadJSON(timelineEvents, `${currentSite.id}.json`);
    displayTimeline();
  }
}

// Move event down
function moveEventDown(index) {
  if (index < timelineEvents.length - 1) {
    [timelineEvents[index], timelineEvents[index + 1]] = [timelineEvents[index + 1], timelineEvents[index]];
    downloadJSON(timelineEvents, `${currentSite.id}.json`);
    displayTimeline();
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
document.getElementById('eventModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeEventModal();
  }
});

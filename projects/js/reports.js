// Deep Nuclear - Report Editor
const STORAGE_PATH = '../../storage';
let sites = [];
let currentSite = null;
let currentReport = '';
let isPreviewMode = false;

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
      loadReport();
    }
  } catch (error) {
    console.error('Error loading sites:', error);
  }
}

// Load report for selected site
async function loadReport() {
  const siteId = document.getElementById('siteSelector').value;

  if (!siteId) {
    document.getElementById('editorSection').style.display = 'none';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('placeholderSection').style.display = 'block';
    document.getElementById('saveBtn').disabled = true;
    return;
  }

  currentSite = sites.find(s => s.id === siteId);
  document.getElementById('saveBtn').disabled = false;
  document.getElementById('placeholderSection').style.display = 'none';
  document.getElementById('editorSection').style.display = 'block';
  isPreviewMode = false;
  document.getElementById('previewBtn').textContent = 'Preview';

  try {
    const response = await fetch(`${STORAGE_PATH}/reports/${siteId}.md`);

    if (response.ok) {
      const markdown = await response.text();
      parseMarkdownToEditor(markdown);
    } else {
      // File doesn't exist yet - create template
      createTemplate();
    }
  } catch (error) {
    console.error('Error loading report:', error);
    createTemplate();
  }
}

// Parse markdown and populate editor
function parseMarkdownToEditor(markdown) {
  // Extract title (first # heading)
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : currentSite.name;

  // Remove the title from content
  let content = markdown.replace(/^#\s+.+$/m, '').trim();

  document.getElementById('reportTitle').value = title;
  document.getElementById('reportContent').textContent = content;
}

// Create report template
function createTemplate() {
  const template = `![${currentSite.name}](../media/${currentSite.id}/${currentSite.id}.jpg)

*Image caption for ${currentSite.name}*

## Overview

${currentSite.description}

## Background

Write the background and history of this nuclear site...

## Key Events

Describe the major events and incidents...

## Health and Environmental Impacts

Document the health and environmental consequences...

## Current Status

Describe the current situation and ongoing challenges...

## Lessons and Implications

What can we learn from this case?

## References and Timeline

This report corresponds to the interactive timeline stored in \`storage/timelines/${currentSite.id}.json\`.

For more information:
- [Add relevant links here]
`;

  document.getElementById('reportTitle').value = currentSite.name;
  document.getElementById('reportContent').textContent = template;
}

// Insert markdown formatting
function insertMarkdown(before, after) {
  const content = document.getElementById('reportContent');
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    const newText = before + selectedText + after;
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));

    // Move cursor
    const newRange = document.createRange();
    newRange.selectNodeContents(content);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    // No selection, just insert at end
    content.textContent += before + after;
  }

  content.focus();
}

// Insert image
function insertImage() {
  const url = prompt('Enter image URL or path (e.g., ../media/site-name/image.jpg):');
  if (url) {
    const alt = prompt('Enter image description (alt text):') || 'Image';
    insertMarkdown(`\n![${alt}](${url})\n`, '');
  }
}

// Toggle preview mode
function togglePreview() {
  isPreviewMode = !isPreviewMode;

  if (isPreviewMode) {
    // Show preview
    document.getElementById('editorSection').style.display = 'none';
    document.getElementById('previewSection').style.display = 'block';
    document.getElementById('previewBtn').textContent = 'Edit';

    // Generate preview
    const title = document.getElementById('reportTitle').value;
    const content = document.getElementById('reportContent').textContent;
    const fullMarkdown = `# ${title}\n\n${content}`;

    // Use marked.js to convert markdown to HTML
    const html = marked.parse(fullMarkdown);
    document.getElementById('previewContent').innerHTML = html;
  } else {
    // Show editor
    document.getElementById('editorSection').style.display = 'block';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('previewBtn').textContent = 'Preview';
  }
}

// Save report
function saveReport() {
  const title = document.getElementById('reportTitle').value.trim();
  const content = document.getElementById('reportContent').textContent.trim();

  if (!title || !content) {
    alert('Please enter both a title and content for the report.');
    return;
  }

  // Generate full markdown
  const fullMarkdown = `# ${title}\n\n${content}`;

  // Download as .md file
  downloadMarkdown(fullMarkdown, `${currentSite.id}.md`);

  alert(`Report saved!\n\nDownload the ${currentSite.id}.md file and replace storage/reports/${currentSite.id}.md to save your changes.`);
}

// Download markdown file
function downloadMarkdown(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize
loadSites();

// Handle paste events to keep plain text
document.getElementById('reportContent')?.addEventListener('paste', function(e) {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  document.execCommand('insertText', false, text);
});

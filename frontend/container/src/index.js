// Track which remotes have been loaded
const loadedRemotes = new Set();

function renderError(el, text) {
  if (!el) return;
  el.innerHTML = `<div class="error">${text}</div>`;
}

async function loadActivity() {
  if (loadedRemotes.has('activity')) return;
  try {
    const module = await import("activity/ActivityWidget");
    const { renderActivityWidget } = module;
    const el = document.getElementById("activity-root");
    if (el) renderActivityWidget(el);
    loadedRemotes.add('activity');
  } catch (err) {
    console.error("Failed to load activity remote:", err);
    renderError(document.getElementById("activity-root"), "Activity failed to load.");
  }
}

async function loadProjects() {
  if (loadedRemotes.has('projects')) return;
  try {
    const module = await import("projects/ProjectsGrid");
    const { renderProjectsGrid } = module;
    const el = document.getElementById("projects-root");
    if (el) renderProjectsGrid(el);
    loadedRemotes.add('projects');
  } catch (err) {
    console.error("Failed to load projects remote:", err);
    renderError(document.getElementById("projects-root"), "Projects failed to load.");
  }
}

async function loadSkills() {
  if (loadedRemotes.has('skills')) return;
  try {
    const module = await import("skills/SkillsGrid");
    const { renderSkillGrid } = module;
    const el = document.getElementById("skills-root");
    if (el) renderSkillGrid(el);
    loadedRemotes.add('skills');
  } catch (err) {
    console.error("Failed to load skills remote:", err);
    renderError(document.getElementById("skills-root"), "Skills failed to load.");
  }
}

async function loadStats() {
  if (loadedRemotes.has('stats')) return;
  try {
    const module = await import("stats/StatsWidget");
    const { renderStatsWidget } = module;
    const el = document.getElementById("stats-root");
    if (el) renderStatsWidget(el);
    loadedRemotes.add('stats');
  } catch (err) {
    console.error("Failed to load stats remote:", err);
    renderError(document.getElementById("stats-root"), "Stats failed to load.");
  }
}

// Simple Router
function showPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  // Update nav links
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => link.classList.remove('active'));

  // Show selected page
  const page = document.getElementById(`page-${pageName}`);
  if (page) {
    page.classList.add('active');
  }

  // Update active nav link
  let activeLink = document.querySelector(`a[href="/${pageName}"]`);
  if (pageName === 'home' || pageName === '') {
    activeLink = document.querySelector('a[href="/"]');
  }
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Load remote if needed
  if (pageName === 'stats') loadStats();
  if (pageName === 'projects') loadProjects();
  if (pageName === 'activity') loadActivity();
  if (pageName === 'skills') loadSkills();
}

function navigateTo(path) {
  window.history.pushState(null, '', path || '/');
  handleRouting();
}

function handleRouting() {
  let pathname = window.location.pathname;
  let pageName = pathname.slice(1) || 'home';
  showPage(pageName);
}

// Handle popstate (browser back/forward)
window.addEventListener('popstate', handleRouting);

// Intercept link clicks for smooth navigation
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('/')) {
      e.preventDefault();
      navigateTo(href);
    }
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  handleRouting();
});
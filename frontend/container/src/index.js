function renderError(el, text) {
  if (!el) return;
  el.innerHTML = `<div class="error">${text}</div>`;
}

async function loadActivity() {
  try {
    const module = await import("activity/ActivityWidget");
    const { renderActivityWidget } = module;
    const el = document.getElementById("activity-root");
    if (el) renderActivityWidget(el);
  } catch (err) {
    console.error("Failed to load activity remote:", err);
    renderError(document.getElementById("activity-root"), "Activity failed to load.");
  }
}

async function loadProjects() {
  try {
    const module = await import("projects/ProjectsGrid");
    const { renderProjectsGrid } = module;
    const el = document.getElementById("projects-root");
    if (el) renderProjectsGrid(el);
  } catch (err) {
    console.error("Failed to load projects remote:", err);
    renderError(document.getElementById("projects-root"), "Projects failed to load.");
  }
}

async function loadSkills() {
  try {
    const module = await import("skills/SkillsGrid");
    const { renderSkillGrid } = module;
    const el = document.getElementById("skills-root");
    if (el) renderSkillGrid(el);
  } catch (err) {
    console.error("Failed to load skills remote:", err);
    renderError(document.getElementById("skills-root"), "Skills failed to load.");
  }
}

async function loadStats() {
  try {
    const module = await import("stats/StatsWidget");
    const { renderStatsWidget } = module;
    const el = document.getElementById("stats-root");
    if (el) renderStatsWidget(el);
  } catch (err) {
    console.error("Failed to load stats remote:", err);
    renderError(document.getElementById("stats-root"), "Stats failed to load.");
  }
}

function renderApp() {
  const main = document.getElementById("app-main");
  if (!main) return;

  main.innerHTML = `
    <div id="stats-root"></div>
    <div id="projects-root"></div>
    <div id="activity-root"></div>
    <div id="skills-root"></div>
  `;

  loadActivity();
  loadProjects();
  loadSkills();
  loadStats();
}

document.addEventListener("DOMContentLoaded", renderApp);
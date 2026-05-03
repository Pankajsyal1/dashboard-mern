async function loadActivity() {
  const module = await import("activity/ActivityWidget");
  const { renderActivityWidget } = module;
  const el = document.getElementById("activity-root");
  if (el) renderActivityWidget(el);
}

async function loadProjects() {
  const module = await import("projects/ProjectsGrid");
  const { renderProjectsGrid } = module;
  const el = document.getElementById("projects-root");
  if (el) renderProjectsGrid(el);
}

async function loadSkills() {
  const module = await import("skills/SkillsGrid");
  const { renderSkillsGrid } = module;
  const el = document.getElementById("skills-root");
  if (el) renderSkillsGrid(el);
}

async function loadStats() {
  const module = await import("stats/StatsWidget");
  const { renderStatsWidget } = module;
  const el = document.getElementById("stats-root");
  if (el) renderStatsWidget(el);
}



function renderApp() {
  const main = document.getElementById("app-main");
  main.innerHTML = `
    <div id="stats-widget"></div>
    <div id="projects-grid"></div>
    <div id="activity-widget"></div>
    <div id="skills-grid"></div>
  `;

  loadStats();
  loadProjects();
  loadActivity();
  loadSkills();
}

document.addEventListener("DOMContentLoaded", renderApp);
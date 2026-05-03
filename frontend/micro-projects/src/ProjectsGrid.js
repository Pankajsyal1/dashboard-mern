export async function renderProjectsGrid(containerEl) {
  const API = globalThis.API_BASE_URL || "http://localhost:5000/api";

  try {
    const res = await fetch(`${API}/projects`);
    const projects = await res.json();

    const html = `
      <div class="projects-grid">
        <h2>My Projects</h2>
        <div class="card-container">
          ${projects
            .map(
              (p) => `
              <div class="project-card">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <div class="tech-tags">
                  ${p.tech
                    .map((t) => `<span class="tag">${t}</span>`)
                    .join("")}
                </div>
                <div class="links">
                  <a href="${p.github}" target="_blank">GitHub</a>
                  ${p.deployed ? `<a href="${p.deployed}" target="_blank">Live</a>` : ""}
                </div>
              </div>`
            )
            .join("")}
        </div>
      </div>
    `;

    containerEl.innerHTML = html;
  } catch (err) {
    containerEl.innerHTML = "<div>Error loading projects</div>";
  }
}

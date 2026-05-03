export async function renderSkillGrid(containerEl) {
  const API = globalThis.API_BASE_URL || "http://localhost:5000/api";

  try {
    const res = await fetch(`${API}/skills`);
    const skills = await res.json();

    const html = `
      <div class="skills-grid">
        <h2>My Skills</h2>
        <div class="card-container">
          ${skills
            .map(
              (s) => `
              <div class="skill-card">
                <h3>${s.name}</h3>
                <p>${s.level}</p>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
    `;

    containerEl.innerHTML = html;
  } catch (err) {
    console.error(err);
    containerEl.innerHTML = "<div>Error loading skills</div>";
  }
}

export async function renderStatsWidget(containerEl) {
  const API = globalThis.API_BASE_URL || "http://localhost:5000/api";

  try {
    const res = await fetch(`${API}/stats`);
    const data = await res.json();

    const html = `
      <div class="stats-widget">
        <h2>Portfolio Stats</h2>
        <ul>
          <li><strong>${data.totalProjects || 0}</strong> Projects</li>
          <li><strong>${data.yearsOfExperience || 0}</strong> Years of Experience</li>
          <li><strong>${data.skillsCount || 0}</strong> Skills</li>
        </ul>
      </div>
    `;

    containerEl.innerHTML = html;
  } catch (err) {
    containerEl.innerHTML = "<div>Error loading stats</div>";
  }
}

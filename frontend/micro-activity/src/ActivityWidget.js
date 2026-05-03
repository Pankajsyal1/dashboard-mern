export async function renderActivityWidget(containerEl) {
  const API = "http://localhost:5000/api";

  try {
    const res = await fetch(`${API}/activities`);
    const activities = await res.json();

    const html = `
      <div class="activity-widget">
        <h2>Recent Activity</h2>
        <ul>
          ${activities
            .map(
              (a) =>
                `<li><time>${new Date(a.date).toLocaleDateString()}</time> — ${a.text}</li>`
            )
            .join("")}
        </ul>
      </div>
    `;

    containerEl.innerHTML = html;
  } catch (err) {
    containerEl.innerHTML = "<div>Error loading activity</div>";
  }
}
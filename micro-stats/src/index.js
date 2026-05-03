// micro-activity/src/index.js
console.log("micro-activity started");
import { renderStatsWidget } from "./StatsWidget";

const root = document.getElementById("stats-root");

if (root) {
  renderStatsWidget(root);
}
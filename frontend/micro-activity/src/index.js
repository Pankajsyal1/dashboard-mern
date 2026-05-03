// micro-activity/src/index.js
console.log("micro-activity started");
import { renderActivityWidget } from "./ActivityWidget";

const root = document.getElementById("activity-root");

if (root) {
  renderActivityWidget(root);
}
// micro-activity/src/index.js
console.log("micro-activity started");
import { renderProjectsGrid } from "./ProjectsGrid";

const root = document.getElementById("projects-root");

if (root) {
  renderProjectsGrid(root);
}
// micro-activity/src/index.js
console.log("micro-skills started");
import { renderSkillGrid } from "./SkillsGrid";

const root = document.getElementById("skills-root");

if (root) {
  renderSkillGrid(root);
}
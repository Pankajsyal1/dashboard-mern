require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const defaultOrigins = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
]);

const extraOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

for (const origin of extraOrigins) defaultOrigins.add(origin);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // curl/postman
      if (defaultOrigins.has(origin)) return callback(null, true);
      if (/^https:\/\/.+\.vercel\.app$/.test(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options(/.*/, cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Models
const StatsSchema = new mongoose.Schema({
  totalProjects: Number,
  yearsOfExperience: Number,
  skillsCount: Number,
});
const Stats = mongoose.model("Stats", StatsSchema);

const ProjectSchema = new mongoose.Schema({
  title: String,
  tech: [String],
  github: String,
  deployed: String,
  description: String,
});
const Project = mongoose.model("Project", ProjectSchema);

const ActivitySchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
});
const Activity = mongoose.model("Activity", ActivitySchema);

const SkillSchema = new mongoose.Schema({
  name: String,
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"] },
});
const Skill = mongoose.model("Skill", SkillSchema);

// Seed once
async function seed() {
  const statsCount = await Stats.countDocuments();
  if (!statsCount) {
    await Stats.create({
      totalProjects: 12,
      yearsOfExperience: 5,
      skillsCount: 18,
    });
  }

  const projectsCount = await Project.countDocuments();
  if (!projectsCount) {
    await Project.create([
      {
        title: "Social Content Hub",
        tech: ["Webpack", "Module Federation", "Node", "MongoDB"],
        github: "https://github.com/you/social-hub",
        deployed: "https://social-hub.yoursite.com",
        description: "Micro‑frontend social app.",
      },
      {
        title: "Portfolio Dashboard",
        tech: ["Webpack", "Node", "MongoDB", "Vanilla JS"],
        github: "https://github.com/you/portfolio-dashboard",
        deployed: "https://portfolio.yoursite.com",
        description: "Your portfolio dashboard.",
      },
    ]);
  }

  const activityCount = await Activity.countDocuments();
  if (!activityCount) {
    await Activity.create([
      { text: "Started Portfolio Dashboard project" },
      { text: "Published blog on micro‑frontends" },
      { text: "Pushed Social Content Hub to GitHub" },
    ]);
  }

  const skillsCount = await Skill.countDocuments();
  if (!skillsCount) {
    await Skill.create([
      { name: "JavaScript", level: "Expert" },
      { name: "React", level: "Advanced" },
      { name: "Vue", level: "Intermediate" },
      { name: "Node.js", level: "Advanced" },
      { name: "Webpack", level: "Advanced" },
      { name: "MongoDB", level: "Intermediate" },
    ]);
  }
}
seed();

// Routes
app.get("/api/stats", async (_, res) => {
  const data = await Stats.findOne();
  res.json(data || {});
});

app.get("/api/projects", async (_, res) => {
  const data = await Project.find();
  res.json(data);
});

app.get("/api/activities", async (_, res) => {
  const data = await Activity.find().sort("-date").limit(10);
  res.json(data);
});

app.get("/api/skills", async (_, res) => {
  const data = await Skill.find();
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

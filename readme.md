# Vanilla JS + Webpack micro‑frontends
1. backend is Node.js + Express + MongoDB
2. frontend stays micro‑frontends without a framework (pure JS + Webpack + Module Federation).

## 1. Final stack
### Frontend:
- container → dashboard shell (vanilla JS + Webpack + Module Federation).
- micro-stats → stats widget (micro‑frontend).
- micro-activity → activity list (micro‑frontend).

### Backend:
- Node.js + Express, MongoDB (via mongoose)

---

## 2. Folder structure
mkdir portfolio-dashboard
cd portfolio-dashboard
mkdir container micro-stats micro-projects micro-activity micro-skills backend

```bash
dashboard-mern-vanilla/
├── container/          # host dashboard (vanilla JS + Webpack)
├── micro-stats/        # micro‑frontend stats widget
├── micro-activity/     # micro‑frontend activity list
└── backend/            # Node.js + Express + MongoDB
```
---

## 3. Backend – Node.js + Express + MongoDB
```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv
cp .env.example .env
```
backend/.env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialhub
NODE_ENV=development
```

backend/server.js
```js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Models
const StatsSchema = new mongoose.Schema({
  users: { type: Number, default: 0 },
  posts: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});
const Stats = mongoose.model("Stats", StatsSchema);

const ActivitySchema = new mongoose.Schema({
  userId: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
});
const Activity = mongoose.model("Activity", ActivitySchema);

// Seed initial data (once)
async function seedData() {
  const exists = await Stats.countDocuments();
  if (!exists) {
    await Stats.create({
      users: 1235,
      posts: 872,
      likes: 94193,
    });
  }
}
seedData();

// API routes
app.get("/api/stats", async (req, res) => {
  const data = await Stats.findOne();
  res.json(data || {});
});

app.post("/api/stats", async (req, res) => {
  const { users, posts, likes } = req.body;
  const data = await Stats.findOne();
  if (data) {
    data.users = users ?? data.users;
    data.posts = posts ?? data.posts;
    data.likes = likes ?? data.likes;
    await data.save();
  }
  res.json(data);
});

app.get("/api/activities", async (req, res) => {
  const data = await Activity.find().sort("-timestamp").limit(20);
  res.json(data);
});

app.post("/api/activities", async (req, res) => {
  const { userId, action } = req.body;
  const doc = await Activity.create({ userId, action });
  res.json(doc);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend (Node + Express + MongoDB) running on http://localhost:${PORT}`);
});
```

This is a simple CRUD‑style backend for your dashboard.

---

## 4. Micro‑frontend 1: micro-stats ↔ Node API
Update micro-stats/src/StatsWidget.js to use Node + MongoDB:

```js
// src/StatsWidget.js
export async function renderStatsWidget(containerEl) {
  const API = "http://localhost:5000/api";

  try {
    const res = await fetch(`${API}/stats`);
    const data = await res.json();

    const html = `
      <div class="stats-widget">
        <h2>Stats</h2>
        <ul>
          <li>Users: <strong>${data.users}</strong></li>
          <li>Posts: <strong>${data.posts}</strong></li>
          <li>Likes: <strong>${data.likes}</strong></li>
        </ul>
        <button class="refresh-btn">Refresh</button>
      </div>
    `;

    containerEl.innerHTML = html;

    containerEl.querySelector(".refresh-btn").addEventListener("click", async () => {
      try {
        const res = await fetch(`${API}/stats`);
        const data = await res.json();
        renderStatsWidget(containerEl);
      } catch (err) {
        containerEl.innerHTML = "<div>Failed to refresh</div>";
      }
    });
  } catch (err) {
    containerEl.innerHTML = "<div>Failed to load stats</div>";
  }
}
```
Now micro-stats reads stats from MongoDB via Node API.

## 5. Micro‑frontend 2: micro-activity (activity list)
Same pattern:
micro-activity/webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3002,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "auto",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new ModuleFederationPlugin({
      name: "activity",
      filename: "remoteEntry.js",
      exposes: {
        "./ActivityWidget": "./src/ActivityWidget",
      },
      shared: {},
    }),
  ],
};
```

micro-activity/src/ActivityWidget.js
```js
export async function renderActivityWidget(containerEl) {
  const API = "http://localhost:5000/api";

  try {
    const res = await fetch(`${API}/activities`);
    const activities = await res.json();

    const html = `
      <div class="activity-widget">
        <h2>Recent Activity</h2>
        <ul>
          ${activities.map(
            (a) =>
              `<li>
                <strong>${a.userId}</strong> → ${a.action} (${new Date(
                a.timestamp
              ).toLocaleString()})
              </li>`
          ).join("")}
        </ul>
      </div>
    `;

    containerEl.innerHTML = html;
  } catch (err) {
    containerEl.innerHTML = "<div>Failed to load activity</div>";
  }
}
```
You can later add a button to create an activity (POST /api/activities).

## 6. container – Micro‑frontend dashboard shell
Same structure as before, but now:
container pulls:
micro-stats@3001
micro-activity@3002

container/webpack.config.js (updated)

```js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "auto",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        stats: "stats@http://localhost:3001/remoteEntry.js",
        activity: "activity@http://localhost:3002/remoteEntry.js",
      },
      shared: {},
    }),
  ],
};
```

container/src/index.js
```js
async function loadStats() {
  const module = await import("stats/StatsWidget");
  const { renderStatsWidget } = module;
  const el = document.getElementById("stats-widget");
  if (el) renderStatsWidget(el);
}

async function loadActivity() {
  const module = await import("activity/ActivityWidget");
  const { renderActivityWidget } = module;
  const el = document.getElementById("activity-widget");
  if (el) renderActivityWidget(el);
}

function renderApp() {
  const main = document.querySelector(".app-main");
  main.innerHTML = `
    <div id="stats-widget"></div>
    <div id="activity-widget"></div>
  `;

  loadStats();
  loadActivity();
}

document.addEventListener("DOMContentLoaded", renderApp);
```

Now you have:

### Frontend:
container + micro-stats + micro-activity (micro‑frontends).

### Backend:
Node.js + Express + MongoDB (API + MongoDB models).


## 7. Portfolio‑ready full‑stack micro‑frontend dashboard
You can now present this as:

“Micro‑frontend dashboard with Node.js + Express + MongoDB backend, no framework on frontend.”

### Key features:
Each micro‑frontend talks to its own Node API endpoints.
Module Federation wires them together in container.

#### MongoDB stores:
- Stats
- Activity

You can later add authentication, user‑specific data, or charts.
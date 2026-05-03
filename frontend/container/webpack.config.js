const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const env = process.env;
const isProd = env.NODE_ENV === "production";
const apiBaseUrl = env.API_BASE_URL || "http://localhost:5000/api";
const remote = (name, localPort, envKey) => {
  const base = isProd ? env[envKey] : `http://localhost:${localPort}`;
  if (!base) {
    throw new Error(
      `Missing ${envKey}. Set it to the deployed URL for '${name}', e.g. https://<app>.vercel.app`
    );
  }
  return `${name}@${base.replace(/\/$/, "")}/remoteEntry.js`;
};

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    path: path.resolve(__dirname, "..", ".dist", "container"),
    publicPath: "auto",
  },
  plugins: [
    new webpack.DefinePlugin({
      __API_BASE_URL__: JSON.stringify(apiBaseUrl),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "./src/styles.css", to: "styles.css" }],
    }),
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        activity: remote("activity", 3001, "REMOTE_ACTIVITY_URL"),
        projects: remote("projects", 3002, "REMOTE_PROJECTS_URL"),
        skills: remote("skills", 3003, "REMOTE_SKILLS_URL"),
        stats: remote("stats", 3004, "REMOTE_STATS_URL"),
      },
      shared: {},
    }),
  ],
};

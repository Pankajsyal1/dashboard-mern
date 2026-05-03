const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
        activity: "activity@http://localhost:3001/remoteEntry.js",
        projects: "projects@http://localhost:3002/remoteEntry.js",
        skills: "skills@http://localhost:3003/remoteEntry.js",
        stats: "stats@http://localhost:3004/remoteEntry.js",
      },
      shared: {},
    }),
  ],
};
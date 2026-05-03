const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3004,
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
      name: "stats",
      filename: "remoteEntry.js",
      exposes: {
        "./StatsWidget": "./src/StatsWidget",
      },
      shared: {},
    }),
  ],
};
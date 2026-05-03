const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3001,
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
      filename: "remoteEntry.js",  // must match URL
      exposes: {
        "./ActivityWidget": "./src/ActivityWidget",
      },
      shared: {},
    }),
  ],
};
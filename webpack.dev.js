const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    host: "localhost",
    compress: true,
    port: 9000,
    hot: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});

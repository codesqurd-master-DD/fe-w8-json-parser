var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var compiler = webpack(webpackConfig);
const express = require('express');
const app = express();

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath, //
  })
);

const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

app.listen(PORT, console.log('run server!'));

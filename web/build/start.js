const path = require('path');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const getDevConfig = require('./webpack.dev.config');
const argv = require('yargs').argv;
const pkg = require('../package.json');

const port = pkg.port || 4000;

const options = {
  contentBase: path.join(__dirname, '../dist'),
  host: '0.0.0.0',
  stats: { colors: true },
  hot: true,
  noInfo: false,
  historyApiFallback: true,
};

const webpackConfig = getDevConfig({ env: 'development' });

webpackDevServer.addDevServerEntrypoints(webpackConfig, options);

const compiler = webpack(webpackConfig);
const server = new webpackDevServer(compiler, options);

server.listen(port, '0.0.0.0', function(err) {
  if (err) {
    console.error(err);
  }
  console.log('\n-------------\n');
  console.log(`http://127.0.0.1:${port}/`);
});

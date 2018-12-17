const webpack = require('webpack');
const getProdConfig = require('./webpack.prod.config');
const { validProject } = require('./utils');
const argv = require('yargs').argv;

async function build() {
  return new Promise(async (resolve, reject) => {
    const env = argv.env || process.env.NODE_ENV || 'production';

    const webpackConfig = getProdConfig({ env });

    webpack(webpackConfig, (err, stats) => {
      process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: true,
          chunkModules: false,
        }) + '\n\n'
      );
      if (err) {
        console.log(err);
        reject(err);
      }
      return resolve();
    });
  });
}

return build().then(() => {});

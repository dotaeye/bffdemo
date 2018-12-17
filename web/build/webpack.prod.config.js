const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const getBaseConfig = require('./webpack.base.config');
const TerserPlugin = require('terser-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

function getProdConfig({ env }) {
  const webpackBaseConfig = getBaseConfig({ env });

  return webpackMerge(webpackBaseConfig, {
    mode: 'production',

    devtool: false,

    performance: {
      hints: 'warning',
      maxAssetSize: 300000, //单文件超过250k，命令行告警
      maxEntrypointSize: 300000, //首次加载文件总和超过250k，命令行告警
    },

    optimization: {
      minimizer: [
        new TerserPlugin(),
        // new OptimizeCSSAssetsPlugin()
      ],
      noEmitOnErrors: true,
    },

    plugins: [
      // new BundleAnalyzerPlugin(),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('../dist/lib/react-manifest.json'),
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('../dist/lib/common-manifest.json'),
      }),
      new HtmlWebpackIncludeAssetsPlugin({
        assets: [{ path: 'lib', glob: '*.dll.js', globPath: 'dist/lib/' }],
        append: false,
      }),
    ],
  });
}

module.exports = getProdConfig;

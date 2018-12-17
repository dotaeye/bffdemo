const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const { resolve } = require('./utils');

const devMode = process.env.NODE_ENV === 'development';

const getCssLoader = px2rem => {
  let cssLoader = [
    { loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader },
    { loader: 'css-loader' },
  ];
  if (px2rem) {
    cssLoader.push({
      loader: 'px2rem-loader',
      options: {
        remUnit: 37.5,
        remPrecision: 8,
      },
    });
  }
  cssLoader.push({
    loader: 'postcss-loader',
    options: {
      config: {
        path: path.join(__dirname, './build/postcss.config.js'),
      },
    },
  });
  return cssLoader;
};

function getPublicPath(env) {
  return '/';
}

//, isCDN = 'no'
function getCommonConfig({ env }) {
  const cssLoader = getCssLoader(false);
  const lessLoader = cssLoader.concat({
    loader: 'less-loader',
    options: {
      modifyVars: {
        'primary-color': '#10AEAF',
        'link-color': '#10AEAF',
        'border-radius-base': '2px',
      },
      javascriptEnabled: true,
    },
  });
  return {
    entry: {
      app: `./src/index.js`,
    },

    output: {
      path: resolve('dist/'),
      publicPath: getPublicPath(env),
      filename: `js/[name].[hash:4].js`,
      chunkFilename: `js/[name].chunk.js`,
    },

    resolve: {
      alias: {
        '@': resolve('src'),
      },
      extensions: ['*', '.js', '.jsx'],
    },

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|jsx)$/,
          include: resolve('src'),
          exclude: resolve('node_modules'),
          loader: 'eslint-loader',
        },
        {
          test: /\.(js|jsx)$/,
          include: [resolve('src')],
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          include: [
            resolve('src'),
            resolve('node_modules/normalize.css'),
            resolve('node_modules/antd'),
            resolve('node_modules/medium-editor'),
          ],
          use: cssLoader,
        },
        {
          test: /\.less$/,
          include: [resolve('src'), resolve('node_modules/antd')],
          use: lessLoader,
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: `img/[name].[hash:4].[ext]`,
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            limit: 8192,
            name: `img/[name].[hash:4].[ext]`,
          },
        },
        {
          test: /\.(ogg|mp3|wav|mpe?g)$/i,
          loader: 'file-loader',
          options: {
            name: `img/[name].[hash:4].[ext]`,
          },
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(['dist/css', 'dist/js'], {
        root: path.resolve(__dirname, '..'),
      }),
      new MiniCssExtractPlugin({
        filename: `css/[name].[hash:4].css`,
        chunkFilename: `css/[id].[hash:4].css`,
      }),
      // new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new HtmlWebpackPlugin({
        filename: `index.html`,
        template: `src/index.html`,
      }),
      // new LodashModuleReplacementPlugin()
    ],
  };
}

module.exports = getCommonConfig;

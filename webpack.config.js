const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const package = require('./package.json');
const NODE_ENV = process.env.NODE_ENV || 'development';
const PACKAGE_VERSION = package.version;
const PACKAGE_TITLE = package.name;
const DEV_SERVER_IP = '0.0.0.0';
const DEV_SERVER_PORT = 8080;

//Clean up output directory
const CleanPlugin = require('clean-webpack-plugin');
//JavaScript Minifier (UglifyJS is no longer maintained)
const TerserPlugin = require('terser-webpack-plugin');
//Copy file and output it
const CopyPlugin = require('copy-webpack-plugin');
//Gather all generated assets
const ServiceWorkerPlugin = require('serviceworker-webpack-plugin');
//Generate html with dynamic assets
const HtmlPlugin = require('html-webpack-plugin');
//Save generated html as file
const HtmlHardDiskPlugin = require('html-webpack-harddisk-plugin');

const GLOBAL_VARS = {
  'process.env.VERSION': JSON.stringify(PACKAGE_VERSION),
  'process.env.TITLE': JSON.stringify(PACKAGE_TITLE),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
};
const OUTPUT_DIR = "dist";
const ALIAS = {
  '@res': './res'
};
const MODULE_PATHS = [
  //For webpack HMR dev server
  'webpack-dev-server/client?http://' + DEV_SERVER_IP + ':' + DEV_SERVER_PORT,
  'webpack/hot/only-dev-server',//HMR, but does NOT reload on error
  //'webpack/hot/dev-server'//HMR, but reloads on error
  //The used entrypoints
  './node_modules',
  './src/app'
];
const ENTRIES = {
  app: './src/app/index.js'
};

const config = {
  //Change this to force 'production' for optimizations (same as --mode production)
  mode: NODE_ENV,
  //Entry point to start bundling
  entry: ENTRIES,
  //Root directory of the build
  context: process.cwd(),
  //Target platform
  target: 'web',
  output: {
    //Output to ./OUTPUT/bundle.js
    path: path.resolve(__dirname, './' + OUTPUT_DIR),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: OUTPUT_DIR + '/'
  },
  module: {
    rules: [
      {
        //Load js and jsx
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'react-hot-loader/webpack' }
        ]
      },
      {
        //Load css
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },//, options: {sourceMap: true}},
          { loader: 'css-loader', options: { importLoaders: 1, modules: 'global', localIdentName: "[path][name]__[local]--[hash:base64:5]" } }
        ]
      }
    ]
  },
  resolve: {
    //Resolve by filename without extensions
    extensions: ['*', '.js', '.jsx', '.mjs'],
    //Resolve by aliases
    alias: ALIAS,
    //Resolve by absolute path
    modules: MODULE_PATHS
  },
  //Allows access to filename from context dir
  node: { __filename: true },
  //Don't include xmlhttprequest in bundle
  externals: [{ xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}' }],
  plugins: [
    new CopyPlugin([
      //Copy resource by directory...
      { from: './res/document', to: 'document' },
      { from: './res/image', to: 'image' },
      { from: './res/lang', to: 'lang' },
      { from: './res/script', to: 'script' },
      { from: './res/style', to: 'style' },
      { from: './res/theme', to: 'theme' },
      //Copy remaining resources...
      //NOTE: any files added here should also be added to CleanWebpackPlugin
      { from: './res/404.html', to: '../404.html' }
    ]),
    new ServiceWorkerPlugin({
      filename: '../serviceWorker.js',
      entry: path.join(__dirname, './res/ServiceWorker.js'),
      publicPath: './' + OUTPUT_DIR + '/',
      excludes: ['**/.*', '**/*.map', '**/document/**', '**/image/**', '**/lang/**', '**/script/**', '**/style/**'],
      transformOptions: serviceWorkerOption =>
      {
        return {
          assets: serviceWorkerOption.assets,
          hash: Math.random().toString(36).substr(2, 9)
        };
      }
    }),
    new HtmlPlugin({
      filename: '../index.html',
      template: './res/index.html',
      alwaysWriteToDisk: true
    }),
    new HtmlHardDiskPlugin(),
    new webpack.DefinePlugin(GLOBAL_VARS)
  ]
};

module.exports = (env, argv) =>
{
  if (argv.mode === 'development')
  {
    //Do development stuff...
    //config.devtool = 'eval-source-map';
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    //Webpack server options
    config.devServer = {
      contentBase: path.join(__dirname, '/'),//public/
      //This stops serviceWorker in dev mode since its no longer https
      //disableHostCheck: true,
      host: DEV_SERVER_IP,
      port: DEV_SERVER_PORT,
      overlay: true,
      hot: true,
      open: true
    };
  }
  else if (argv.mode === 'production')
  {
    //Do production stuff...
    //config.devtool = 'inline-source-map';
    config.output.filename = '[name].bundle.[chunkhash].js';
    config.output.chunkFilename = '[name].bundle.[chunkhash].js',
      config.plugins.push(new webpack.SourceMapDevToolPlugin({
        filename: 'sourcemap/[name].bundle.js.map',
        exclude: [/vendors\.bundle.*\.js$/, '../serviceWorker.js']
      }));
    config.plugins.push(new CleanPlugin({
      cleanOnceBeforeBuildPatterns: ['../dist', '../serviceWorker.js', '../404.html', '../index.html'],
      dangerouslyAllowCleanPatternsOutsideProject: true,
      dry: false
    }));

    //Optimizations
    config.optimization = {
      minimizer: [new TerserPlugin({ parallel: true, cache: true, sourceMap: true })],
      runtimeChunk: { name: entrypoint => 'runtime~' + entrypoint.name },
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true
            //minChunks: 2
          },
          styles: {
            test: /\.css$/,
            name: 'styles',
            chunks: 'all',
            enforce: true
          }
        }
      }
    };
  }

  return config;
};

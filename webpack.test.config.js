const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const nodeExternals = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeExternals[mod] = 'commonjs ' + mod;
  });

module.exports = {
  //Entry point to start bundling...
  entry: './src/debug/Tester.js',
  mode: 'development',
  output: {
    //Output to ./dist/debug/bundle.js
    path: path.resolve(__dirname, 'docs/debug'),
    filename: 'bundle.js'
  },
  target: 'node',
  resolve: {
    //Resolve by filename without extensions
    extensions: ['*', '.js', '.mjs'],
    //Resolve by absolute path
    modules: [
      'node_modules',
      path.resolve('./docs'),
      path.resolve('./src/app'),
      path.resolve('./src/debug')
    ]
  },
  //Make sure to not bundle node_modules
  externals: nodeExternals
};

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

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
  target: 'node',
  resolve: {
    //Resolve by filename without extensions
    extensions: ['*', '.js', '.mjs'],
    //Resolve by absolute path
    modules: [
      path.resolve('./src'),
      'node_modules'
    ]
  },
  output: {
    //Output to ./dist/debug/bundle.js
    path: path.resolve(__dirname, 'dist/debug'),
    filename: 'bundle.js'
  },
  //Make sure to not bundle node_modules
  externals: nodeExternals
};

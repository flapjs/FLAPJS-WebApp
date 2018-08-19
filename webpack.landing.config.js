const path = require('path');
const webpack = require('webpack');

module.exports = {
  //Change this to 'production' for optimizations
  mode: 'development',
  //Entry point to start bundling...
  entry: {
    landing: './src/landing/index.js'
  },
  output: {
    //Output to ./docs/bundle.js
    path: path.resolve(__dirname, 'docs'),
    filename: 'src/[name].bundle.js',
    publicPath: 'docs/',
  },
  module: {
    rules: [
      {
        //Load js and jsx
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: ['env'] }
      },
      {
        //Load css
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test:  /\.(jpg|png|gif|svg|pdf|ico)$/,
        use: [ 'file-loader?name=images/[name].[ext]' ]
      }
    ]
  },
  resolve: {
    //Resolve by filename without extensions
    extensions: ['*', '.js', '.jsx', '.mjs'],
    //Resolve by absolute path
    modules: [
      'node_modules',
      path.resolve('./docs'),
      path.resolve('./src/landing'),
    ]
  },
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, '/'),//public/
    port: 3000,
    index: 'index.html',
    hotOnly: true,
    open: true
  },
  plugins: [ new webpack.HotModuleReplacementPlugin() ]
};

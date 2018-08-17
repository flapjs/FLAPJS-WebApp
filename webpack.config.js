const path = require('path');
const webpack = require('webpack');
//const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  //Entry point to start bundling...
  entry: './src/app/index.js',
  //Change this to 'production' for optimizations
  mode: "development",
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
        use: [ 'file-loader?name=/images/[name].[ext]' ]
      }
    ]
  },
  resolve: {
    //Resolve by filename without extensions
    extensions: ['*', '.js', '.jsx', '.mjs'],
    //Resolve by absolute path
    modules: [
      path.resolve('./src/app'),
      path.resolve('./dist'),
      'node_modules'
    ]
  },
  /*
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
        }
      }
    }
  },
  */
  output: {
    //Output to ./dist/bundle.js
    path: path.resolve(__dirname, 'dist'),
    filename: 'src/app.bundle.js',
    //For devServer to find directory from project root
    publicPath: 'dist/'
  },
  devServer: {
    historyApiFallback: {
      index: 'app.html',
      rewrites: [{ from: /list\/*/, to: 'app.html' }]
    },
    contentBase: path.join(__dirname, '/'),//public/
    index: 'app.html',
    port: 3000,
    //For devServer to find directory from web user
    publicPath: 'http://localhost:3000/dist/',
    hotOnly: true,
    open: true
  },
  plugins: [
    /*
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    */
    new webpack.HotModuleReplacementPlugin()
  ]
};

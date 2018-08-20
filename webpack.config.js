const path = require('path');
const webpack = require('webpack');

module.exports = {
  //Change this to 'production' for optimizations
  mode: 'development',
  //Entry point to start bundling...
  entry: {
    app: './src/app/index.js',
    landing: './src/landing/index.js'
  },
  output: {
    //Output to ./dist/bundle.js
    path: path.resolve(__dirname, 'dist'),
    filename: 'src/[name].bundle.js',
    publicPath: 'dist/',
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
      path.resolve('./dist'),
      path.resolve('./src/app'),
      path.resolve('./src/landing'),
    ]
  },
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, '/'),//public/
    port: 3000,
    hotOnly: true,
    open: true
  },
  optimization: {
    runtimeChunk: 'multiple',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all'
        }
      }
    }
  },
  plugins: [ new webpack.HotModuleReplacementPlugin() ]
};

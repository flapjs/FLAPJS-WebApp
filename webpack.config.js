const path = require("path");
const webpack = require("webpack");

module.exports = {
  //Change this to 'production' for optimizations
  mode: "development",
  //Entry point to start bundling...
  entry: {
    app: './src/app/index.js'
  },
  output: {
    //Output to ./dist/bundle.js
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
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
    ]
  },
  target: "web",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),//public/
    host: '0.0.0.0',
    port: 3000,
    index: 'app.html',
    hotOnly: true,
    open: true
  },
  plugins: [ new webpack.HotModuleReplacementPlugin() ]
};

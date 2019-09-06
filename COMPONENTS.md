# Flap.js Components
Here lies the components that form the foundation of Flap.js.

# Getting Started

# Setup
We are building a web page. So here is our entry point for our clients.

```bash
mkdir dist
touch dist/index.html
```

index.html
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>App</title>
    </head>
    <body>
        <h1>Hello</h1>
    </body>
</html>
```

NOTE: Since index.html should be served to the public, it should be in the dist directory. Any other source files we will write for the app will be placed in the src directory. Further explanation of why we enforce this separation is explained below.

We use git for version control. This way, nothing gets lost.

```bash
git init
```

We use npm to handle package dependencies.

```bash
npm init
```

NOTE: npm will generate a directory `node_modules`, `package.json`, and `package-lock.json` (later). However, node_modules should NOT be pushed remotely since it is usually specific to your machine. Therefore add `/node_modules/` to your `.gitignore` to satisfy this.

We also use Webpack to bundle our many project scripts into manageable files. This will take all the files from the src directory, transform and bundle them, and output the result into the dist directory, next to the `index.html`.

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server
```

webpack-cli let's us use webpack from the command line interface.
webpack-dev-server is a hot-loading development environment that can instantly relay changes from your code to the browser. It shortens the build cycle when debugging code.

Although webpack is built to work out-of-the-box, we want to configure some useful options for the project. Therefore, we need to create a config file for webpack.

```bash
touch webpack.config.js
```

webpack.config.js
```javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true,
        hotOnly: true,
        open: true,
        overlay: true,
        contentBase: './dist',
        port: 8008,
    }
};
```

Now we need React. This is a component UI library that enables us to structure our components in a manner that is easy to read and understand. (It is also because of legacy code.)

```bash
npm install --save react react-dom react-hot-loader
```

We now need a React entry point to start rendering our app.

```bash
touch src/main.js
touch src/App.jsx
```

index.html
```html
<!-- ... -->
<body>
    <div id="app"></div>
    
    <!-- This should be after all other elements. -->
    <script src="./app.bundle.js"></script>
</body>
<!-- ... -->
```

NOTE: Webpack will bundle React into our App file, causing a lot of bloat. We can exclude React and instead include it separately in our `index.html` through a `<script>` tag. We can resolve it like this:

index.html
```html
<!-- ... -->
<body>
    <!-- ... -->

    <!-- The order here does matter. -->
    <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>

    <!-- It should come before the app script. -->
    <script src="./app.bundle.js"></script>
</body>
<!-- ... -->
```

webpack.config.js
```javascript
//...
module.exports = {
    //...
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    //...
};
```

In order to use certain features, particularly jsx, we would also need Babel. In addition, it also let's us transpile our code, which is in ES6, to older versions, such as ES5 in order to support older browsers.

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-react
```

To set Babel up, we also need an additional config file for it.

```bash
touch .babelrc
```

.babelrc
```json
{
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react"
    ]
}
```

And Webpack needs to know about it.

webpack.config.js
```javascript
//...
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    //...
}
```

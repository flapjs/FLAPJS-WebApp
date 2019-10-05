/* eslint-env node */

const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const package = require('../package.json');

// This is our custom webpack plugin to handle inlining.
const HtmlWebpackInlineSourceOnlyPlugin = require('../tools/html-webpack-inline-source-only-plugin/index.js');
// This is our custom webpack plugin to handle defer/async bundled scripts.
const HtmlWebpackScriptAttributesPlugin = require('../tools/html-webpack-script-attributes-plugin/index.js');

const HTML_PAGE_TITLE = 'Flap.js';

module.exports = {
    entry: {
        /** Add entrypoints here for different modules. */
        'app.bundle': './src/main.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
        alias: {
            /** Add any aliases that need to be resolved by webpack here. Refer to eslint and jest config as well. */
            '@flapjs': path.resolve('.', 'src'),
        }
    },
    output: {
        // NOTE: This should be __dirname, but then all webpack
        // config files would need to be at the root directory.
        // For now, '.' will resolve from execution directory,
        // which the first webpack.config.js is at the root.
        path: path.resolve('.', 'build'),
        publicPath: '/',
        filename: '[name].js',
    },
    module: {
        rules: [
            /** Add loaders here for different file types. */
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    emitWarning: true,
                    configFile: './.eslintrc.js'
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader' }
                ]
            },
            /** This is to auto-bundle svg to React components. */
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                    }
                ]
            },
            /** This is to load asset files into chunks while bundling. */
            {
                test: /\.(png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            /** This is to bundle LOCAL css module files (these gotta match in 'development.config.js'). */
            {
                test: /\.module\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader',
                        options: {
                            // NOTE: This would transform any names from dash-case to camelCase,
                            // which would allow you to write dash-case in CSS files and
                            // camelCase in JavaScript. However, this would be an issue for
                            // Jest, which needs to revert the transformation in order to
                            // test it, which, due to ambiguity, is impossible. Therefore,
                            // we don't use it.
                            // localsConvention: 'dashes',
                            importLoaders: 2,
                            modules: {
                                // This is the generated CSS name... perhaps it doesn't need to be this long?
                                localIdentName: '[path]__[name]__[local]--[hash:base64:5]'
                            },
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            /** This is to bundle GLOBAL css files (these gotta match in 'development.config.js'). */
            {
                test: /^((?!\.module).)*\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader',
                        // NOTE: We got rid of CSS modules for this loader, because this is a
                        // global CSS file which does not need any transformations.
                        options: {
                            importLoaders: 2,
                            modules: {
                                localIdentName: '[local]'
                            },
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
        ]
    },
    plugins: [
        /** This NEEDS to be FIRST. Storybook's webpack config file depends on it. */
        new HtmlWebpackPlugin({
            template: './src/assets/template.html',
            cache: false,
            // NOTE: This is used nowhere, since we override it in the template.
            // But we have it here anyways since the expected use case is to define
            // it here. So it's really just in case someone references it unknowingly.
            title: HTML_PAGE_TITLE,
        }),
        /** This NEEDS to be SECOND. Storybook's webpack config file depends on it. */
        new HtmlWebpackInlineSourceOnlyPlugin(HtmlWebpackPlugin),
        /** This NEEDS to be THIRD. Storybook's webpack config file depends on it. */
        new HtmlWebpackScriptAttributesPlugin(HtmlWebpackPlugin, {
            defaultAttributes: { 'defer': true }
        }),
        new CopyWebpackPlugin([
            { from: './src/assets/metadata/' },
            { from: './src/assets/images/', to: 'images' },
            { from: './src/assets/langs/', to: 'langs' }
        ]),
        new WorkboxWebpackPlugin.InjectManifest({
            swSrc: './src/assets/scripts/ServiceWorker.js',
            swDest: 'service-worker.js'
        }),
        new MiniCssExtractPlugin({
            moduleFilename: ({ name }) => `${name.replace('/js/', '/css/')}.css`
        }),
        new DefinePlugin({
            __VERSION__: `"${package.version}"`
        }),
    ]
};

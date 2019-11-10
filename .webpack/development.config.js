/* eslint-env node */

const merge = require('webpack-merge');
const base = require('./base.config.js');

const { HotModuleReplacementPlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge.smart(base, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            /** Add loaders here for different file types. */
            {
                test: /\.module\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { hmr: true }
                    }
                ]
            },
            {
                test: /^((?!\.module).)*\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { hmr: true }
                    }
                ]
            },
        ]
    },
    plugins: [
        new HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true,
        open: true,
        overlay: true,
        contentBase: './build',
        port: 8004,
        https: true,
    },
});

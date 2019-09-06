/* eslint-env node */

const merge = require('webpack-merge');
const base = require('./base.config.js');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge.smart(base, {
    mode: 'production',
    externals: {
        /** Add libraries here that are included externally (such as a <script> tag) */
        'react': 'React',
        'react-dom': 'ReactDOM',
        'prop-types': 'PropTypes'
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
});

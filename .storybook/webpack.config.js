/* eslint-env node */

const base = require('../.webpack/development.config.js');

/**
 * These entries should never change:
 * - config.entry
 * - config.output
 * These entries should be preserved, but can be added to:
 * - config.plugins
 * 
 * For more information, refer to here:
 * https://storybook.js.org/docs/configurations/custom-webpack-config/
 */
module.exports = async ({ config, mode }) => {
    // Replaces HTMLWebpackPlugin with the one defined by Storybook.
    // NOTE: Assumes HTMLWebpackPlugin will be FIRST in the plugins array for the config file.
    base.plugins[0] = config.plugins[0];

    // Because we wrote a custom webpack plugin (called HtmlWebpackInlineSourceOnlyPlugin) and it DEPENDS
    // on knowing the HtmlWebpackPlugin, we must change HtmlWebpackPlugin for our plugin here as well.
    // NOTE: Assumes HTMLWebpackInlineSourceOnlyPlugin will be SECOND in the plugins array for the config file.
    base.plugins[1].htmlWebpackPlugin = config.plugins[0].constructor;
    // Ditto for HTMLWebpackScriptAttributesPlugin...
    base.plugins[2].htmlWebpackPlugin = config.plugins[0].constructor;

    // Copy over the config...
    base.entry = config.entry;
    base.output = config.output;
    return base;
};

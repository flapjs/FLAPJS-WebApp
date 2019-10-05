/* eslint-env node */

// Usage: new HtmlWebpackScriptAttributesPlugin(HtmlWebpackPlugin);
// In order for this to work with HMR, cache must be turned off for `html-webpack-plugin`.
// But even then, you must refresh, as this currently does not support live reload.

const PLUGIN_NAME = 'html-webpack-script-attributes-plugin';

/**
 * This will look for <script> tags and append the specified attributes to them.
 * This should be loaded in the plugin list AFTER `html-webpack-plugin`.
 */
class HtmlWebpackScriptAttributesPlugin
{
    constructor(htmlWebpackPlugin, opts)
    {
        this.htmlWebpackPlugin = htmlWebpackPlugin;
        this.onAlterAssetTags = this.onAlterAssetTags.bind(this);

        this.opts = opts;

        // Normalize opts.defaultAttributes...
        if (!('defaultAttributes' in this.opts)) this.opts.defaultAttributes = {};
        if (Array.isArray(this.opts.defaultAttributes))
        {
            const result = {};
            for(const attribute of this.opts.defaultAttributes)
            {
                result[attribute] = true;
            }
            this.opts.defaultAttributes = result;
        }
    }

    apply(compiler)
    {
        // HtmlWebpackPlugin version 4.0.0-beta.8
        if (this.htmlWebpackPlugin.getHooks)
        {
            // Hook into html-webpack-plugin process...
            compiler.hooks.compilation.tap(PLUGIN_NAME, compilation =>
            {
                this.htmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
                    PLUGIN_NAME, this.onAlterAssetTags
                );
            });
        }
        // HtmlWebpackPlugin version 3.2.0
        else
        {
            compiler.plugin('compilation', compilation =>
            {
                compilation.plugin('html-webpack-plugin-alter-asset-tags',
                    this.onAlterAssetTags);
            });
        }
    }

    onAlterAssetTags(data, cb = null)
    {
        for(const headTag of data.head)
        {
            if (headTag.tagName === 'script')
            {
                this.applyAttributesToTagObject(headTag);
            }
        }

        for(const bodyTag of data.body)
        {
            if (bodyTag.tagName === 'script')
            {
                this.applyAttributesToTagObject(bodyTag);
            }
        }

        if (cb)
        {
            cb(null, data);
        }
    }

    applyAttributesToTagObject(tagObject)
    {
        for(const attribute of Object.keys(this.opts.defaultAttributes))
        {
            tagObject.attributes[attribute] = this.opts.defaultAttributes[attribute];
        }
    }
}

module.exports = HtmlWebpackScriptAttributesPlugin;

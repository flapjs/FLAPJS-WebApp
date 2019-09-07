/* eslint-env node */

const path = require('path');
const fs = require('fs');

// Usage: new HtmlWebpackInlineSourceOnlyPlugin(HtmlWebpackPlugin);
// In order for this to work with HMR, cache must be turned off for `html-webpack-plugin`.
// But even then, you must refresh, as this currently does not support live reload.

const PLUGIN_NAME = 'html-webpack-inline-source-only-plugin';

/**
 * This will look for <script> and <link> tags that have a `inline` attribute, followed by
 * `src` or `href` path. It will then find that file at the path, relative to the template
 * index file, and inline it at that position.
 * This should be loaded in the plugin list AFTER `html-webpack-plugin`.
 */
class HtmlWebpackInlineSourceOnlyPlugin
{
    constructor(htmlWebpackPlugin, opts)
    {
        this.htmlWebpackPlugin = htmlWebpackPlugin;
        this.onBeforeAssetTagGeneration = this.onBeforeAssetTagGeneration.bind(this);
    }

    apply(compiler)
    {
        // HtmlWebpackPlugin version 4.0.0-beta.8
        if (this.htmlWebpackPlugin.getHooks)
        {
            // Hook into html-webpack-plugin process...
            compiler.hooks.compilation.tap(PLUGIN_NAME, compilation =>
            {
                this.htmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
                    PLUGIN_NAME, this.onBeforeAssetTagGeneration
                );
            });
        }
        // HtmlWebpackPlugin version 3.2.0
        else
        {
            compiler.plugin('compilation', compilation =>
            {
                compilation.plugin('html-webpack-plugin-before-html-processing',
                    this.onBeforeAssetTagGeneration);
            });
        }
    }

    onBeforeAssetTagGeneration(data, cb = null)
    {
        let html = data.html;
        const templateDirectory = path.dirname(data.plugin.options.template.substring(data.plugin.options.template.indexOf('!') + 1));
        const inlineScriptPaths = this.findInlineFilePaths(html, this.getInlineScriptPattern());
        const inlineStylePaths = this.findInlineFilePaths(html, this.getInlineStylePattern());
        
        for(const inlineScriptPath of inlineScriptPaths)
        {
            const fileContent = fs.readFileSync(path.resolve(templateDirectory, inlineScriptPath));
            html = html.replace(this.getInlineScriptPattern(inlineScriptPath),
                `<script>\n${fileContent.toString()}</script>`);
        }

        for(const inlineStylePath of inlineStylePaths)
        {
            const fileContent = fs.readFileSync(path.resolve(templateDirectory, inlineStylePath));
            html = html.replace(this.getInlineStylePattern(inlineStylePath),
                `<style>\n${fileContent.toString()}</style>`);
        }

        data.html = html;

        if (cb)
        {
            cb(null, data);
        }
    }

    findInlineFilePaths(htmlString, inlinePattern)
    {
        const result = [];
        let matchResult = null;
        do
        {
            matchResult = inlinePattern.exec(htmlString);
            if (matchResult)
            {
                result.push(matchResult[1]);
            }
        } while (matchResult);
        return result;
    }

    getInlineScriptPattern(filepath = '(.*?)', flags = 'g')
    {
        return new RegExp(`<\\s*script\\s+inline(?:\\s+.*\\s+|\\s+)src\\s*=\\s*"${filepath}"[^>]*>.*?<\\s*\\/\\s*script>`, flags);
    }

    getInlineStylePattern(filepath = '(.*?)', flags = 'g')
    {
        return new RegExp(`<\\s*link\\s+inline(?:\\s+.*\\s+|\\s+)href\\s*=\\s*"${filepath}"[^>]*>`, flags);
    }
}

module.exports = HtmlWebpackInlineSourceOnlyPlugin;

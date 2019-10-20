import React from 'react';
import Logger from '@flapjs/util/Logger.js';

const LOGGER_TAG = 'ModuleManager';

class ModuleManager
{
    constructor(application, defaultModule = null)
    {
        this.application = application;
        this.defaultModule = defaultModule;
        this.currentModule = defaultModule;

        // The context is bound so it can be passed around as a callback...
        this.changeModule = this.changeModule.bind(this);
        this.renderModuleLayer = this.renderModuleLayer.bind(this);
    }

    async changeModule(nextModuleID, forceRender = true)
    {
        let nextModule;
        if (nextModuleID)
        {
            try
            {
                nextModule = await this.application.loadModuleByID(nextModuleID);
                if (!nextModule) throw new Error('Cannot load null module.');
            }
            catch(e)
            {
                Logger.error(LOGGER_TAG, 'Failed to load module.', e);
                return;
            }
        }
        else
        {
            nextModule = this.defaultModule;
        }

        if (this.currentModule)
        {
            this.currentModule = this.defaultModule;
        }

        if (forceRender)
        {
            // Render to terminated application state...
            this.application.render(true);
        }
        
        if (nextModule)
        {
            this.currentModule = nextModule;

            if (forceRender)
            {
                // Render to next application state...
                this.application.render();
            }
        }
        // Otherwise, it's already rendered correctly.
    }

    renderModuleLayer(layerID, layerProps = {}, nested = false)
    {
        const currentModule = this.currentModule;

        // NOTE: If it is nested, it must return 'children' in props, even if null.
        if (nested)
        {
            if (!('children' in layerProps)) throw new Error(`Cannot render nested module layer '${layerID}' without children in props.`);
            const { children, ...providerProps } = layerProps;

            if (!currentModule || !('renders' in currentModule) || !(layerID in currentModule.renders)) return children;
            return this.renderModuleProviders(currentModule.renders[layerID], providerProps, children);
        }
        else
        {
            if (!currentModule || !('renders' in currentModule)) return null;
    
            const renders = currentModule.renders;
            if (layerID in renders)
            {
                const renderLayer = renders[layerID];
                if (nested)
                {
                    if (!('children' in layerProps)) throw new Error(`Cannot render nested module layer '${layerID}' without children in props.`);
                    const { children, ...providerProps } = layerProps;
                    return this.renderModuleProviders(renderLayer, providerProps, children);
                }
                else
                {
                    if (Array.isArray(renderLayer))
                    {
                        const result = [];
                        for(const layer of renderLayer)
                        {
                            result.push(React.createElement(layer, layerProps));
                        }
        
                        if (result.length <= 1)
                        {
                            return result[0];
                        }
                        else
                        {
                            return result;
                        }
                    }
                    else
                    {
                        return React.createElement(renderLayer, layerProps);
                    }
                }
            }
    
            return null;
        }
    }

    renderModuleProviders(providers, providerProps, children)
    {
        if (Array.isArray(providers))
        {
            let result = null;
            for(let i = providers.length - 1; i >= 0; --i)
            {
                const provider = providers[i];

                if (result)
                {
                    result = React.createElement(provider, providerProps, result);
                }
                else
                {
                    result = React.createElement(provider, providerProps, children);
                }
            }
            return result || children;
        }
        else if (providers)
        {
            return React.createElement(providers, providerProps, children);
        }
        else
        {
            return children;
        }
    }

    getCurrentModule()
    {
        return this.currentModule;
    }
}

export default ModuleManager;

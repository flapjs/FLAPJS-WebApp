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

        if (this.currentModule) this.currentModule = this.defaultModule;
        
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
            const { children, ...componentProps } = layerProps;

            if (!currentModule || !('renders' in currentModule) || !(layerID in currentModule.renders)) return children;
            return ModuleManager.renderNestedComponentEntries(currentModule.renders[layerID], componentProps, children);
        }
        else
        {
            if (!currentModule || !('renders' in currentModule)) return null;
    
            const renders = currentModule.renders;
            if (layerID in renders)
            {
                const renderLayer = renders[layerID];
                return ModuleManager.renderComponentEntries(renderLayer, layerProps);
            }
    
            return null;
        }
    }

    static renderComponentEntry(componentEntry, componentProps, children = undefined)
    {
        // Render entries: { component: ComponentClass, props: {...} }
        if (typeof componentEntry === 'object')
        {
            return React.createElement(componentEntry.component, {
                ...componentProps,
                ...componentEntry.props
            }, children);
        }
        // Render entries: ComponentClass
        else if (typeof componentEntry === 'function')
        {
            return React.createElement(componentEntry, componentProps, children);
        }
        // Render entries: null / undefined
        else
        {
            return null;
        }
    }

    static renderComponentEntries(componentClasses, componentProps = {})
    {
        if (Array.isArray(componentClasses))
        {
            const result = [];
            const length = componentClasses.length;
            for(let i = 0; i < length; ++i)
            {
                const component = componentClasses[i];
                const element = ModuleManager.renderComponentEntry(component, {
                    key: i + ':' + component.name,
                    ...componentProps
                });
                if (element)
                {
                    result.push(element);
                }
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
        else if (componentClasses)
        {
            return ModuleManager.renderComponentEntry(componentClasses, componentProps);
        }
        else
        {
            return null;
        }
    }

    static renderNestedComponentEntries(componentClasses, componentProps, children)
    {
        if (Array.isArray(componentClasses))
        {
            let result = null;
            for(let i = componentClasses.length - 1; i >= 0; --i)
            {
                const componentClass = componentClasses[i];
                result = ModuleManager.renderComponentEntry(componentClass, componentProps, result || children);
            }
            return result || children;
        }
        else if (typeof componentClasses === 'function')
        {
            return ModuleManager.renderComponentEntry(componentClasses, componentProps, children);
        }
        else
        {
            return children;
        }
    }

    static renderServices(services, serviceProps, children, callback)
    {
        let serviceRefs = {};
        if (typeof services === 'object')
        {
            let result = null;
            for(const serviceKey of Object.keys(services))
            {
                const service = services[serviceKey];
                const ref = React.createRef();
                serviceRefs[serviceKey] = ref;

                if (result)
                {
                    result = React.createElement(service, { ref, ...serviceProps}, result);
                }
                else
                {
                    result = React.createElement(service, { ref, ...serviceProps }, children);
                }
            }

            callback(serviceRefs);
            return result || children;
        }
        else
        {
            callback(serviceRefs);
            return children;
        }
    }

    getCurrentModule()
    {
        return this.currentModule;
    }
}

export default ModuleManager;

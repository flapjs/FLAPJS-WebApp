import React from 'react';
import PropTypes from 'prop-types';

import * as ComponentRenderer from './ComponentRenderer.jsx';

function ModuleServices(props)
{
    const currentModule = props.module;
    if (!currentModule || !('services' in currentModule)) return props.children;

    const providers = getComponentEntriesFromServices(currentModule.services);
    const providerProps = { session: props.session };
    return (
        <>
        {ComponentRenderer.renderNestedComponentEntries(providers, providerProps, props.children)}
        </>
    );
}
ModuleServices.propTypes = {
    children: PropTypes.node,
    module: PropTypes.object,
    session: PropTypes.object,
};

// HACK: This should be its own component, however drawer (especially tabs) expects its children to be panels, not a container.
ModuleServices.renderLayer = function(currentModule, layerID)
{
    if (!currentModule || !('renders' in currentModule)) return null;

    const layers = getComponentEntriesFromRenders(currentModule.renders, layerID);
    const layerProps = {};

    return ComponentRenderer.renderComponentEntries(layers, layerProps) || null;
};

function getComponentEntriesFromServices(services)
{
    const providers = [];
    if (Array.isArray(services))
    {
        for(const service of services)
        {
            if (service.CONTEXT && service.CONTEXT.Provider)
            {
                providers.push(service.CONTEXT.Provider);
            }
        }
    }
    else if (typeof services === 'function')
    {
        if (services.CONTEXT && services.CONTEXT.Provider)
        {
            providers.push(services.CONTEXT.Provider);
        }
    }

    return providers;
}

function getComponentEntriesFromRenders(renders, layerID)
{
    if (typeof renders !== 'object') return [];

    const layers = renders[layerID];
    if (Array.isArray(layers))
    {
        return layers;
    }
    else if (typeof layers === 'function')
    {
        return [ layers ];
    }
    else
    {
        return [];
    }
}

export default ModuleServices;

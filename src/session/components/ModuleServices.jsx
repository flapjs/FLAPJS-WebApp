import React from 'react';
import PropTypes from 'prop-types';

import * as ComponentRenderer from './ComponentRenderer.jsx';

class ModuleServices extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const props = this.props;
        const currentModule = props.module;
        if (!currentModule || !('services' in currentModule)) return props.children;
    
        let providers = getComponentEntriesFromServices(currentModule.services, props.session);
        let providerProps = { session: props.session };
        return (
            <>
            {ComponentRenderer.renderNestedComponentEntries(providers, providerProps, props.children)}
            </>
        );
    }
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

function getComponentEntriesFromServices(services, session)
{
    const providers = [];
    if (Array.isArray(services))
    {
        for(const service of services)
        {
            if (service.CONTEXT)
            {
                providers.push(service.CONTEXT.Provider);
            }
        }
    }
    else if (typeof services === 'function')
    {
        if (services.CONTEXT)
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

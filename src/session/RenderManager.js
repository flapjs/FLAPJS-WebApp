import React from 'react';

class RenderManager
{
    constructor()
    {
        this.renderLayers = new Map();
    }

    clear()
    {
        this.renderLayers.clear();
    }

    add(layerID, ...renderers)
    {
        let result;
        if (this.renderLayers.has(layerID))
        {
            result = this.renderLayers.get(layerID);
        }
        else
        {
            result = [];
            this.renderLayers.set(layerID, result);
        }

        for(const renderer of renderers)
        {
            result.push(renderer);
        }
        return this;
    }

    get(layerID)
    {
        return this.renderLayers.get(layerID);
    }

    render(layerID, props = {})
    {
        const result = [];
        if (this.renderLayers.has(layerID))
        {
            const renderers = this.renderLayers.get(layerID);
            for(const renderer of renderers)
            {
                result.push(React.createElement(renderer, props));
            }
        }

        if (result.length <= 0)
        {
            return null;
        }
        else if (result.length == 1)
        {
            return result[0];
        }
        else
        {
            return result;
        }
    }
}

export default RenderManager;

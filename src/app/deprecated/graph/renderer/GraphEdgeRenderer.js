import React from 'react';

import EdgeRenderer, { DIRECTED_NONE } from 'deprecated/renderer/EdgeRenderer.js';

const GRAPH_EDGE_CONTAINER_STYLE_NAME = 'graph-edge-container';

class GraphEdgeRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const edge = this.props.edge;
        const stroke = this.props.stroke || '#000000';
        const start = edge.getStartPoint();
        const end = edge.getEndPoint();
        const center = edge.getCenterPoint();
        const label = edge.getEdgeLabel();
        const edgeDir = edge.getEdgeDirection();

        return <g className={GRAPH_EDGE_CONTAINER_STYLE_NAME}>
            <EdgeRenderer
                directed={DIRECTED_NONE}
                from={start}
                to={end}
                center={center}
                label={label}
                direction={edgeDir}
                color={stroke} />
        </g>;
    }
}

export default GraphEdgeRenderer;

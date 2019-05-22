import React from 'react';

import Node from 'deprecated/fsa/graph/FSANode.js';

import Config from 'deprecated/config.js';

class InitialMarkerRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const node = this.props.node;
        //node.x + offset marker back to center if not a node (or is a pointer)
        const x = node.x + (!(node instanceof Node) ? -Config.INITIAL_MARKER_OFFSET_X : 0);
        const y = node.y;
        const r = Config.NODE_RADIUS;
        const d = r * 2;
        return <g className="graph-initial-container">
            <path className="graph-initial" d={
                'M' + (x - r) + ' ' + (y) +
        ' L' + (x - d) + ' ' + (y - r) +
        ' L' + (x - d) + ' ' + (y + r) +
        ' Z'}
            fill="none"

            stroke="#000000"/>
        </g>;
    }
}

export default InitialMarkerRenderer;

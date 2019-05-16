import React from 'react';

import PDANode from 'modules/pda/graph/PDANode.js';

const NODE_RADIUS = 16;
const INITIAL_MARKER_OFFSET_X = -(NODE_RADIUS + (NODE_RADIUS / 2));

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
        const x = node.x + (!(node instanceof PDANode) ? -INITIAL_MARKER_OFFSET_X : 0);
        const y = node.y;
        const r = NODE_RADIUS;
        const d = r * 2;
        return (
            <g className="graph-initial-container">
                <path className="graph-initial" d={
                    'M' + (x - r) + ' ' + (y) +
          ' L' + (x - d) + ' ' + (y - r) +
          ' L' + (x - d) + ' ' + (y + r) +
          ' Z'}
                fill="none"

                stroke="#000000"/>
            </g>
        );
    }
}

export default InitialMarkerRenderer;

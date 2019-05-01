import React from 'react';

const GRAPH_NODE_CONTAINER_STYLE_NAME = 'graph-node-container';
const GRAPH_NODE_BODY_STYLE_NAME = 'graph-node';
const GRAPH_NODE_LABEL_STYLE_NAME = 'graph-node-label';

class GraphNodeRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const node = this.props.node;
        const fill = this.props.fill || '#FFFFFF';
        const stroke = this.props.stroke || '#000000';

        const label = node.getNodeLabel() || '';

        return (
            <g className={GRAPH_NODE_CONTAINER_STYLE_NAME}>
                {/*Outer circle*/}
                <circle className={GRAPH_NODE_BODY_STYLE_NAME}
                    cx={node.x} cy={node.y}
                    r={node.getNodeSize()}

                    fill={fill}
                    stroke={stroke}/>

                {/*Label*/}
                <text className={GRAPH_NODE_LABEL_STYLE_NAME}
                    x={node.x} y={node.y + 4}
                    pointerEvents="none"
                    style={{
                        userSelect: 'none',
                        fontSize: (1 - Math.min(Math.max(label.length - 2, 0) / 6, 0.5)) + 'em'
                    }}
                    textAnchor="middle">
                    {label}
                </text>
            </g>
        );
    }
}

export default GraphNodeRenderer;

import React from 'react';

class FSANodeRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
    //TODO: Refer to app.css for comparable colors
        const node = this.props.node;
        const nodeLabel = node.getNodeLabel();

        return (
            <g className="graph-node-container">
                {/*Outer circle*/}
                <circle className="graph-node"
                    cx={node.x}
                    cy={node.y}
                    r={node.getNodeSize()}

                    fill="#FEE781"
                    stroke="#000000"/>

                {/*Inner circle*/}
                {node.getNodeAccept() &&
          <circle className="graph-node-inner"
              cx={node.x}
              cy={node.y}
              r={node.getNodeSize() * 0.75}
              fill="none"

              stroke="#000000"/>}

                {/*Label*/}
                <text className="graph-node-label"
                    x={node.x} y={node.y + 4}
                    pointerEvents="none"
                    style={{
                        userSelect: 'none',
                        fontSize: (1 - Math.min(Math.max(nodeLabel.length - 2, 0) / 6, 0.5)) + 'em'
                    }}
                    textAnchor="middle">
                    {nodeLabel}
                </text>
            </g>
        );
    }
}

export default FSANodeRenderer;

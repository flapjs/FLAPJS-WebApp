import React from 'react';

import Config from 'config.js';

class NodeRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const node = this.props.node;
    return <g className="graph-node-container">
      //Outer circle
      <circle className="graph-node"
        cx={node.x}
        cy={node.y}
        r={Config.NODE_RADIUS}/>

      //Inner circle
      {node.accept &&
        <circle className="graph-node-inner"
          cx={node.x}
          cy={node.y}
          r={Config.NODE_RADIUS_INNER}
          fill="none"/>}

      //Label
      <text className="graph-node-label"
        x={node.x} y={node.y + 4}
        pointerEvents="none"
        style={{userSelect: "none"}}>
        {node.label}
      </text>
    </g>;
  }
}

export default NodeRenderer;

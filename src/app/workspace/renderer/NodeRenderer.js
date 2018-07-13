import React from 'react';

import * as Config from 'config.js';

class NodeRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const node = this.props.node;
    return <g>
      //Outer circle
      <circle
        cx={node.x}
        cy={node.y}
        r={Config.NODE_RADIUS}
        stroke={Config.NODE_STROKE_STYLE}
        fill={Config.NODE_FILL_STYLE} />

      //Inner circle
      {node.accept &&
        <circle
          cx={node.x}
          cy={node.y}
          r={Config.NODE_RADIUS_INNER}
          stroke={Config.NODE_STROKE_STYLE}
          fill="none" />}

      //Label
      <text
        x={node.x} y={node.y + 4}
        textAnchor={Config.NODE_TEXT_ANCHOR}
        font={Config.NODE_FONT}
        stroke={Config.NODE_STROKE_STYLE}
        fill={Config.NODE_TEXT_FILL_STYLE}
        pointerEvents="none">
        {node.label}
      </text>
    </g>;
  }
}

export default NodeRenderer;

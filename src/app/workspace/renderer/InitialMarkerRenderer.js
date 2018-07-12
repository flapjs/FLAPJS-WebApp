import React from 'react';

import Node from 'graph/Node.js';

import * as Config from 'config.js';

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
    return <g>
      <path d={
        "M" + (x - r) + " " + (y) +
        " L" + (x - d) + " " + (y - r) +
        " L" + (x - d) + " " + (y + r) +
        " Z"}
        stroke={Config.EDGE_STROKE_STYLE}
        fill="none" />
    </g>;
  }
}

export default InitialMarkerRenderer;

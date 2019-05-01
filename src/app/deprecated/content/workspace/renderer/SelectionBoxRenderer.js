import React from 'react';

import Config from 'deprecated/config.js';

class SelectionBoxRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  /** @override */
  render()
  {
    const visible = this.props.visible;
    const fromX = this.props.fromX || 0;
    const fromY = this.props.fromY || 0;
    const toX = this.props.toX || fromX + 1;
    const toY = this.props.toY || fromY + 1;

    const dx = toX - fromX;
    const dy = toY - fromY;

    return <g className="graph-selection-container">
    { visible &&
      <rect className="graph-selection"
        x={dx < 0 ? toX : fromX}
        y={dy < 0 ? toY : fromY}
        width={dx < 0 ? -dx : dx}
        height={dy < 0 ? -dy : dy}/> }
    </g>;
  }
}

export default SelectionBoxRenderer;

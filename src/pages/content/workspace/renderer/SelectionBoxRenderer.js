import React from 'react';

import Config from 'config.js';

class SelectionBoxRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const src = this.props.src;

    //Optional args to override default selection box coords with x, y, width, height
    let fromX = this.props.x || (src && src.beginX) || 0;
    let fromY = this.props.y || (src && src.beginY) || 0;
    let toX = this.props.width ? (fromX + this.props.width) : (src.endX || 0);
    let toY = this.props.height ? (fromY + this.props.height) : (src.endY || 0);

    const dx = toX - fromX;
    const dy = toY - fromY;

    return <g className="graph-selection-container">
    {(!src || src.isActive()) &&
      <rect className="graph-selection"
        x={dx < 0 ? toX : fromX}
        y={dy < 0 ? toY : fromY}
        width={dx < 0 ? -dx : dx}
        height={dy < 0 ? -dy : dy}/>}
    </g>;
  }
}

export default SelectionBoxRenderer;

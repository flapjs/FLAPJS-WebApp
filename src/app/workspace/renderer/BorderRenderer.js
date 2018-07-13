import React from 'react';

import * as Config from 'config.js';

class BorderRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <g>
      <rect
        x={-100} y={-100}
        width={200} height={200}
        strokeDasharray={Config.BORDER_LINE_DASH}
        strokeWidth={Config.BORDER_LINE_WIDTH}
        stroke={this.props.mode > 1 ? "red" :
          this.props.mode > 0 ? Config.BORDER_STROKE_STYLE :
          "none"}
        fill="none"/>
    </g>;
  }
}

export default BorderRenderer;

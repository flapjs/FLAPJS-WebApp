import React from 'react';
import Style from './WorkspaceView.css';

const DEFAULT_WORKSPACE_SIZE = 300;

class WorkspaceView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = null;
  }

  //Override
  render()
  {
    const viewport = this.props.viewport;
    const offsetX = viewport.getOffsetX();
    const offsetY = viewport.getOffsetY();
    const viewSize = DEFAULT_WORKSPACE_SIZE * Math.max(Number.MIN_VALUE, viewport.getScale());
    const halfViewSize = viewSize / 2;
    return (
      <svg ref={ref=>this.ref=ref} id={this.props.id}
        className={"workspace-container" +
          " " + this.props.className}
        style={this.props.style}
        viewBox={(-halfViewSize) +
          " " + (-halfViewSize) +
          " " + viewSize +
          " " + viewSize}
        xmlns="http://www.w3.org/2000/svg">
        <g className="workspace-content" transform={"translate(" + offsetX + " " + offsetY + ")"}>
          {this.props.children}
        </g>
      </svg>
    );
  }
}

export default WorkspaceView;

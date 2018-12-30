import React from 'react';
import Style from './WorkspaceView.css';

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
    const offsetX = 0;
    const offsetY = 0;
    const viewSize = 100;
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

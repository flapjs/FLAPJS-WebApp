import React from 'react';

import './Viewport.css';

import LabelEditor from './LabelEditor.js';
import TrashCan from './TrashCan.js';

class Viewport extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = React.createRef();
    this.labelEditor = React.createRef();

    this.state = {
      mode: Viewport.NORMAL
    };
  }

  render()
  {
    return <div className="viewport-container" ref={ref=>this.ref=ref}
      style={{outlineColor: getModeColor(this.state.mode)}}>
      <LabelEditor screen={this.props.app.workspace.ref} ref={ref=>this.labelEditor=ref}/>
      <TrashCan controller={this.props.controller} viewport={this}/>
    </div>;
  }
}
Viewport.NORMAL = 0;
Viewport.WAITING = 1;
Viewport.DANGEROUS = 2;

function getModeColor(mode)
{
  switch(mode)
  {
    case Viewport.WAITING:
      return "rgba(0,0,0,0.1)";
    case Viewport.DANGEROUS:
      return "#E35B5B";
    case Viewport.NORMAL:
    default:
      return "rgba(0,0,0,0.02)";
  }
}

export default Viewport;

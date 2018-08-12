import React from 'react';
import './Viewport.css';

import LabelEditor from './LabelEditor.js';
import TrashCan from './TrashCan.js';
import TestTray from './testmode/TestTray.js';

class Viewport extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = React.createRef();
    this.labelEditor = React.createRef();

    this.state = {
      prevMode: Viewport.NORMAL,
      mode: Viewport.NORMAL
    };
  }

  render()
  {
    return <div className={"viewport-container viewport-" + this.state.mode} ref={ref=>this.ref=ref}>
      <LabelEditor controller={this.props.controller}
        graph={this.props.app.graph}
        machineBuilder={this.props.app.machineBuilder}
        screen={this.props.app.workspace.ref}
        ref={ref=>this.labelEditor=ref}/>
      <TrashCan controller={this.props.controller}
        viewport={this}/>
      <TestTray/>
    </div>;
  }
}
Viewport.NORMAL = "normal";
Viewport.WAITING = "waiting";
Viewport.DANGEROUS = "dangerous";

export default Viewport;

import React from 'react';
import './Viewport.css';

import LabelEditor from './LabelEditor.js';
import TrashCan from './TrashCan.js';
import TestTray from './TestTray.js';
import CursorMode from './CursorMode.js';

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
    const tester = this.props.tester;
    return <div className={"viewport-container viewport-" + this.state.mode} ref={ref=>this.ref=ref}>
      <LabelEditor controller={this.props.controller}
        graph={this.props.app.graph}
        machineBuilder={this.props.app.machineBuilder}
        screen={this.props.app.workspace.ref}
        ref={ref=>this.labelEditor=ref}/>
      {
        tester.getStepByStepMode() ?
        <div className="anchor-bottom-left" style={{width: "100%"}}>
          <TestTray tester={tester}/>
        </div>
        :
        <span>
          <div className="anchor-bottom-left" style={{width: "100%"}}>
            <CursorMode controller={this.props.controller}/>
          </div>
          <div className="anchor-bottom-right">
            <TrashCan controller={this.props.controller}
              viewport={this}/>
          </div>
        </span>
      }
    </div>;
  }
}
Viewport.NORMAL = "normal";
Viewport.WAITING = "waiting";
Viewport.TESTING = "testing";
Viewport.DANGEROUS = "dangerous";

export default Viewport;

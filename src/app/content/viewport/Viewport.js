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

    this.ref = null;
    this.labelEditor = null;

    this.state = {
      prevMode: Viewport.NORMAL,
      mode: Viewport.NORMAL
    };
  }

  render()
  {
    const inputController = this.props.inputController;
    const graphController = this.props.graphController;
    const machineController = this.props.machineController;
    const tester = this.props.tester;
    const screen = this.props.screen;

    return <div className={"viewport-container viewport-" + this.state.mode} ref={ref=>this.ref=ref}>
      <LabelEditor ref={ref=>this.labelEditor=ref}
        inputController={inputController}
        graphController={graphController}
        machineController={machineController}
        screen={screen}/>
      {
        tester.getStepByStepMode() ?
        <div className="anchor-bottom-left" style={{width: "100%"}}>
          <TestTray tester={tester}/>
        </div>
        :
        <span>
          <div className="anchor-bottom-left" style={{width: "100%"}}>
            <CursorMode inputController={inputController}/>
          </div>
          <div className="anchor-bottom-right">
            <TrashCan inputController={inputController} viewport={this}/>
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

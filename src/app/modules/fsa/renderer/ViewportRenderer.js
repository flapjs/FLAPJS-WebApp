import React from 'react';

import TrashCan from 'content/viewport/TrashCan.js';
import TestTray from 'content/viewport/TestTray.js';
import CursorMode from 'content/viewport/CursorMode.js';

class ViewportRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const viewport = this.props.viewport;
    const app = this.props.app;
    const inputController = app.getInputController();
    const graphController = app.getGraphController();
    const machineController = app.getMachineController();
    const tester = app.getCurrentModule().getTestingManager();

    return <span>
    {
      tester.getStepByStepMode() ?
      <div className="anchor-bottom-left" style={{width: "100%"}}>
        <TestTray tester={tester} graphController={graphController}/>
      </div>
      :
      <span>
        <div className="anchor-bottom-left" style={{width: "100%"}}>
          <CursorMode inputController={inputController} graphController={graphController}/>
        </div>
        <div className="anchor-bottom-right">
          <TrashCan inputController={inputController} viewport={viewport}/>
        </div>
      </span>
    }
    </span>;
  }
}
export default ViewportRenderer;
